import { Router } from 'express'
import { FilesMiddleware } from '../../helpers/middlewares/files-midleware'
import { registerDocs } from './controllers/register-docs.controller'
import { deleteDocs } from './controllers/delete-docs.controller'

export class DocsRoutes {
  static get routes() {
    const router = Router()
    const upload = FilesMiddleware.upload
    router.post('/', upload.single('docs'), registerDocs)
    router.delete('/:id', deleteDocs)
    return router
  }
}
