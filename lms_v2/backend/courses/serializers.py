from rest_framework import serializers
from .models import Course, Section, Chapter, Enrollment
from .permissions import CanViewCourseContent


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "section", "title", "video_url", "video_duration", "order"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")

        if request:
            user = request.user
            course = instance.section.course

            if not (
                user.is_authenticated and (
                    course.creator == user or user.is_superuser or Enrollment.objects.filter(user=user, course=course).exists()
                )
            ):
                data.pop("video_url", None)
        return data




class SectionSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ["id", "course", "title", "order", "chapters"]


class CourseSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "thumbnail",
            "requirements",
            "total_hours",
            "sections",
            "created_at",
        ]
        read_only_fields = ["creator", "total_hours", "created_at"]


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ["id", "user", "course", "status", "enrolled_on"]
        read_only_fields = ["user", "status", "enrolled_on"]

class MyEnrollmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="course.id")
    title = serializers.CharField(source="course.title")
    thumbnail = serializers.ImageField(source="course.thumbnail", read_only=True)
    total_hours = serializers.FloatField(source="course.total_hours")

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "title",
            "thumbnail",
            "total_hours",
            "status",
            "enrolled_on",
        ]
