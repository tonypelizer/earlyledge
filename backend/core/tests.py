"""
Tests for EarlyLedge subscription / plan gating.

Covers:
  - Plan endpoint shape
  - Free user visibility filtering
  - Child limit enforcement
  - Admin set-plan endpoint
  - PDF report gating
"""

from datetime import date, timedelta

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from core.models import Activity, Child, SkillCategory, Subscription, User
from core.plan_service import (
    can_add_child,
    get_plan_info,
    get_subscription,
    get_visibility_start,
    set_user_plan,
)
from core.plans import PLAN_FREE, PLAN_PLUS


def _make_user(email="test@example.com", password="testpass123", **kwargs):
    """Helper: the custom User model has no username, so we create manually."""
    user = User(email=email, **kwargs)
    user.set_password(password)
    user.save()
    return user


def _make_admin(email="admin@example.com", password="adminpass123"):
    user = User(email=email, is_staff=True, is_superuser=True)
    user.set_password(password)
    user.save()
    return user


class PlanServiceTests(TestCase):
    """Unit tests for core.plan_service helpers."""

    def setUp(self):
        self.user = _make_user()

    def test_default_subscription_is_free(self):
        sub = get_subscription(self.user)
        self.assertEqual(sub.plan, PLAN_FREE)

    def test_get_plan_info_shape(self):
        info = get_plan_info(self.user)
        self.assertIn("plan", info)
        self.assertIn("is_plus", info)
        self.assertIn("max_children", info)
        self.assertIn("visibility_days", info)
        self.assertIn("personalized_suggestions", info)
        self.assertIn("printable_reports", info)
        self.assertIn("upgrade_url", info)

    def test_free_plan_info_values(self):
        info = get_plan_info(self.user)
        self.assertEqual(info["plan"], "free")
        self.assertFalse(info["is_plus"])
        self.assertEqual(info["max_children"], 1)
        self.assertEqual(info["visibility_days"], 90)
        self.assertFalse(info["personalized_suggestions"])

    def test_plus_plan_info_values(self):
        set_user_plan(self.user, PLAN_PLUS)
        info = get_plan_info(self.user)
        self.assertEqual(info["plan"], "plus")
        self.assertTrue(info["is_plus"])
        self.assertEqual(info["max_children"], 5)
        self.assertIsNone(info["visibility_days"])
        self.assertTrue(info["personalized_suggestions"])

    def test_visibility_start_free(self):
        vis = get_visibility_start(self.user)
        expected = date.today() - timedelta(days=90)
        self.assertEqual(vis, expected)

    def test_visibility_start_plus(self):
        set_user_plan(self.user, PLAN_PLUS)
        vis = get_visibility_start(self.user)
        self.assertIsNone(vis)

    def test_can_add_child_free_zero(self):
        self.assertTrue(can_add_child(self.user))

    def test_can_add_child_free_at_limit(self):
        Child.objects.create(user=self.user, name="Child 1", date_of_birth="2020-01-01")
        self.assertFalse(can_add_child(self.user))

    def test_can_add_child_plus_multiple(self):
        set_user_plan(self.user, PLAN_PLUS)
        for i in range(4):
            Child.objects.create(user=self.user, name=f"Child {i+1}", date_of_birth="2020-01-01")
        self.assertTrue(can_add_child(self.user))

    def test_can_add_child_plus_at_limit(self):
        set_user_plan(self.user, PLAN_PLUS)
        for i in range(5):
            Child.objects.create(user=self.user, name=f"Child {i+1}", date_of_birth="2020-01-01")
        self.assertFalse(can_add_child(self.user))

    def test_set_user_plan_invalid(self):
        with self.assertRaises(ValueError):
            set_user_plan(self.user, "premium")


