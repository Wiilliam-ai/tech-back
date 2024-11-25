export class VerifyUserDto {
  constructor(public id: string) {}

  static check(obj: any): [error?: string, verifyUser?: VerifyUserDto] {
    const { payload } = obj
    const { id } = payload

    const errors: string[] = []
    if (!id) errors.push('id is required')
    if (errors.length) return [errors.join(', ')]

    return [undefined, new VerifyUserDto(id)]
  }
}
