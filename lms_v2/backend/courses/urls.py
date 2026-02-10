from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    CourseCreateView,
    CourseUpdateView,
    EnrollView,
    SectionCreateView,
    SectionUpdateView,
    ChapterCreateView,
    ChapterUpdateView,
    CoursePlayerView,
    MyEnrollmentsView,
    MyCoursesView,
    CourseViewSet
)

urlpatterns = [
    path("", CourseListView.as_view()),
    path("my-courses/", MyCoursesView.as_view()),
    path("<int:pk>/", CourseDetailView.as_view()),
    path("create/", CourseCreateView.as_view()),
    path("<int:pk>/edit/", CourseUpdateView.as_view()),

    path("enroll/", EnrollView.as_view()),


    path("sections/create/", SectionCreateView.as_view()),
    path("sections/<int:pk>/edit/", SectionUpdateView.as_view()),


    path("chapters/create/", ChapterCreateView.as_view()),
    path("chapters/<int:pk>/edit/", ChapterUpdateView.as_view()),


    path("<int:pk>/player/", CoursePlayerView.as_view()),
    path("my-enrollments/", MyEnrollmentsView.as_view()),

]
