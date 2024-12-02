import { join } from 'path'

export class PathGlobal {
  static get BASE_PATH(): string {
    return join(__dirname, '../../../')
  }

  static get ASSETS_PATH(): string {
    return join(PathGlobal.BASE_PATH, 'assets')
  }

  static get DOCS_PATH(): string {
    return join(PathGlobal.ASSETS_PATH, 'docs')
  }

  static get ASSETS_HLS_PATH(): string {
    return join(PathGlobal.ASSETS_PATH, 'hls')
  }
}
