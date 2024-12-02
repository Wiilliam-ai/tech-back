import { PrismaClient } from '@prisma/client'
import { DocsDatasourse } from './docs.datasourse'
import { DocsEntity } from './docs.entity'
import { CustomError } from '../../helpers/errors/custom-error'
import { RegisterDocsDto } from './dtos/register-docs.dto'
import { UploadFile } from '../../utils/uploadFile'
import { PathGlobal } from '../../helpers/global/path-global'

export class DocsService implements DocsDatasourse {
  constructor(private prisma: PrismaClient) {}

  async deleteDocs(id: number): Promise<boolean> {
    const docs = await this.prisma.docs.findUnique({
      where: {
        id,
      },
      include: {
        resources: true,
      },
    })

    if (!docs) throw CustomError.badRequest('Documento no encontrado')

    await this.prisma.docs.delete({
      where: {
        id,
      },
    })

    const filePATH = PathGlobal.DOCS_PATH + docs.resources.url

    const removeResource = await this.prisma.resource.delete({
      where: {
        id: docs.document,
      },
    })

    if (!removeResource)
      throw CustomError.badRequest('Error al eliminar el recurso')

    UploadFile.deleteFile(filePATH)

    return true
  }

  private getTypesDocs(urlFile: string): string {
    const extension = urlFile.split('.')
    // obtenemos la extencion
    const ext = extension[extension.length - 1]

    let nameExt = ''

    const typesImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']
    const typesDocs = ['pdf', 'docx', 'pptx', 'xlsx']
    const typeFilePrograming = [
      'js',
      'ts',
      'jsx',
      'tsx',
      'py',
      'java',
      'php',
      'html',
      'css',
      'scss',
      'json',
      'xml',
      'sql',
      'sh',
    ]

    const isImage = typesImage.includes(ext)
    const isDocs = typesDocs.includes(ext)
    const isFilePrograming = typeFilePrograming.includes(ext)

    // veificamos que solo se admitan estos tipos de archivos
    if (!isImage && !isDocs && !isFilePrograming)
      throw CustomError.badRequest('Tipo de archivo no permitido')

    if (isFilePrograming) nameExt = 'code'
    if (isImage) nameExt = 'image'
    if (isDocs) nameExt = 'docs'

    return nameExt
  }

  async registerDocs(docs: RegisterDocsDto): Promise<DocsEntity> {
    const newResource = await this.prisma.resource.create({
      data: {
        url: docs.urlFile,
      },
    })

    if (!newResource)
      throw CustomError.badRequest('Error al registrar el recurso')

    const typeDoc = this.getTypesDocs(docs.urlFile)

    const newDocs = await this.prisma.docs.create({
      data: {
        title: docs.title,
        typeDoc: typeDoc,
        document: newResource.id,
        lessonId: docs.lessonId,
      },
    })

    if (!newDocs)
      throw CustomError.badRequest('Error al registrar el documento')

    return {
      id: newDocs.id,
      title: newDocs.title,
      typeDoc: newDocs.typeDoc,
      document: docs.urlFile,
    }
  }
}
