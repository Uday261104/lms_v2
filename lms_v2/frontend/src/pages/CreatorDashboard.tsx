import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../services/courseService";
import type { Course } from "../services/courseService";

const CreatorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCreatorCourses();
  }, []);

  const fetchCreatorCourses = async () => {
    try {
      const data = await courseService.getMyCourses();
      setCourses(data);
    } catch {
      setError("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Creator Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Manage your courses and content
            </p>
          </div>

          <Link
            to="/creator/create-course"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
          >
            + New Course
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {courses.length}
            </p>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No courses yet
            </h3>
            <p className="mb-6 text-gray-600">
              Create your first course to get started
            </p>
            <Link
              to="/creator/create-course"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
            >
              Create Course
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 rounded-lg border bg-white p-4"
              >
                {/* Thumbnail */}
                <div className="h-20 w-28 flex shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white">
                      {course.title.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                    {course.description}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                    {course.total_hours > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.total_hours.toFixed(1)}h
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/course/${course.id}`}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    View
                  </Link>
                  <Link
                    to={`/creator/edit-course/${course.id}`}
                    className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                  <button className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200">
                    Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreatorDashboard;
