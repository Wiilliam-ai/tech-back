export class LoginUserDto {
  constructor(
    public email: string,
    public password: string
  ) {}

  static check(obj: any): [error?: string, login?: LoginUserDto] {
    const { email, password } = obj

    const errors: string[] = []
    if (!email) errors.push('email is required')
    if (!password) errors.push('password is required')
    if (errors.length) return [errors.join(', ')]
    return [undefined, new LoginUserDto(email, password)]
  }
}
