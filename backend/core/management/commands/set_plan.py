"""
Management command to set a user's subscription plan.

Usage:
    python manage.py set_plan user@example.com plus
    python manage.py set_plan user@example.com free
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from core.plan_service import set_user_plan
from core.plans import PLAN_FREE, PLAN_PLUS

User = get_user_model()


class Command(BaseCommand):
    help = "Set a user's subscription plan (free or plus)"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="User email address")
        parser.add_argument(
            "plan",
            type=str,
            choices=[PLAN_FREE, PLAN_PLUS],
            help="Plan to assign (free or plus)",
        )

    def handle(self, *args, **options):
        email = options["email"]
        plan = options["plan"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise CommandError(f"No user found with email: {email}")

        sub = set_user_plan(user, plan)
        self.stdout.write(
            self.style.SUCCESS(
                f"✅ {user.email} is now on the {sub.get_plan_display()} plan."
            )
        )
