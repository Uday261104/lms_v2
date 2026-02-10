import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CourseCard from "../components/CourseCard"
import { courseService } from "../services/courseService"
import { Course } from "../types/course"
const banners = [
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Share the gift of learning",
    subtitle:
      "Save 20% on a year of unlimited access to 26K+ top courses.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    title: "Upskill Faster",
    subtitle: "Learn from industry experts worldwide.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    title: "Career-Ready Skills",
    subtitle: "AI, Web, Cloud & Data paths.",
  },
]

const Home: React.FC = () => {
  
  const [current, setCurrent] = useState(0)

  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses()
        console.log("Courses:", data)
        setCourses(data) // ✅ array
      } catch (error) {
        console.error("Failed to load courses", error)
      }
    }

    fetchCourses()
  }, [])


  /* ================= BANNER AUTO SLIDE ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= WELCOME ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, Learner 👋
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Continue learning and build real-world skills
        </p>
      </section>

      {/* ================= BANNER ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={banners[current].image}
                className="h-full w-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 to-purple-500/70" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 h-full flex items-center px-6 sm:px-12">
            <div className="max-w-md text-white">
              <h2 className="text-xl sm:text-2xl font-bold">
                {banners[current].title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/90">
                {banners[current].subtitle}
              </p>

              <button className="mt-4 bg-white text-purple-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
                Explore courses
              </button>
            </div>
          </div>
        </div>
      </section>

            {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              title: "Expert Instructors",
              desc: "Learn from industry professionals with real-world experience.",
              icon: "🎓",
            },
            {
              title: "Hands-On Projects",
              desc: "Build real projects that strengthen your portfolio.",
              icon: "🛠️",
            },
            {
              title: "Flexible Learning",
              desc: "Learn anytime, anywhere at your own pace.",
              icon: "⏱️",
            },
            {
              title: "Career Growth",
              desc: "Upskill for better roles and higher pay.",
              icon: "📈",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8"
        >
          Popular Categories
        </motion.h2>

        <motion.div
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {[
            "Web Development",
            "Data Science",
            "Cloud Computing",
            "DevOps",
            "Mobile Apps",
            "Databases",
            "AI & ML",
            "Cyber Security",
          ].map((cat) => (
            <motion.div
              key={cat}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white px-5 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
            >
              {cat}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= TOP COURSES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Top Courses</h2>
          <p className="text-gray-600 mt-2">
            Learn from our most popular courses
          </p>
        </div>

        <motion.div
          
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-white py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center px-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Start Learning Today
          </h2>
          <p className="text-gray-600 mt-3">
            Join thousands of learners building real-world skills.
          </p>
          <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition">
            Create Free Account
          </button>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <div className="font-semibold text-white mb-1">NextGen LMS</div>
        <p>Learn. Build. Grow.</p>
        <p className="mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Home
