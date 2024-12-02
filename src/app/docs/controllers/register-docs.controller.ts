import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { getFileProperty } from '../../../utils/getFileProperty'
import { CustomError } from '../../../helpers/errors/custom-error'
import { DocsService } from '../docs.service'
import database from '../../../config/database'
import { RegisterDocsDto } from '../dtos/register-docs.dto'
import { UploadFile } from '../../../utils/uploadFile'
import { CustomResponse } from '../../../helpers/custom/custom-response'

export const registerDocs = async (req: Request, res: Response) => {
  try {
    const { buffer, isData, randomname } = getFileProperty(req.file)

    if (!isData) throw CustomError.badRequest('File is required')

    req.body.urlFile = randomname

    const [error, registerDocsDto] = RegisterDocsDto.check(req.body)
    if (error) throw CustomError.badRequest(error)

    const docsService = new DocsService(database)

    const docs = await docsService.registerDocs(registerDocsDto!)

    const isSaved = docs.document === randomname

    if (isSaved) UploadFile.saveImage(docs.document, 'docs', buffer)

    CustomResponse.execute({
      res,
      data: docs,
      message: 'Docs created successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'registerDocs', res)
  }
}
