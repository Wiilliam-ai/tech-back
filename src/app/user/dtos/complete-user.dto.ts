export class CompleteUserDto {
  constructor(
    public readonly tokenVerif: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password: string,
  ) {}

  static check(obj: any): [error?: string, completeUserDto?: CompleteUserDto] {
    const { tokenVerif, firstName, lastName, password } = obj

    const errors: string[] = []

    if (!tokenVerif) errors.push('tokenVerif is required')
    if (!firstName) errors.push('firstName is required')
    if (!lastName) errors.push('lastName is required')
    if (!password) errors.push('password is required')

    if (errors.length) return [errors.join(', ')]

    return [
      undefined,
      new CompleteUserDto(tokenVerif, firstName, lastName, password),
    ]
  }
}
