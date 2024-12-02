export class RegisterDocsDto {
  constructor(
    public readonly title: string,
    public readonly urlFile: string,
    public readonly lessonId: number,
  ) {}

  static check(obj: any): [error?: string, registerDocsDto?: RegisterDocsDto] {
    const { title, urlFile, lessonId } = obj

    const errors: string[] = []
    if (!title) errors.push('name is required')
    if (!urlFile) errors.push('urlFile is required')
    if (!lessonId) errors.push('lessonId is required')
    if (errors.length) return [errors.join(', ')]
    return [undefined, new RegisterDocsDto(title, urlFile, Number(lessonId))]
  }
}
