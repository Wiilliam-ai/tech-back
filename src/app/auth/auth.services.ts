import { PrismaClient } from '@prisma/client'
import { LoginUserDto } from './dtos/login-user.dto'
import { VerifyUserDto } from './dtos/verifyUser.dto'
import { CustomError } from '../../helpers/errors/custom-error'
import { Bcrypt } from '../../config/bcrypt'
import { AuthDataSource } from './auth.datasource'
import { AuthEntity } from './auth.entity'
import { RecoverUserDto } from './dtos/recover-user.dto'
import { Generator } from '../../utils/generator'
import { UserEntity } from '../user/user.entity'
import { CompleteRecoverDto } from './dtos/complete-recover.dto'

export class AuthServices implements AuthDataSource {
  private pristma: PrismaClient

  constructor(pristma: PrismaClient) {
    this.pristma = pristma
  }
  async completeRecover(completeRecoverDto: CompleteRecoverDto): Promise<void> {
    const { password, tokenVerif } = completeRecoverDto
    const user = await this.pristma.user.findFirst({
      where: {
        tokenVerif,
      },
    })

    if (!user) throw CustomError.badRequest('Token not valid')
    if (user && !user.isVerified)
      throw CustomError.badRequest('User not verified')
    if (user && !user.tokenVerif)
      throw CustomError.badRequest('Token not valid')
    const passwordHash = Bcrypt.hash(password)
    const userUpdated = await this.pristma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
        tokenVerif: '',
      },
    })

    if (!userUpdated) throw CustomError.badRequest('Error updating user')
  }

  async recoverUser(
    recoverUserDto: RecoverUserDto,
  ): Promise<Omit<UserEntity, 'avatar' | 'role'>> {
    const { email } = recoverUserDto
    const user = await this.findUserByEmail(email)

    const tokenVerif = Generator.randomText()

    const userUpdated = await this.pristma.user.update({
      where: {
        email: user.email,
      },
      data: {
        tokenVerif: tokenVerif,
      },
    })

    if (!userUpdated) throw CustomError.badRequest('Error generating token')

    return {
      id: userUpdated.id,
      email: userUpdated.email,
      firstName: userUpdated.firstName,
      isVerified: userUpdated.isVerified,
      lastName: userUpdated.lastName,
      password: userUpdated.password,
      tokenVerif: userUpdated.tokenVerif || '',
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.pristma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
        role: true,
      },
    })

    if (!user) {
      throw CustomError.badRequest('User not found')
    }

    if (user && !user.isVerified) {
      throw CustomError.badRequest('User not verified')
    }

    return user
  }

  private mappAuthEntity(user: Record<string, any>): AuthEntity {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: {
        id: user.avatar.id,
        url: `/uploads/${user.avatar.url}`,
      },
      role: user.role,
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<AuthEntity> {
    const { email, password } = loginUserDto
    const user = await this.findUserByEmail(email)
    const passwordMatch = Bcrypt.compare(password, user.password)
    if (!passwordMatch) throw CustomError.badRequest('Invalid password')
    const userResult = this.mappAuthEntity(user)
    return userResult
  }

  async verifyUser(verifyUserDto: VerifyUserDto): Promise<AuthEntity> {
    const { id } = verifyUserDto
    const user = await this.pristma.user.findUnique({
      where: {
        id,
      },
      include: {
        avatar: true,
        role: true,
      },
    })

    if (!user) {
      throw CustomError.badRequest('User not found')
    }

    if (user && !user.isVerified) {
      throw CustomError.badRequest('User not verified')
    }

    const userResult = this.mappAuthEntity(user)
    return userResult
  }
}
