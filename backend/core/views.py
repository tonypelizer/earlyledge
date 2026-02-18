from datetime import date, datetime, timedelta

from django.db.models import Count, Q
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


class SkillAnalysisView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		child_id = request.query_params.get("child_id")
		if not child_id:
			return Response({"error": "child_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		child = get_object_or_404(Child, id=child_id, user=request.user)
		
		# Analyze last 14 days of activities
		two_weeks_ago = date.today() - timedelta(days=14)
		
		# Get all skills and their usage in the last 2 weeks
		all_skills = SkillCategory.objects.all()
		recent_activities = Activity.objects.filter(
			child=child,
			activity_date__gte=two_weeks_ago
		)
		
		# Count skill usage
		skill_counts = {}
		for skill in all_skills:
			count = recent_activities.filter(skills=skill).count()
			skill_counts[skill.name] = count
		
		# Find most used and least used skills
		total_activities = recent_activities.count()
		if total_activities == 0:
			return Response({
				"rich_skills": [],
				"missing_skills": list(skill_counts.keys()),
				"personalized_suggestions": [],
				"analysis_text": "No activities logged in the past two weeks. Start by adding some activities!"
			})
		
		# Sort skills by usage
		sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
		
		# Rich skills (top 2-3 with multiple activities)
		rich_skills = [name for name, count in sorted_skills if count >= 2][:3]
		
		# Separate completely missing skills (0 activities) from low-activity skills (1 activity)
		zero_activity_skills = [name for name, count in sorted_skills if count == 0]
		low_activity_skills = [name for name, count in sorted_skills if count == 1]
		
		# Prioritize zero-activity skills, then low-activity skills
		missing_skills = zero_activity_skills + low_activity_skills
		
		# Get suggestions for all skills (both rich and missing)
		all_available_skills = list(skill_counts.keys())  # Include ALL skills, not just rich + missing
		suggestions_queryset = Suggestion.objects.filter(
			skill__name__in=all_available_skills,
			min_age__lte=child.age or 8,
			max_age__gte=child.age or 4
		).select_related('skill')
		
		personalized_suggestions = []
		# First add missing skills suggestions (prioritized)
		for suggestion in suggestions_queryset.filter(skill__name__in=missing_skills):
			personalized_suggestions.append({
				"id": suggestion.id,
				"title": suggestion.title,
				"description": suggestion.description,
				"skill_name": suggestion.skill.name,
				"duration_range": f"{suggestion.min_age}-{suggestion.max_age} years"
			})
		
		# Then add rich skills suggestions (secondary priority)
		for suggestion in suggestions_queryset.filter(skill__name__in=rich_skills):
			personalized_suggestions.append({
				"id": suggestion.id,
				"title": suggestion.title,
				"description": suggestion.description,
				"skill_name": suggestion.skill.name,
				"duration_range": f"{suggestion.min_age}-{suggestion.max_age} years"
			})
		
		# Finally add suggestions for any other skills (so all skills appear in filters)
		other_skills = [name for name in skill_counts.keys() if name not in rich_skills and name not in missing_skills]
		for suggestion in suggestions_queryset.filter(skill__name__in=other_skills):
			personalized_suggestions.append({
				"id": suggestion.id,
				"title": suggestion.title,
				"description": suggestion.description,
				"skill_name": suggestion.skill.name,
				"duration_range": f"{suggestion.min_age}-{suggestion.max_age} years"
			})

		# Ensure ALL skills appear in the response (add placeholders for skills without age-appropriate suggestions)
		skills_with_suggestions = set(s["skill_name"] for s in personalized_suggestions)
		for skill_name in skill_counts.keys():
			if skill_name not in skills_with_suggestions:
				# Add a generic placeholder so the skill appears in filters
				personalized_suggestions.append({
					"id": f"placeholder_{skill_name.lower().replace(' ', '_').replace('/', '_')}",
					"title": f"Explore {skill_name}",
					"description": f"Great {skill_name.lower()} activities are perfect for developing important skills. Check back for more suggestions!",
					"skill_name": skill_name,
					"duration_range": "All ages"
				})
		
		# Generate analysis text
		if rich_skills and missing_skills:
			rich_text = " and ".join(rich_skills[:2]) if len(rich_skills) > 1 else rich_skills[0]
			missing_text = " or ".join(missing_skills[:2])
			analysis_text = f"This week has been rich in {rich_text} activities. You might enjoy adding some {missing_text} activities."
		elif rich_skills:
			rich_text = " and ".join(rich_skills[:2]) if len(rich_skills) > 1 else rich_skills[0]
			analysis_text = f"Great focus on {rich_text} activities recently! Consider exploring some other skill areas."
		else:
			analysis_text = "You've been exploring various skills. Keep up the great work!"
		
		return Response({
			"rich_skills": rich_skills,
			"missing_skills": missing_skills,
			"personalized_suggestions": personalized_suggestions,
			"analysis_text": analysis_text,
			"total_recent_activities": total_activities
		})


class ReportsView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		child_id = request.query_params.get("child_id")
		time_range = request.query_params.get("time_range", "last3months")
		
		if not child_id:
			return Response({"error": "child_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		child = get_object_or_404(Child, id=child_id, user=request.user)
		
		# Calculate date ranges
		today = date.today()
		if time_range == "last30days":
			start_date = today - timedelta(days=30)
		elif time_range == "last3months":
			start_date = today - timedelta(days=90)
		elif time_range == "thisyear":
			start_date = date(today.year, 1, 1)
		else:
			start_date = today - timedelta(days=90)  # default
		
		# Get activities in range
		activities = Activity.objects.filter(
			child=child,
			activity_date__gte=start_date,
			activity_date__lte=today
		).prefetch_related('skills')
		
		# Calculate total stats
		total_activities = activities.count()
		total_minutes = sum(a.duration_minutes or 0 for a in activities)
		total_hours = total_minutes // 60
		remaining_minutes = total_minutes % 60
		
		# Calculate activities per week
		days_in_range = (today - start_date).days
		weeks_in_range = max(days_in_range / 7, 1)
		activities_per_week = round(total_activities / weeks_in_range, 1)
		
		# Get skill distribution
		skill_counts = {}
		for activity in activities:
			for skill in activity.skills.all():
				skill_counts[skill.name] = skill_counts.get(skill.name, 0) + 1
		
		# Sort skills by count
		sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
		
		# Generate growth highlights
		growth_highlights = []
		if sorted_skills:
			top_skill = sorted_skills[0][0]
			growth_highlights.append(f"{top_skill} activities have been thriving recently")
		
		if len(sorted_skills) >= 3:
			growth_highlights.append(f"Balanced exploration across {len(sorted_skills)} skill areas")
		elif len(sorted_skills) == 0:
			growth_highlights.append("Ready to start exploring new activities together!")
		
		# Monthly breakdown for chart
		monthly_data = []
		current_month = start_date.replace(day=1)
		
		while current_month <= today.replace(day=1):
			month_end = (current_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
			month_activities = activities.filter(
				activity_date__gte=current_month,
				activity_date__lte=min(month_end, today)
			)
			
			month_skill_counts = {}
			for activity in month_activities:
				for skill in activity.skills.all():
					month_skill_counts[skill.name] = month_skill_counts.get(skill.name, 0) + 1
			
			monthly_data.append({
				"month": current_month.strftime("%B %Y"),
				**month_skill_counts
			})
			
			current_month = (current_month + timedelta(days=32)).replace(day=1)
		
		return Response({
			"total_activities": total_activities,
			"total_hours": total_hours,
			"total_minutes": remaining_minutes,
			"activities_per_week": activities_per_week,
			"skill_distribution": sorted_skills,
			"growth_highlights": growth_highlights,
			"monthly_data": monthly_data,
			"time_range": time_range
		})
