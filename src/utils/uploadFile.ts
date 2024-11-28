import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { PathGlobal } from '../helpers/global/path-global'

export class UploadFile {
  private static verifyExistAssets() {
    if (!fs.existsSync(PathGlobal.ASSETS_PATH)) {
      fs.mkdirSync(PathGlobal.ASSETS_PATH)
    }
  }

  private static verifyDirectory(directory: string) {
    if (!fs.existsSync(`${PathGlobal.ASSETS_PATH}/${directory}`)) {
      fs.mkdirSync(`${PathGlobal.ASSETS_PATH}/${directory}`)
    }
  }

  static saveImage(imgText: string, directory: string, bufferImg: Buffer) {
    this.verifyExistAssets()
    this.verifyDirectory(directory)
    const path = `${PathGlobal.ASSETS_PATH}/${directory}/${imgText}`

    if (bufferImg) fs.writeFileSync(path, bufferImg)
  }

  static saveVideo(videoText: string, directory: string, bufferVideo: Buffer) {
    this.verifyExistAssets()
    this.verifyDirectory(directory)
    const path = `${PathGlobal.ASSETS_PATH}/${directory}/${videoText}`
    if (bufferVideo) fs.writeFileSync(path, bufferVideo)
  }

  static deleteImage(imgText: string, directory: string) {
    const path = `${PathGlobal.ASSETS_PATH}/${directory}/${imgText}`
    if (fs.existsSync(path)) fs.unlinkSync(path)
  }

  static deleteFile(file: string) {
    if (fs.existsSync(file)) fs.unlinkSync(file)
  }

  static async convertToHLS(videoPath: string): Promise<string> {
    const outputDir = path.dirname(videoPath)
    const outputFilename = path.basename(videoPath, path.extname(videoPath))
    const hlsDir = path.join(outputDir, `${outputFilename}_hls`)

    // Crear el directorio HLS si no existe
    if (!fs.existsSync(hlsDir)) {
      fs.mkdirSync(hlsDir, { recursive: true })
    }

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-profile:v baseline', // Compatibilidad con la mayoría de dispositivos
          '-level 3.0',
          '-s 640x360', // Resolución
          '-start_number 0',
          '-hls_time 10', // Duración de cada segmento
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(path.join(hlsDir, 'playlist.m3u8'))
        .on('end', () => {
          console.log(`Conversión a HLS completada: ${hlsDir}`)
          resolve(hlsDir)
          // this.deleteFile(videoPath)
        })
        .on('error', (err) => {
          console.error('Error durante la conversión a HLS:', err)
          reject(err)
        })
        .run()
    })
  }
}
