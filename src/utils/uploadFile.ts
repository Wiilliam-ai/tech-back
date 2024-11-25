import fs from 'fs'

export class UploadFile {
  static saveImage(imgText: string, bufferImg: Buffer) {
    // verificar que exista la carpeta uploads

    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }

    const path = `uploads/${imgText}`
    // verificar que exista la carpeta uploads

    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }

    if (bufferImg) fs.writeFileSync(path, bufferImg)
  }
}
