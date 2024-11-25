export class RecoverUserDto {
  constructor(public readonly email: string) {}

  static check(obj: any): [error?: string, recoverUserDto?: RecoverUserDto] {
    const { email } = obj

    const errors: string[] = []
    if (!email) errors.push('email is required')
    if (errors.length) return [errors.join(', ')]
    return [undefined, new RecoverUserDto(email)]
  }
}
