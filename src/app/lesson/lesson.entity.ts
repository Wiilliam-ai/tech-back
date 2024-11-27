export interface LessonEntity {
  id: number
  title: string
  description: string
  content: string
  courseId: number
  videoUrl: string
}

export interface LessonsData extends LessonEntity {
  docs: {
    id: number
    title: string
    fileUrl: string
  }
}
