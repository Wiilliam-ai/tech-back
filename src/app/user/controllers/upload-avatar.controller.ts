import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { VerifyUserDto } from '../../auth/dtos/verifyUser.dto'
import { CustomError } from '../../../helpers/errors/custom-error'
import { getFileProperty } from '../../../utils/getFileProperty'
import { UserService } from '../user.service'
import database from '../../../config/database'
import { CustomResponse } from '../../../helpers/custom/custom-response'
import { UploadFile } from '../../../utils/uploadFile'

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    console.log({ body: req.body, file: req.file })
    const [error, verifyUserDto] = VerifyUserDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const dataFiles = getFileProperty(req.file)
    if (!dataFiles.isData) throw CustomError.notFound('File not found')
    const typeFile = dataFiles.mimetype.split('/')[0]
    if (typeFile !== 'image') throw CustomError.badRequest('Invalid file type')
    const types = ['image/jpeg', 'image/jpg', 'image/webp']
    const isValidType = types.includes(dataFiles.mimetype)
    if (!isValidType) throw CustomError.badRequest('Invalid file type')

    console.log('HOLA ESTA ES LA DATA DEL ARCHIVO', dataFiles)
    const userService = new UserService(database)
    await userService.uploadAvatar(dataFiles.randomname, verifyUserDto!)

    UploadFile.saveImage(dataFiles.randomname, 'avatars', dataFiles.buffer)

    CustomResponse.execute({
      res,
      message: 'Avatar uploaded successfully',
      data: {
        url: dataFiles.randomname,
      },
    })
  } catch (error) {
    HandleError.execute(error, 'Error uploading avatar', res)
  }
}
