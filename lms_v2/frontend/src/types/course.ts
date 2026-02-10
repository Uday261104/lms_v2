export interface Course {
  id: number
  creator: string
  title: string
  description: string
  thumbnail: string | null
  requirements: string
  total_hours: number
  created_at: string
}

export interface Chapter {
  id: number
  title: string
  video_url: string
  video_duration: number
  order: number
}

export interface Section {
  id: number
  title: string
  order: number
  chapters: Chapter[]
}

export interface CourseDetail extends Course {
  sections: Section[]
}

export interface Enrollment {
  id: number
  title: string
  thumbnail: string | null
  total_hours: number
  status: string
  enrolled_on: string
}
