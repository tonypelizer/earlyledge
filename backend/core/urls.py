from django.urls import path
from rest_framework.routers import DefaultRouter

from core.views import (
    ActivityViewSet,
    ChildViewSet,
    MonthlySnapshotPdfView,
    SignupView,
    SkillAnalysisView,
    SkillCategoryListView,
    SuggestionListView,
    WeeklyDashboardView,
)

router = DefaultRouter()
router.register("children", ChildViewSet, basename="children")
router.register("activities", ActivityViewSet, basename="activities")

urlpatterns = [
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path("skills/", SkillCategoryListView.as_view(), name="skills"),
    path("dashboard/weekly/", WeeklyDashboardView.as_view(), name="weekly-dashboard"),
    path("suggestions/", SuggestionListView.as_view(), name="suggestions"),
    path("skill-analysis/", SkillAnalysisView.as_view(), name="skill-analysis"),
    path("reports/monthly/", MonthlySnapshotPdfView.as_view(), name="monthly-report"),
]

urlpatterns += router.urls
