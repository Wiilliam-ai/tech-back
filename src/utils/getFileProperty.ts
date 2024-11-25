import { Generator } from './generator'

type FileMid = Express.Request['file'] | Express.Multer.File | undefined

type PropertyFile = {
  buffer: Buffer
  originalname: string
  randomname: string
  mimetype: string
  isData: boolean
}

const defatulPropertyFile: PropertyFile = {
  buffer: Buffer.from(''),
  originalname: '',
  randomname: '',
  mimetype: '',
  isData: false,
}

export const getFileProperty = (file: FileMid): PropertyFile => {
  if (!file) return defatulPropertyFile
  const { buffer, originalname, mimetype } = file
  // obbtenemos el nombre con el que se mando
  // obtenemos la extensión del archivo
  const extension = originalname.split('.').pop()
  // generamos el nuevo nombre del archivo
  const newName = Generator.randomText() + '.' + extension
  return {
    buffer,
    originalname,
    randomname: newName,
    mimetype,
    isData: true,
  }
}
