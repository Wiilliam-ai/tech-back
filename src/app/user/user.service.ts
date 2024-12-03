import { PrismaClient } from '@prisma/client'
import { RegisterUserDto } from './dtos/register-user.dto'
import { UserDatasource } from './user.datasource'
import { UserEntity, UserEntityWeb } from './user.entity'
import { URL_IMAGE_DEFAULT } from '../../helpers/global/url-global'
import { Generator } from '../../utils/generator'
import { CompleteUserDto } from './dtos/complete-user.dto'
import { CustomError } from '../../helpers/errors/custom-error'
import { Bcrypt } from '../../config/bcrypt'
import { ForwardEmailDto } from './dtos/forward-email.dto'
import { VerifyUserDto } from '../auth/dtos/verifyUser.dto'
import { UploadFile } from '../../utils/uploadFile'
import { PathGlobal } from '../../helpers/global/path-global'

export class UserService implements UserDatasource {
  private pristma: PrismaClient

  constructor(pristma: PrismaClient) {
    this.pristma = pristma
  }
  async uploadAvatar(
    avatar: string,
    verifyUserDto: VerifyUserDto,
  ): Promise<void> {
    const user = await this.pristma.user.findUnique({
      where: {
        id: verifyUserDto.id,
      },
      include: {
        avatar: true,
      },
    })

    if (!user) throw CustomError.badRequest('User not found')

    const updateAvatarDefault = await this.pristma.avatar.update({
      where: {
        id: user.avatarId,
      },
      data: {
        url: avatar,
      },
    })

    if (!updateAvatarDefault)
      throw CustomError.badRequest('Error updating avatar')

    UploadFile.deleteFile(PathGlobal.AVATARS_PATH + user.avatar.url)
  }

  async forwardEmail(ForwardEmailDto: ForwardEmailDto): Promise<UserEntity> {
    const { email } = ForwardEmailDto
    const user = await this.pristma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
        role: true,
      },
    })

    if (!user) throw CustomError.badRequest('User not found')
    if (user.isVerified) throw CustomError.badRequest('User already verified')

    const tokenVerif = Generator.randomText()

    const userUpdated = await this.pristma.user.update({
      where: {
        email: user.email,
      },
      data: {
        tokenVerif: tokenVerif,
      },
    })

    if (!userUpdated) throw CustomError.badRequest('Error updating user')

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      isVerified: userUpdated.isVerified,
      tokenVerif: userUpdated.tokenVerif || '',
      avatar: {
        id: user.avatar.id,
        url: user.avatar.url,
      },
      role: {
        doAdmin: user.role.doAdmin,
        doInst: user.role.doInst,
        doProf: user.role.doProf,
        id: user.role.id,
      },
    }
  }

  async listUsers(): Promise<UserEntityWeb[]> {
    const users = await this.pristma.user.findMany({
      where: {
        deleted: false,
      },
      include: {
        avatar: true,
        role: true,
      },
    })

    const result = users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        avatar: {
          id: user.avatar.id,
          url: user.avatar.url,
        },
        role: {
          doAdmin: user.role.doAdmin,
          doInst: user.role.doInst,
          doProf: user.role.doProf,
          id: user.role.id,
        },
      }
    })

    return result
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
      firstName: newUser.firstName,
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
