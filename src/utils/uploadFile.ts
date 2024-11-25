import fs from 'fs'

export class UploadFile {
  static saveImage(imgText: string, directory: string, bufferImg: Buffer) {
    // verify if directory assets exists
    if (!fs.existsSync('assets')) {
      fs.mkdirSync('assets')
    }

    if (!fs.existsSync(`assets/${directory}`)) {
      fs.mkdirSync(`assets/${directory}`)
    }
    const path = `assets/${directory}/${imgText}`

    if (bufferImg) fs.writeFileSync(path, bufferImg)
  }

  static saveVideo(videoText: string, directory: string, bufferVideo: Buffer) {
    if (!fs.existsSync('assets')) {
      fs.mkdirSync('assets')
    }

    if (!fs.existsSync(`assets/${directory}`)) {
      fs.mkdirSync(`assets/${directory}`)
    }
    const path = `assets/${directory}/${videoText}`
    if (bufferVideo) fs.writeFileSync(path, bufferVideo)
  }

  static deleteImage(imgText: string, directory: string) {
    const path = `assets/${directory}/${imgText}`
    if (fs.existsSync(path)) fs.unlinkSync(path)
  }
}
