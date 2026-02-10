from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Course, Enrollment, Section, Chapter
from .serializers import CourseSerializer, EnrollmentSerializer, SectionSerializer, ChapterSerializer, MyEnrollmentSerializer
from .permissions import IsCreator, IsCourseCreator, CanViewCourseContent, CanEnroll
from rest_framework.exceptions import PermissionDenied
# Create your views here.
from rest_framework.viewsets import ReadOnlyModelViewSet

class CourseViewSet(ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
# List all courses
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


# Course detail (Udemy-style structure)
class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


# Create course (CREATOR only)
class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


# Update course (only creator)
class CourseUpdateView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseCreator]


# Enroll in course (STUDENT or CREATOR)
class EnrollView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, CanEnroll]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SectionCreateView(generics.CreateAPIView):
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if course.creator != self.request.user:
            raise permissions.PermissionDenied("Not your course")
        serializer.save()

class SectionUpdateView(generics.UpdateAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        section = self.get_object()
        if section.course.creator != self.request.user:
            raise permissions.PermissionDenied("Not your course")
        serializer.save()

class ChapterCreateView(generics.CreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        section = serializer.validated_data["section"]
        if section.course.creator != self.request.user:
            raise permissions.PermissionDenied("Not your course")
        serializer.save()

class ChapterUpdateView(generics.UpdateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        chapter = self.get_object()
        if chapter.section.course.creator != self.request.user:
            raise permissions.PermissionDenied("Not your course")
        serializer.save()

class CoursePlayerView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, CanViewCourseContent]

    def get_object(self):
        course = super().get_object()
        user = self.request.user

        if course.creator == user or user.is_superuser:
            return course
        
        enrolled = Enrollment.objects.filter(
            user=user,
            course = course
        ).exists()

        if not enrolled:
            raise PermissionDenied("You are not enrolled in course")
        
        return course
    
class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = MyEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

# Get creator's own courses
class MyCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCreator]

    def get_queryset(self):
        return Course.objects.filter(creator=self.request.user)
