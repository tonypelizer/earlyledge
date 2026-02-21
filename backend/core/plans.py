"""
Plan definitions and limits for EarlyLedge subscription tiers.

Keep all plan-related constants here so they are easy to find
and straightforward to update when adding new tiers or adjusting limits.
"""

PLAN_FREE = "free"
PLAN_PLUS = "plus"

PLAN_CHOICES = [
    (PLAN_FREE, "Free"),
    (PLAN_PLUS, "Plus"),
]

# ------------------------------------------------------------------
# Limits per plan
# ------------------------------------------------------------------
PLAN_LIMITS: dict[str, dict] = {
    PLAN_FREE: {
        "max_children": 1,
        "visibility_days": 90,  # charts / insights / reports window
        "personalized_suggestions": False,
        "printable_reports": False,
        "long_term_trends": False,
    },
    PLAN_PLUS: {
        "max_children": 5,
        "visibility_days": None,  # unlimited (all-time)
        "personalized_suggestions": True,
        "printable_reports": True,
        "long_term_trends": True,
    },
}
