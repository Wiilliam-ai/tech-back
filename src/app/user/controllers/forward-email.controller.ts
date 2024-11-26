import { Request, Response } from 'express'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HandleError } from '../../../helpers/errors/handle-error'
import { ForwardEmailDto } from '../dtos/forward-email.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import { UserService } from '../user.service'
import database from '../../../config/database'
import { SendEmail } from '../../../utils/SendEmail'
import { HttpStatus } from '../../../config/http-status'

export const forwardEmail = async (req: Request, res: Response) => {
  try {
    const [error, forwardEmailDto] = ForwardEmailDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const userService = new UserService(database)
    const user = await userService.forwardEmail(forwardEmailDto!)
    const emailService = new SendEmail()
    await emailService.registerUser(user)

    CustomResponse.execute({
      message: `User ${user.email} forwarded successfully`,
      res,
      status: HttpStatus.OK,
    })
  } catch (error) {
    HandleError.execute(error, 'forwardEmail', res)
  }
}
