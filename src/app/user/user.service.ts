import { PrismaClient } from '@prisma/client'
import { RegisterUserDto } from './dtos/register-user.dto'
import { UserDatasource } from './user.datasource'
import { UserEntity } from './user.entity'
import { URL_IMAGE_DEFAULT } from '../../helpers/global/url-global'
import { Generator } from '../../utils/generator'
import { CompleteUserDto } from './dtos/complete-user.dto'
import { CustomError } from '../../helpers/errors/custom-error'
import { Bcrypt } from '../../config/bcrypt'

export class UserService implements UserDatasource {
  private pristma: PrismaClient

  constructor(pristma: PrismaClient) {
    this.pristma = pristma
  }
  async completRegisterUser(completeUserDto: CompleteUserDto): Promise<void> {
    const { firstName, lastName, password, tokenVerif } = completeUserDto

    const user = await this.pristma.user.findFirst({
      where: {
        tokenVerif,
      },
    })

    if (!user)
      throw CustomError.badRequest('Token of verification does not exist')
    if (user.isVerified && !user.tokenVerif)
      throw CustomError.badRequest('User already verified')

    const passwordHash = Bcrypt.hash(password)

    const updateUser = await this.pristma.user.update({
      where: {
        id: user.id,
        tokenVerif: tokenVerif,
      },
      data: {
        firstName,
        lastName,
        password: passwordHash,
        isVerified: true,
        tokenVerif: null,
      },
    })

    if (!updateUser) throw new Error('Error updating account')
  }

  private existUserByEmail(email: string) {
    return this.pristma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { email, role } = registerUserDto
    const existUser = await this.existUserByEmail(email)
    if (existUser) {
      throw new Error('User already exists')
    }

    const newRole = await this.pristma.role.create({
      data: {
        ...role,
      },
    })

    if (!newRole) throw new Error('Error creating role')

    const newAvatar = await this.pristma.avatar.create({
      data: {
        url: URL_IMAGE_DEFAULT,
      },
    })

    if (!newAvatar) throw new Error('Error creating avatar')

    const tokenVerif = Generator.randomText()

    const newUser = await this.pristma.user.create({
      data: {
        email,
        firstName: '',
        lastName: '',
        password: '',
        isVerified: false,
        tokenVerif: tokenVerif,
        avatarId: newAvatar.id,
        roleId: newRole.id,
      },
    })

    if (!newUser) throw new Error('Error creating user')

    return {
      id: newUser.id,
      firsName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
      email: newUser.email,
      isVerified: newUser.isVerified,
      tokenVerif: newUser.tokenVerif || '',
      avatar: {
        id: newAvatar.id,
        url: newAvatar.url,
      },
      role: {
        doAdmin: newRole.doAdmin,
        doInst: newRole.doInst,
        doProf: newRole.doProf,
        id: newRole.id,
      },
    }
  }
}
