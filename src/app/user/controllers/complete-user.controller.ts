import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CompleteUserDto } from '../dtos/complete-user.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import database from '../../../config/database'
import { UserService } from '../user.service'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'

export const completeUser = async (req: Request, res: Response) => {
  try {
    const [error, completeUserDto] = CompleteUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)
    const userService = new UserService(database)
    await userService.completRegisterUser(completeUserDto!)
    CustomResponse.execute({
      res,
      status: HttpStatus.OK,
      message: 'User verified successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'completeUser', res)
  }
}
