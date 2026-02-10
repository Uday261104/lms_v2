import React, { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import type { Enrollment } from "../services/courseService";
import { Link } from "react-router-dom";

const MyEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const data = await courseService.getMyEnrollments();
      setEnrollments(data);
    } catch {
      setError("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-4xl font-extrabold text-gray-900">My Learning</h1>
          <p className="mt-2 text-base text-gray-600">Continue where you left off</p>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-gray-500">Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-xl border-2 border-red-200 bg-red-50 px-6 py-4 text-center">
            <div className="mb-2 text-2xl">⚠️</div>
            <p className="font-semibold text-red-700">{error}</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <div className="mb-4 text-6xl">📚</div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              No courses yet
            </h2>
            <p className="mb-8 text-base text-gray-600">
              Enroll in a course to start your learning journey
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
            >
              Browse Courses
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {enrollments.length}{" "}
                {enrollments.length === 1 ? "Course" : "Courses"}
              </h2>
              <p className="mt-2 text-base text-gray-600">Keep learning and growing</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/course/${enrollment.id}/content`}
                  className="group block rounded-2xl border border-blue-100 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300"
                >
                  <div className="relative h-52 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
                    {enrollment.thumbnail ? (
                      <img
                        src={enrollment.thumbnail}
                        alt={enrollment.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600">
                        <span className="text-6xl font-bold text-white drop-shadow-lg">
                          {enrollment.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Enrolled
                    </div>

                    {enrollment.total_hours > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-lg">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-900">{enrollment.total_hours.toFixed(1)}h</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {enrollment.title}
                    </h3>

                    <div className="flex items-center justify-between border-t border-blue-50 pt-4">
                      <span className="text-sm font-medium text-gray-600">
                        Enrolled {new Date(enrollment.enrolled_on).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2 font-bold text-blue-600 transition-all group-hover:gap-3">
                        Continue
                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default MyEnrollments;
