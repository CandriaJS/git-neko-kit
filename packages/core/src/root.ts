import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** 当前文件所在路径 */
const filePath = Object.freeze(fileURLToPath(import.meta.url))

/** 项目根目录 */
export const basePath = Object.freeze(path.join(filePath, '../..').replace(/\\/g, '/'))
