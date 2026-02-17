from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
	username = None
	email = models.EmailField(unique=True)
	created_at = models.DateTimeField(auto_now_add=True)

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = []

	def __str__(self) -> str:
		return self.email


class Child(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="children")
	name = models.CharField(max_length=120)
	date_of_birth = models.DateField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["name"]

	@property
	def age(self) -> int | None:
		if not self.date_of_birth:
			return None

		today = timezone.localdate()
		years = today.year - self.date_of_birth.year
		if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
			years -= 1
		return years

	def __str__(self) -> str:
		return f"{self.name} ({self.age if self.age is not None else 'Unknown age'})"


class SkillCategory(models.Model):
	name = models.CharField(max_length=80, unique=True)

	class Meta:
		verbose_name_plural = "Skill categories"
		ordering = ["name"]

	def __str__(self) -> str:
		return self.name


class Activity(models.Model):
	child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="activities")
	title = models.CharField(max_length=255)
	notes = models.TextField(blank=True)
	duration_minutes = models.PositiveIntegerField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	activity_date = models.DateField()
	skills = models.ManyToManyField(SkillCategory, through="ActivitySkill", related_name="activities")

	class Meta:
		ordering = ["-activity_date", "-created_at"]

	def __str__(self) -> str:
		return f"{self.title} - {self.child.name}"


class ActivitySkill(models.Model):
	activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
	skill = models.ForeignKey(SkillCategory, on_delete=models.CASCADE)

	class Meta:
		unique_together = ("activity", "skill")


class Suggestion(models.Model):
	skill = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name="suggestions")
	title = models.CharField(max_length=255)
	description = models.TextField()
	min_age = models.PositiveIntegerField()
	max_age = models.PositiveIntegerField()

	class Meta:
		ordering = ["skill__name", "title"]

	def __str__(self) -> str:
		return self.title
