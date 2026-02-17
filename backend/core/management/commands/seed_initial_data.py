from django.core.management.base import BaseCommand

from core.models import SkillCategory, Suggestion


SKILLS = [
    "Literacy",
    "Numeracy",
    "Creativity",
    "Physical",
    "Social/Emotional",
    "Practical Life",
    "Critical Thinking",
]

SUGGESTIONS = [
    ("Literacy", "Read Frog and Toad together", "Take turns reading one page each and point to new words.", 4, 8),
    ("Literacy", "Make a family word wall", "Write favorite words on sticky notes and place them on a wall.", 4, 8),
    ("Literacy", "Story retell at dinner", "Ask your child to retell a story in three parts: beginning, middle, end.", 5, 8),
    ("Literacy", "Letter hunt walk", "Find letters on signs while walking in your neighborhood.", 4, 6),
    ("Literacy", "Draw and label", "Draw a favorite animal and label 3 parts together.", 5, 8),
    ("Numeracy", "Count spoons while setting the table", "Ask your child to count and sort utensils before dinner.", 4, 8),
    ("Numeracy", "Sock pair math", "Match socks and count pairs from the laundry basket.", 4, 7),
    ("Numeracy", "Snack pattern game", "Create simple fruit patterns like apple-banana-apple.", 4, 6),
    ("Numeracy", "Block tower compare", "Build two towers and compare which is taller or shorter.", 4, 8),
    ("Numeracy", "Kitchen measuring helper", "Let your child measure one cup and half cup while cooking.", 6, 8),
    ("Creativity", "Nature collage", "Collect leaves and make a collage with glue and paper.", 4, 8),
    ("Creativity", "Paint to music", "Play a calm song and paint colors that match the mood.", 4, 8),
    ("Creativity", "Lego challenge", "Build a bridge that can hold a small toy.", 5, 8),
    ("Creativity", "Story dice", "Roll homemade picture dice and invent a short story.", 5, 8),
    ("Creativity", "Cardboard invention", "Use a box to create a pretend machine or animal.", 4, 8),
    ("Physical", "Park obstacle loop", "Create a simple run-jump-balance loop at the park.", 4, 8),
    ("Physical", "Animal walks", "Try bear walk, crab walk, and frog jumps across the room.", 4, 7),
    ("Physical", "Bike balance practice", "Practice starts and stops on a bike or scooter.", 5, 8),
    ("Physical", "Ball toss count", "Toss and catch a ball while counting successful catches.", 4, 8),
    ("Physical", "Dance freeze", "Dance together and freeze when the music pauses.", 4, 8),
    ("Social/Emotional", "Feelings check-in", "Name one feeling from today and what caused it.", 4, 8),
    ("Social/Emotional", "Kindness note", "Write or draw a kind message for someone at home.", 5, 8),
    ("Social/Emotional", "Turn-taking board game", "Play a short game and practice waiting turns.", 4, 8),
    ("Social/Emotional", "Role-play conflicts", "Use toys to practice solving a small disagreement.", 5, 8),
    ("Social/Emotional", "Compliment circle", "Each family member gives one compliment at dinner.", 4, 8),
    ("Practical Life", "Set the table helper", "Let your child place plates, cups, and napkins.", 4, 8),
    ("Practical Life", "Plant watering routine", "Assign one plant and track watering days.", 4, 8),
    ("Practical Life", "Laundry sorter", "Sort clothes by color and type before washing.", 4, 8),
    ("Practical Life", "Simple snack prep", "Prepare a snack plate with safe tools.", 5, 8),
    ("Practical Life", "Toy shelf reset", "Practice putting toys back in labeled bins.", 4, 7),
    ("Critical Thinking", "Puzzle race", "Complete a puzzle and discuss which pieces were hardest.", 4, 8),
    ("Critical Thinking", "What would happen if...", "Ask playful prediction questions and test one.", 5, 8),
    ("Critical Thinking", "Mystery bag clues", "Guess an item by touch and clues only.", 4, 8),
    ("Critical Thinking", "Build-test-improve", "Build a paper airplane and tweak it for longer flight.", 6, 8),
    ("Critical Thinking", "Treasure map plan", "Draw a map to hide and find a small object.", 5, 8),
]


class Command(BaseCommand):
    help = "Seed default skill categories and suggestions"

    def handle(self, *args, **options):
        for skill_name in SKILLS:
            SkillCategory.objects.get_or_create(name=skill_name)

        for skill_name, title, description, min_age, max_age in SUGGESTIONS:
            skill = SkillCategory.objects.get(name=skill_name)
            Suggestion.objects.get_or_create(
                skill=skill,
                title=title,
                defaults={
                    "description": description,
                    "min_age": min_age,
                    "max_age": max_age,
                },
            )

        self.stdout.write(self.style.SUCCESS("Seeded skill categories and suggestions."))
