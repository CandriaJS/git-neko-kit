import { readJSONSync } from '@/common/utils'
import { basePath } from '@/root'
import type { PkgInfoType } from '@/types'

export const pkg: PkgInfoType = readJSONSync(`${basePath}/package.json`)
