from django.urls import path
from rest_framework.routers import DefaultRouter

from core.views import (
    ActivityViewSet,
    AdminSetPlanView,
    ChildViewSet,
    MonthlySnapshotPdfView,
	MyPlanView,
	ReflectionViewSet,
	ReportsView,
    SignupView,
    SkillAnalysisView,
    SkillCategoryListView,
    SuggestionListView,
    WeeklyDashboardView,
)

router = DefaultRouter()
router.register("children", ChildViewSet, basename="children")
router.register("activities", ActivityViewSet, basename="activities")
router.register("reflections", ReflectionViewSet, basename="reflections")

urlpatterns = [
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path("skills/", SkillCategoryListView.as_view(), name="skills"),
    path("dashboard/weekly/", WeeklyDashboardView.as_view(), name="weekly-dashboard"),
    path("suggestions/", SuggestionListView.as_view(), name="suggestions"),
    path("skill-analysis/", SkillAnalysisView.as_view(), name="skill-analysis"),
    path("reports/", ReportsView.as_view(), name="reports"),
    path("reports/monthly/", MonthlySnapshotPdfView.as_view(), name="monthly-report"),
    # Plan endpoints
    path("me/plan/", MyPlanView.as_view(), name="my-plan"),
    path("admin/set-plan/", AdminSetPlanView.as_view(), name="admin-set-plan"),
]

urlpatterns += router.urls
