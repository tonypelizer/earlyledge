"""
Centralised plan / subscription helpers.

Every view that needs plan-aware behaviour should call these functions
rather than reaching into models or constants directly.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import TYPE_CHECKING

from django.utils import timezone

from core.plans import PLAN_FREE, PLAN_LIMITS, PLAN_PLUS

if TYPE_CHECKING:
    from core.models import Subscription, User


def get_subscription(user: "User") -> "Subscription":
    """Return the user's Subscription, creating a Free one if absent."""
    from core.models import Subscription

    subscription, _created = Subscription.objects.get_or_create(
        user=user,
        defaults={"plan": PLAN_FREE, "started_at": timezone.now()},
    )
    return subscription


def get_plan_info(user: "User") -> dict:
    """Return a JSON-friendly dict describing the user's plan + limits."""
    sub = get_subscription(user)
    limits = PLAN_LIMITS.get(sub.plan, PLAN_LIMITS[PLAN_FREE])
    return {
        "plan": sub.plan,
        "is_plus": sub.plan == PLAN_PLUS,
        "max_children": limits["max_children"],
        "visibility_days": limits["visibility_days"],
        "personalized_suggestions": limits["personalized_suggestions"],
        "printable_reports": limits["printable_reports"],
        "long_term_trends": limits["long_term_trends"],
        "started_at": sub.started_at.isoformat() if sub.started_at else None,
        "ends_at": sub.ends_at.isoformat() if sub.ends_at else None,
        "upgrade_url": "/pricing",
    }


def get_visibility_start(user: "User") -> date | None:
    """Return the earliest date the user is allowed to *see* data for.

    - Plus → ``None`` (no restriction, all-time).
    - Free → ``today - visibility_days``.
    """
    sub = get_subscription(user)
    limits = PLAN_LIMITS.get(sub.plan, PLAN_LIMITS[PLAN_FREE])
    vis_days = limits["visibility_days"]
    if vis_days is None:
        return None  # unlimited
    return date.today() - timedelta(days=vis_days)


def can_add_child(user: "User") -> bool:
    """Check whether the user is allowed to create another child profile."""
    from core.models import Child

    sub = get_subscription(user)
    limits = PLAN_LIMITS.get(sub.plan, PLAN_LIMITS[PLAN_FREE])
    current_count = Child.objects.filter(user=user).count()
    return current_count < limits["max_children"]


def set_user_plan(user: "User", plan: str) -> "Subscription":
    """Upgrade or downgrade a user's plan (admin / stub usage)."""
    if plan not in (PLAN_FREE, PLAN_PLUS):
        raise ValueError(f"Invalid plan: {plan}")
    sub = get_subscription(user)
    sub.plan = plan
    sub.started_at = timezone.now()
    sub.ends_at = None
    sub.canceled_at = None
    sub.save()
    return sub
