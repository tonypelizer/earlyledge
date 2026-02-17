from collections.abc import Iterable

from core.models import SkillCategory

KEYWORD_RULES: dict[str, tuple[str, ...]] = {
    "Literacy": ("read", "book", "story", "letter", "phonics", "write"),
    "Numeracy": ("count", "math", "numbers", "add", "subtract", "measure"),
    "Creativity": ("draw", "paint", "lego", "craft", "music", "build"),
    "Physical": ("run", "bike", "park", "jump", "soccer", "dance"),
    "Social/Emotional": ("share", "friend", "feelings", "kind", "cooperate", "help"),
    "Practical Life": ("cook", "clean", "fold", "garden", "laundry", "table"),
    "Critical Thinking": ("puzzle", "solve", "experiment", "plan", "strategy", "why"),
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
