import { Request, Response } from 'express'
import { LoginUserDto } from '../dtos/login-user.dto'
import { AuthServices } from '../auth.services'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { HttpStatus } from '../../../config/http-status'
import { JwtAuth } from '../../../config/jwtauth'
import { HandleError } from '../../../helpers/errors/handle-error'
import { CustomError } from '../../../helpers/errors/custom-error'
import database from '../../../config/database'

export const loginUser = async (req: Request, res: Response) => {
  try {
    const [error, loginUserDto] = LoginUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const authServices = new AuthServices(database)
    const user = await authServices.loginUser(loginUserDto!)
    const token = await JwtAuth.generateToken({ id: user.id })

    CustomResponse.execute({
      message: 'User logged in successfully',
      res,
      status: HttpStatus.OK,
      data: { user, token },
    })
  } catch (error) {
    HandleError.execute(error, 'Error logging in user', res)
  }
}
