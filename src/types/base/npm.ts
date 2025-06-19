/** Npm包信息 */
export interface NpmPackageInfoType {
  /** 包名 */
  name: string
  /** 文件夹路径 */
  path: string
  /** 仓库地址 */
  html_url: string
  /** 仓库名称 */
  owner: string
  /** 仓库名称 */
  repo: string
}

export interface NpmPackageInfoListOptionsType {
  /** 忽略的包名 */
  packageName: string[]
  /** 包名前缀 */
  prefix: string
}

export interface NpmPackageInfoListType {
  /** 总数 */
  total: number
  /** 包列表 */
  items: Array<NpmPackageInfoType>
}
