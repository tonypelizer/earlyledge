from django.contrib import admin

from core.models import Activity, ActivitySkill, Child, SkillCategory, Suggestion, User

admin.site.register(User)
admin.site.register(Child)
admin.site.register(Activity)
admin.site.register(ActivitySkill)
admin.site.register(SkillCategory)
admin.site.register(Suggestion)
