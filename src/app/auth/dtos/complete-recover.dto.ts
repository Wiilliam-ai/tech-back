export class CompleteRecoverDto {
  constructor(
    public readonly password: string,
    public readonly tokenVerif: string,
  ) {}

  static check(
    obj: any,
  ): [error?: string, completeRecoverDto?: CompleteRecoverDto] {
    const { password, tokenVerif } = obj

    const errors: string[] = []
    if (!tokenVerif) errors.push('tokenVerif is required')
    if (!password) errors.push('password is required')
    if (errors.length) return [errors.join(', ')]
    return [undefined, new CompleteRecoverDto(password, tokenVerif)]
  }
}
