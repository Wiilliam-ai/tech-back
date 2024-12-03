import { type VerifyUserDto } from '../auth/dtos/verifyUser.dto'
import { type CompleteUserDto } from './dtos/complete-user.dto'
import { type ForwardEmailDto } from './dtos/forward-email.dto'
import { type RegisterUserDto } from './dtos/register-user.dto'
import { type UserEntityWeb, type UserEntity } from './user.entity'

export abstract class UserDatasource {
  abstract registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity>
  abstract completRegisterUser(completeUserDto: CompleteUserDto): Promise<void>
  abstract listUsers(): Promise<UserEntityWeb[]>
  abstract forwardEmail(ForwardEmailDto: ForwardEmailDto): Promise<UserEntity>
  abstract uploadAvatar(
    avatar: string,
    verifyUserDto: VerifyUserDto,
  ): Promise<void>
}
