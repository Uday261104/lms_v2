import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Course } from "../services/courseService"

interface CourseDetailsProps {
  course: Course
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group"
    >
      <Link
        to={`/course/${course.id}`}
        className="block h-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg hover:shadow-2xl transition-all"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-blue-100">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600 text-6xl font-extrabold text-white">
              {course.title.charAt(0)}
            </div>
          )}

          {/* FREE badge */}
          <span className="absolute top-3 left-3 rounded-full bg-green-500 px-4 py-1 text-xs font-bold text-white shadow">
            FREE
          </span>

          {/* Duration */}
          <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow">
            {course.total_hours.toFixed(1)}h
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-[220px]">
          <h3 className="mb-2 line-clamp-2 text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {course.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600">
              By {course.creator}
            </span>

            <span className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow hover:from-blue-700 hover:to-blue-800">
              View Course
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseDetails
