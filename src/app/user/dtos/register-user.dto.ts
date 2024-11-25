import { verifyEmail } from '../../../utils/verifyEmail'

type RoleUser = {
  doProf: boolean
  doInst: boolean
  doAdmin: boolean
}

export class RegisterUserDto {
  constructor(
    public email: string,
    public role: RoleUser,
  ) {}

  static check(obj: any): [error?: string, registerUserDto?: RegisterUserDto] {
    const { email, role } = obj

    const errors: string[] = []

    if (!email) errors.push('email is required')
    if (email && typeof email !== 'string')
      errors.push('email must be a string')
    if (email && !verifyEmail(email)) errors.push('email is invalid')

    if (!role) errors.push('role is required')
    // only one role can be true
    const roles = role ? Object.values(role) : []
    const trueRoles = roles.filter((role) => role === true)
    if (role && trueRoles.length !== 1) errors.push('only one role can be true')

    if (errors.length) return [errors.join(', ')]
    return [undefined, new RegisterUserDto(email, role)]
  }
}
