import api from "./api"
import {
  Course,
  CourseDetail,
  Enrollment,
} from "../types/course"

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const res = await api.get<Course[]>("/courses/")
    return res.data
  },

  async getCourseDetail(courseId: number): Promise<CourseDetail> {
    const res = await api.get<CourseDetail>(`/courses/${courseId}/`)
    return res.data
  },

  async enrollCourse(courseId: number): Promise<void> {
    await api.post("/courses/enroll/", { course: courseId })
  },

  async getMyEnrollments(): Promise<Enrollment[]> {
    const res = await api.get<Enrollment[]>("/courses/my-enrollments/")
    return res.data
  },

  async getMyCourses(): Promise<Course[]> {
    const res = await api.get<Course[]>("/courses/my-courses/")
    return res.data
  },
}
