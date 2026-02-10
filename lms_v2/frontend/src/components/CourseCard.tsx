import React from "react"
import { Link } from "react-router-dom"
import { Course } from "../types/course"

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const imageUrl =
    course.thumbnail && course.thumbnail !== ""
      ? course.thumbnail.replace("localhost", "127.0.0.1")
      : null

  return (
    <div className="h-full rounded-2xl bg-white border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
      {/* ================= IMAGE (FIXED HEIGHT) ================= */}
      <div className="relative h-48 overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
            <span className="text-5xl font-bold text-white">
              {course.title.charAt(0)}
            </span>
          </div>
        )}

        <span className="absolute top-3 left-3 bg-green-500 px-3 py-1 text-xs font-bold text-white rounded-full">
          FREE
        </span>

        <span className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 text-xs font-semibold rounded-full text-gray-800">
          {course.total_hours} hrs
        </span>
      </div>

      {/* ================= CONTENT (FIXED FLOW) ================= */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3rem]">
          {course.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3 min-h-[4.5rem]">
          {course.description}
        </p>

        {/* BUTTON ALWAYS AT BOTTOM */}
        <Link
          to={`/courses/${course.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-2.5 text-sm font-semibold transition"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
