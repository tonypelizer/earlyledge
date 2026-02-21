from django.contrib import admin

from core.models import Activity, ActivitySkill, Child, SkillCategory, Subscription, Suggestion, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ("email", "is_staff", "created_at")
	search_fields = ("email",)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
	list_display = ("user", "plan", "started_at", "ends_at", "canceled_at")
	list_filter = ("plan",)
	search_fields = ("user__email",)
	list_editable = ("plan",)
	raw_id_fields = ("user",)


admin.site.register(Child)
admin.site.register(Activity)
admin.site.register(ActivitySkill)
admin.site.register(SkillCategory)
admin.site.register(Suggestion)
