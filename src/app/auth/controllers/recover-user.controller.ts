import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { RecoverUserDto } from '../dtos/recover-user.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import database from '../../../config/database'
import { AuthServices } from '../auth.services'
import { SendEmail } from '../../../utils/SendEmail'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const recoverUser = async (req: Request, res: Response) => {
  try {
    const [error, recoverUserDto] = RecoverUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const authService = new AuthServices(database)
    const user = await authService.recoverUser(recoverUserDto!)
    const email = new SendEmail()
    await email.recoverUser(user.email, user.tokenVerif)

    CustomResponse.execute({
      res,
      status: HttpStatus.OK,
      message: 'Email sent successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'recoverUser', res)
  }
}
