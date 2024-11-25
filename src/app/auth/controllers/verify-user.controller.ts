import { Request, Response } from 'express'
import { VerifyUserDto } from '../dtos/verifyUser.dto'
import { AuthServices } from '../auth.services'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CustomError } from '../../../helpers/errors/custom-error'
import database from '../../../config/database'

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const [error, verifyUserDto] = VerifyUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const userServices = new AuthServices(database)

    const user = await userServices.verifyUser(verifyUserDto!)

    CustomResponse.execute({
      message: 'User verified successfully',
      res,
      status: HttpStatus.OK,
      data: { user },
    })
  } catch (error) {
    HandleError.execute(error, 'Error verifying user', res)
  }
}
