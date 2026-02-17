from datetime import date, datetime, timedelta

from django.db.models import Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from weasyprint import HTML

from core.models import Activity, Child, SkillCategory, Suggestion
from core.serializers import (
	ActivitySerializer,
	ChildSerializer,
	SignupSerializer,
	SkillCategorySerializer,
	SuggestionSerializer,
	build_skill_counts_for_child,
)


class SignupView(generics.CreateAPIView):
	serializer_class = SignupSerializer
	permission_classes = [permissions.AllowAny]


class ChildViewSet(viewsets.ModelViewSet):
	serializer_class = ChildSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Child.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class ActivityViewSet(viewsets.ModelViewSet):
	serializer_class = ActivitySerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		queryset = Activity.objects.filter(child__user=self.request.user).prefetch_related("skills", "child")
		child_id = self.request.query_params.get("child_id")
		if child_id:
			queryset = queryset.filter(child_id=child_id)
		return queryset


class SkillCategoryListView(generics.ListAPIView):
	queryset = SkillCategory.objects.all()
	serializer_class = SkillCategorySerializer
	permission_classes = [permissions.IsAuthenticated]


class WeeklyDashboardView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		child_id = request.query_params.get("child_id")
		if not child_id:
			return Response({"detail": "child_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		child = get_object_or_404(Child, id=child_id, user=request.user)

		today = date.today()
		date_from = today - timedelta(days=6)

		activities = child.activities.filter(activity_date__range=[date_from, today]).prefetch_related("skills")
		activity_count = activities.count()

		skill_counts = build_skill_counts_for_child(child, date_from, today)
		missing_skills = [entry["skill"] for entry in skill_counts if entry["count"] == 0]

		recent_activities = []
		for activity in activities.order_by("-activity_date", "-created_at")[:10]:
			recent_activities.append(
				{
					"id": activity.id,
					"title": activity.title,
					"activity_date": activity.activity_date,
					"duration_minutes": activity.duration_minutes,
					"skills": [skill.name for skill in activity.skills.all()],
				}
			)

		return Response(
			{
				"activity_count": activity_count,
				"skill_counts": skill_counts,
				"missing_skills": missing_skills,
				"recent_activities": recent_activities,
			}
		)


class SuggestionListView(generics.ListAPIView):
	serializer_class = SuggestionSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		queryset = Suggestion.objects.select_related("skill")
		skill_id = self.request.query_params.get("skill_id")
		child_id = self.request.query_params.get("child_id")

		if skill_id:
			queryset = queryset.filter(skill_id=skill_id)

		if child_id:
			child = get_object_or_404(Child, id=child_id, user=self.request.user)
			if child.age is None:
				return queryset.none()
			queryset = queryset.filter(min_age__lte=child.age, max_age__gte=child.age)

		return queryset.order_by("?")[:3]


class MonthlySnapshotPdfView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		child_id = request.query_params.get("child_id")
		month_value = request.query_params.get("month")

		if not child_id or not month_value:
			return Response({"detail": "child_id and month are required"}, status=status.HTTP_400_BAD_REQUEST)

		child = get_object_or_404(Child, id=child_id, user=request.user)
		month_start = datetime.strptime(month_value, "%Y-%m").date().replace(day=1)
		if month_start.month == 12:
			month_end = month_start.replace(year=month_start.year + 1, month=1, day=1) - timedelta(days=1)
		else:
			month_end = month_start.replace(month=month_start.month + 1, day=1) - timedelta(days=1)

		activities = child.activities.filter(activity_date__range=[month_start, month_end]).prefetch_related("skills")
		total_activities = activities.count()

		skill_distribution = (
			activities.values("skills__name")
			.annotate(count=Count("id"))
			.order_by("skills__name")
		)

		activities_html = "".join(
			[
				f"<li><strong>{activity.activity_date}</strong> — {activity.title}"
				f" ({', '.join([s.name for s in activity.skills.all()])})</li>"
				for activity in activities
			]
		)
		skills_html = "".join(
			[f"<li>{row['skills__name'] or 'Unmapped'}: {row['count']}</li>" for row in skill_distribution]
		)

		html = f"""
		<html>
		  <head>
			<style>
			  body {{ font-family: Arial, sans-serif; color: #2f3b2f; padding: 24px; }}
			  h1 {{ color: #3f5f4a; margin-bottom: 4px; }}
			  h2 {{ color: #516a5a; margin-top: 20px; }}
			  .meta {{ color: #67766d; margin-bottom: 16px; }}
			  ul {{ padding-left: 20px; }}
			</style>
		  </head>
		  <body>
			<h1>EarlyLedge Monthly Snapshot</h1>
			<div class="meta">{child.name} • {month_start.strftime('%B %Y')}</div>
			<p>Total activities: <strong>{total_activities}</strong></p>

			<h2>Skill distribution</h2>
			<ul>{skills_html or '<li>No activities logged.</li>'}</ul>

			<h2>Activities</h2>
			<ul>{activities_html or '<li>No activities logged.</li>'}</ul>
		  </body>
		</html>
		"""

		pdf = HTML(string=html).write_pdf()
		response = HttpResponse(pdf, content_type="application/pdf")
		response["Content-Disposition"] = (
			f'attachment; filename="earlyledge-{child.name.lower()}-{month_value}.pdf"'
		)
		return response
