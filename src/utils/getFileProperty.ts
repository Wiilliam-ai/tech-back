import { Generator } from './generator'

type FileMid = Express.Request['file'] | Express.Multer.File | undefined

export const getFileProperty = (file: FileMid): [string, Buffer] => {
  if (!file) return ['', Buffer.from('')]
  const { buffer, originalname, fieldname } = file
  // obbtenemos el nombre con el que se mando
  // obtenemos la extensión del archivo
  const extension = originalname.split('.').pop()
  // generamos el nuevo nombre del archivo
  const newName = Generator.randomText() + '.' + extension
  return [newName, buffer]
}
