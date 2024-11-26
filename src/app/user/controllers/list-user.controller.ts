import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { UserService } from '../user.service'
import database from '../../../config/database'
import { CustomResponse } from '../../../helpers/custom/custom-response'

export const listUsers = async (req: Request, res: Response) => {
  try {
    const usersService = new UserService(database)

    const users = await usersService.listUsers()

    CustomResponse.execute({
      res,
      data: users,
      message: 'List of users',
    })
  } catch (error) {
    HandleError.execute(error, 'listUsers', res)
  }
}
