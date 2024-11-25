import { type UserEntity } from '../user/user.entity'
import { type AuthEntity } from './auth.entity'
import { type CompleteRecoverDto } from './dtos/complete-recover.dto'
import { type LoginUserDto } from './dtos/login-user.dto'
import { type RecoverUserDto } from './dtos/recover-user.dto'
import { type VerifyUserDto } from './dtos/verifyUser.dto'

export abstract class AuthDataSource {
  abstract loginUser(loginUserDto: LoginUserDto): Promise<AuthEntity>
  abstract verifyUser(verifyUserDto: VerifyUserDto): Promise<AuthEntity>
  abstract recoverUser(
    recoverUserDto: RecoverUserDto,
  ): Promise<Omit<UserEntity, 'avatar' | 'role'>>
  abstract completeRecover(
    completeRecoverDto: CompleteRecoverDto,
  ): Promise<void>
}
