import { type CompleteUserDto } from './dtos/complete-user.dto'
import { type RegisterUserDto } from './dtos/register-user.dto'
import { type UserEntity } from './user.entity'

export abstract class UserDatasource {
  abstract registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity>
  abstract completRegisterUser(completeUserDto: CompleteUserDto): Promise<void>
}
