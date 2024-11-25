export class RegisterLessonDto {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly courseId: number,
    public readonly videoUrl: string,
  ) {}

  static check(
    obj: any,
  ): [error?: string, registerLessonDto?: RegisterLessonDto] {
    const { title, description, content, courseId, videoUrl } = obj

    const errors: string[] = []
    if (!title) errors.push('title is required')
    if (!description) errors.push('description is required')
    if (!content) errors.push('content is required')
    if (!courseId) errors.push('courseId is required')
    if (!videoUrl) errors.push('videoUrl is required')
    if (errors.length) return [errors.join(', ')]
    return [
      undefined,
      new RegisterLessonDto(
        title,
        description,
        content,
        Number(courseId),
        videoUrl,
      ),
    ]
  }
}
