export interface LessonEntity {
  id: number
  title: string
  description: string
  content: string
  courseId: number
  videoUrl: string
}

export interface IDocs {
  id: number
  title: string
  typeDoc: string
  document: string
}

export interface LessonsData {
  id: number
  title: string
  description: string
  content: string
  resources: {
    id: string
    url: string
  }
  docs: IDocs[]
}
