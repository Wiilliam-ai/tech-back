import multer from 'multer'

export class FilesMiddleware {
  static upload = multer({ storage: multer.memoryStorage() })
}
