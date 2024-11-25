export class RegisterCourseDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly skills: string[],
    public readonly img: string,
  ) {}

  static check(
    obj: any,
  ): [error?: string, registerCourseDto?: RegisterCourseDto] {
    const { name, description, skills, img } = obj

    const errors: string[] = []
    if (!name) errors.push('name is required')
    if (!description) errors.push('description is required')
    if (!skills) errors.push('skills is required')
    if (!img) errors.push('img is required')
    if (errors.length) return [errors.join(', ')]

    const arraySkills = skills.split(',')

    return [
      undefined,
      new RegisterCourseDto(name, description, arraySkills, img),
    ]
  }
}
