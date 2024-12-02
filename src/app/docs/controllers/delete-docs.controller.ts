import { Request, Response } from 'express'
import { HandleError } from '../../../helpers/errors/handle-error'
import { DocsService } from '../docs.service'
import database from '../../../config/database'
import { CustomResponse } from '../../../helpers/custom/custom-response'

export const deleteDocs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    console.log('Delete docs', id)

    const docsService = new DocsService(database)

    const isDeleted = await docsService.deleteDocs(Number(id))

    if (!isDeleted) throw new Error('Error to delete docs')

    CustomResponse.execute({
      res,
      message: 'Docs deleted successfully',
    })
  } catch (error) {
    HandleError.execute(error, 'deleteDocs', res)
  }
}
