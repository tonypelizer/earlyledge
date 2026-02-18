import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import Activity, Child, SkillCategory, ActivitySkill


ACTIVITY_TITLES = [
    "Read story together",
    "Playing with building blocks",
    "Drawing and coloring",
    "Nature walk in the park", 
    "Cooking simple recipes",
    "Sorting shapes and colors",
    "Dancing to music",
    "Puzzle solving time",
    "Playing with clay",
    "Counting games",
    "Outdoor playground time",
    "Arts and crafts project",
    "Singing nursery rhymes",
    "Playing board games",
    "Water play activities",
    "Building with Legos",
    "Pretend play session",
    "Gardening activities",
    "Simple science experiments",
    "Musical instrument play",
    "Treasure hunt game",
    "Playing dress up",
    "Ball throwing and catching",
    "Learning about animals",
    "Bike riding practice",
    "Painting with brushes",
    "Memory matching games",
    "Playing with toy cars",
    "Learning the alphabet",
    "Yoga and stretching",
    "Tea party pretend play",
    "Building sandcastles",
    "Playing hide and seek",
    "Learning numbers",
    "Swimming activities",
    "Making collages",
    "Playing with dolls",
    "Outdoor scavenger hunt",
    "Learning about weather",
    "Simple math games",
]

ACTIVITY_NOTES = [
    "Child was very engaged and asked lots of questions.",
    "We had so much fun exploring together!",
    "Child showed great creativity and imagination.",
    "This activity helped develop fine motor skills.",
    "Child was excited to try something new.",
    "Great opportunity for learning and bonding.",
    "Child demonstrated improved focus and attention.",
    "We laughed and played together for a long time.",
    "Child showed independence and confidence.",
    "This was a perfect activity for developing skills.",
    "Child enjoyed the hands-on experience.",
    "We practiced patience and taking turns.",
    "Child was proud of their accomplishment.",
    "Great way to spend quality time together.",
    "Child showed curiosity and eagerness to learn.",
    "This activity challenged them in a good way.",
    "Child demonstrated problem-solving skills.",
    "We had a wonderful time exploring outdoors.",
    "Child showed improvement from last time.",
    "Perfect activity for this age and stage.",
]


class Command(BaseCommand):
    help = "Seed random activities for child ID 1 over the last 3 months"

    def add_arguments(self, parser):
        parser.add_argument(
            '--child-id',
            type=int,
            default=1,
            help='Child ID to create activities for (default: 1)'
        )
        parser.add_argument(
            '--count',
            type=int,
            default=50,
            help='Number of activities to create (default: 50)'
        )

    def handle(self, *args, **options):
        child_id = options['child_id']
        activity_count = options['count']

        try:
            child = Child.objects.get(id=child_id)
        except Child.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"Child with ID {child_id} does not exist.")
            )
            return

        # Get all available skills
        skills = list(SkillCategory.objects.all())
        if not skills:
            self.stdout.write(
                self.style.ERROR("No skill categories found. Run 'seed_initial_data' first.")
            )
            return

        # Calculate date range (last 3 months)
        end_date = date.today()
        start_date = end_date - timedelta(days=90)

        created_count = 0

        for _ in range(activity_count):
            # Generate random date within the last 3 months
            random_days = random.randint(0, 90)
            activity_date = end_date - timedelta(days=random_days)

            # Random title and notes
            title = random.choice(ACTIVITY_TITLES)
            notes = random.choice(ACTIVITY_NOTES)
            
            # Random duration between 15 and 120 minutes
            duration = random.randint(15, 120)

            # Create the activity
            activity = Activity.objects.create(
                child=child,
                title=title,
                notes=notes,
                duration_minutes=duration,
                activity_date=activity_date,
            )

            # Assign 1-3 random skills to the activity
            num_skills = random.randint(1, 3)
            selected_skills = random.sample(skills, min(num_skills, len(skills)))
            
            for skill in selected_skills:
                ActivitySkill.objects.create(
                    activity=activity,
                    skill=skill
                )

            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created_count} activities for {child.name} "
                f"between {start_date} and {end_date}."
            )
        )