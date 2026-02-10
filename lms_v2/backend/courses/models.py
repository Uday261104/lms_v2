from django.db import models
from django.conf import settings
from django.db.models import F, Max
# Create your models here.

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_courses"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to="course_thumbnails/", blank=True, null=True)
    requirements = models.TextField(blank=True)
    total_hours = models.FloatField(default=0.0)
    is_published = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("create_course", "Can create course"),
            ("edit_own_course", "Can edit own course"),
        ]

    def __str__(self):
        return str(self.title)



class Section(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="sections")
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "order")

    def save(self, *args, **kwargs):
        if not self.pk:
            Section.objects.filter(
                course = self.course,
                order__gte = self.order
            ).update(order = F('order') + 1)
        super().save(*args, **kwargs)


class Chapter(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    video_duration = models.FloatField()  
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = ("section", "order")

    def save(self, *args, **kwargs):
        # Only auto-set order if not provided
        if not self.pk and not self.order:
            max_order = Chapter.objects.filter(section=self.section).aggregate(
                Max('order')
            )['order__max']
            self.order = (max_order or 0) + 1

        super().save(*args, **kwargs)

        # Update course total hours
        course = self.section.course
        total = Chapter.objects.filter(
            section__course=course
        ).aggregate(models.Sum("video_duration"))["video_duration__sum"] or 0

        course.total_hours = total
        course.save()

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "course")

    def __str__(self):
        return f"{self.user} → {self.course}"
