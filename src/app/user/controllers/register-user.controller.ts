import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { RegisterUserDto } from '../dtos/register-user.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import { UserService } from '../user.service'
import database from '../../../config/database'
import { SendEmail } from '../../../utils/SendEmail'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const [error, registerUserDto] = RegisterUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const userService = new UserService(database)
    const emailService = new SendEmail()
    const user = await userService.registerUser(registerUserDto!)
    await emailService.registerUser(user)

    CustomResponse.execute({
      message: `User ${user.email} registered successfully`,
      res,
      status: HttpStatus.CREATED,
    })
  } catch (error) {
    HandleError.execute(error, 'registerUser', res)
  }
}
