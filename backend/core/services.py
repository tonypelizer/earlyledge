from collections.abc import Iterable

from core.models import SkillCategory

KEYWORD_RULES: dict[str, tuple[str, ...]] = {
    "Literacy": ("read", "book", "story", "letter", "phonics", "write", "writing", "alphabet", "spell", "word", "rhyme"),
    "Numeracy": ("count", "math", "numbers", "add", "subtract", "measure", "number", "shape", "pattern", "size", "sort", "compare"),
    "Creativity": ("draw", "paint", "lego", "craft", "music", "build", "art", "sing", "color", "create", "design", "make", "imagine"),
    "Physical": ("run", "bike", "park", "jump", "soccer", "dance", "walk", "climb", "swing", "play", "ball", "throw", "catch", "skip", "hop", "exercise", "sport"),
    "Social/Emotional": ("share", "friend", "feelings", "kind", "cooperate", "help", "play with", "together", "hug", "talk", "listen", "turn"),
    "Practical Life": ("cook", "clean", "fold", "garden", "laundry", "table", "dish", "water", "set", "pour", "wash", "dress", "organize"),
    "Critical Thinking": ("puzzle", "solve", "experiment", "plan", "strategy", "why", "problem", "think", "figure", "question", "explore", "discover"),
}


def auto_map_skills(text: str) -> Iterable[SkillCategory]:
    lowered = text.lower()
    mapped: list[SkillCategory] = []
    for skill_name, keywords in KEYWORD_RULES.items():
        if any(keyword in lowered for keyword in keywords):
            skill = SkillCategory.objects.filter(name=skill_name).first()
            if skill:
                mapped.append(skill)

    if not mapped:
        fallback = SkillCategory.objects.filter(name="Critical Thinking").first()
        if fallback:
            mapped.append(fallback)

    return mapped
