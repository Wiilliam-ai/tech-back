import { DocsEntity } from './docs.entity'
import { RegisterDocsDto } from './dtos/register-docs.dto'

export abstract class DocsDatasourse {
  abstract registerDocs(docs: RegisterDocsDto): Promise<DocsEntity>
  abstract deleteDocs(id: number): Promise<boolean>
}
