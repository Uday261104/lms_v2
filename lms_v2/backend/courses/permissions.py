from rest_framework.permissions import BasePermission, IsAuthenticated
from .models import Enrollment

class IsCreator(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="CREATOR").exists()


class IsCourseCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.creator == request.user

from .models import Course, Section


class IsSectionCourseCreator(BasePermission):
    def has_permission(self, request, view):
        section_id = request.data.get("section")
        if not section_id:
            return False
        try:
            section = Section.objects.get(id=section_id)
        except Section.DoesNotExist:
            return False
        return section.course.creator == request.user


class CanEnroll(BasePermission):
     
    def has_permission(self, request, view):
        course_id = request.data.get('course')
        if not course_id:
            return False
        user = request.user
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return False
        
        # Don't allow creator to enroll in their own course
        if course.creator == user:
            return False
        # Don't allow double enrollment
        if Enrollment.objects.filter(user=user, course=course).exists():
            return False
        return True
    

class CanViewCourseContent(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False
        if obj.creator == user or user.is_superuser:
            return True
        return Enrollment.objects.filter(user=user, Course=obj).exists()