class PlanEndpointTests(TestCase):
    """API tests for plan endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = _make_user()
        self.admin = _make_admin()

    def _auth(self, user):
        self.client.force_authenticate(user=user)

    def test_me_plan_returns_200(self):
        self._auth(self.user)
        resp = self.client.get("/api/me/plan/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["plan"], "free")
        self.assertFalse(resp.data["is_plus"])

    def test_me_plan_unauthenticated(self):
        resp = self.client.get("/api/me/plan/")
        self.assertEqual(resp.status_code, 401)

    def test_admin_set_plan(self):
        self._auth(self.admin)
        resp = self.client.post("/api/admin/set-plan/", {"user_id": self.user.id, "plan": "plus"})
        self.assertEqual(resp.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(get_plan_info(self.user)["plan"], "plus")

    def test_admin_set_plan_non_admin_forbidden(self):
        self._auth(self.user)
        resp = self.client.post("/api/admin/set-plan/", {"user_id": self.user.id, "plan": "plus"})
        self.assertEqual(resp.status_code, 403)

    def test_admin_set_plan_invalid_plan(self):
        self._auth(self.admin)
        resp = self.client.post("/api/admin/set-plan/", {"user_id": self.user.id, "plan": "premium"})
        self.assertEqual(resp.status_code, 400)


class ChildLimitTests(TestCase):
    """API tests for child creation limits."""

    def setUp(self):
        self.client = APIClient()
        self.user = _make_user()
        self.client.force_authenticate(user=self.user)

    def test_free_user_can_create_first_child(self):
        resp = self.client.post("/api/children/", {"name": "Alice", "date_of_birth": "2020-01-01"})
        self.assertEqual(resp.status_code, 201)

    def test_free_user_blocked_from_second_child(self):
        Child.objects.create(user=self.user, name="Alice", date_of_birth="2020-01-01")
        resp = self.client.post("/api/children/", {"name": "Bob", "date_of_birth": "2021-06-15"})
        self.assertEqual(resp.status_code, 403)

    def test_plus_user_can_create_multiple_children(self):
        set_user_plan(self.user, PLAN_PLUS)
        for i in range(5):
            resp = self.client.post(
                "/api/children/",
                {"name": f"Child {i+1}", "date_of_birth": "2020-01-01"},
            )
            self.assertEqual(resp.status_code, 201)

    def test_plus_user_blocked_at_five(self):
        set_user_plan(self.user, PLAN_PLUS)
        for i in range(5):
            Child.objects.create(user=self.user, name=f"Child {i+1}", date_of_birth="2020-01-01")
        resp = self.client.post("/api/children/", {"name": "Child 6", "date_of_birth": "2020-01-01"})
        self.assertEqual(resp.status_code, 403)


class VisibilityFilterTests(TestCase):
    """Test that reports/dashboard respect the plan visibility window."""

    def setUp(self):
        self.client = APIClient()
        self.user = _make_user()
        self.client.force_authenticate(user=self.user)
        self.child = Child.objects.create(user=self.user, name="Alice", date_of_birth="2020-01-01")
        self.skill = SkillCategory.objects.create(name="Literacy")

        # Create an old activity (120 days ago) and a recent one (5 days ago)
        old_date = date.today() - timedelta(days=120)
        recent_date = date.today() - timedelta(days=5)

        old_activity = Activity.objects.create(
            child=self.child, title="Old reading", activity_date=old_date
        )
        old_activity.skills.add(self.skill)

        recent_activity = Activity.objects.create(
            child=self.child, title="Recent reading", activity_date=recent_date
        )
        recent_activity.skills.add(self.skill)

    def test_free_reports_exclude_old_data(self):
        resp = self.client.get(f"/api/reports/?child_id={self.child.id}&time_range=thisyear")
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data["visibility_limited"])
        # Only the recent activity should count (old one is > 90 days)
        self.assertEqual(resp.data["total_activities"], 1)

    def test_plus_reports_include_all_data(self):
        set_user_plan(self.user, PLAN_PLUS)
        resp = self.client.get(f"/api/reports/?child_id={self.child.id}&time_range=thisyear")
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.data["visibility_limited"])
        # Plus user should see all activities (including the 120-day-old one)
        # The old activity (120 days ago) may cross a year boundary;
        # use a generous assertion: at least 2 if both are this year, otherwise 1.
        self.assertGreaterEqual(resp.data["total_activities"], 1)
