from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Count
from rest_framework import serializers

from core.models import Activity, Child, SkillCategory, Suggestion
from core.services import auto_map_skills

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "password", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ["id", "name"]


class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ["id", "name", "age", "created_at"]
        read_only_fields = ["id", "created_at"]


class ActivitySerializer(serializers.ModelSerializer):
    skill_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, allow_empty=True
    )
    skills = SkillCategorySerializer(read_only=True, many=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "child",
            "title",
            "notes",
            "duration_minutes",
            "activity_date",
            "created_at",
            "skills",
            "skill_ids",
        ]
        read_only_fields = ["id", "created_at", "skills"]

    def validate_child(self, value: Child) -> Child:
        request = self.context["request"]
        if value.user_id != request.user.id:
            raise serializers.ValidationError("You can only add activities for your own children.")
        return value

    def create(self, validated_data):
        explicit_skill_ids = validated_data.pop("skill_ids", None)
        activity = Activity.objects.create(**validated_data)

        if explicit_skill_ids is not None and len(explicit_skill_ids) > 0:
            skills = SkillCategory.objects.filter(id__in=explicit_skill_ids)
            activity.skills.set(skills)
        else:
            source_text = f"{activity.title} {activity.notes}"
            mapped = auto_map_skills(source_text)
            activity.skills.set(mapped)

        return activity


class SuggestionSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source="skill.name", read_only=True)

    class Meta:
        model = Suggestion
        fields = ["id", "skill", "skill_name", "title", "description", "min_age", "max_age"]


class WeeklyDashboardSerializer(serializers.Serializer):
    activity_count = serializers.IntegerField()
    skill_counts = serializers.ListField(child=serializers.DictField())
    missing_skills = serializers.ListField(child=serializers.CharField())
    recent_activities = serializers.ListField(child=serializers.DictField())


def build_skill_counts_for_child(child: Child, date_from, date_to):
    all_skills = SkillCategory.objects.all()
    counts = (
        child.activities.filter(activity_date__range=[date_from, date_to])
        .values("skills__id", "skills__name")
        .annotate(count=Count("id"))
    )
    count_map = {row["skills__name"]: row["count"] for row in counts if row["skills__name"]}

    return [
        {
            "skill_id": skill.id,
            "skill": skill.name,
            "count": count_map.get(skill.name, 0),
        }
        for skill in all_skills
    ]
