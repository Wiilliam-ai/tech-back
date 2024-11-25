import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CompleteRecoverDto } from '../dtos/complete-recover.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import database from '../../../config/database'
import { AuthServices } from '../auth.services'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const completeRecover = async (req: Request, res: Response) => {
  try {
    const [error, completeRecoverDto] = CompleteRecoverDto.check(req.body)

    if (error) throw CustomError.badRequest(error)

    const authService = new AuthServices(database)
    await authService.completeRecover(completeRecoverDto!)

    CustomResponse.execute({
      res,
      status: HttpStatus.OK,
      message: 'Password changed successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'completeRecver', res)
  }
}
