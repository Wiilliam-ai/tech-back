export class ForwardEmailDto {
  constructor(public readonly email: string) {}

  static check(obj: any): [error?: string, forwardUserDto?: ForwardEmailDto] {
    const { email } = obj

    const errors: string[] = []

    if (!email) errors.push('email is required')
    if (email && typeof email !== 'string')
      errors.push('email must be a string')

    if (errors.length) return [errors.join(', ')]
    return [undefined, new ForwardEmailDto(email)]
  }
}
