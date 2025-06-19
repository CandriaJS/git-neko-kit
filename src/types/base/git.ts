/** 本地Git仓库信息 */
export interface GitRepoInfoType {
  /** 文件夹名称 */
  name: string
  /** 文件夹路径 */
  path: string
  /**
   * git地址，原始地址可能是反代的地址
   *  */
  url: string
  /**
   * 仓库地址, 这个是经过处理的，保证是不经过任何代理地址的地址
   * */
  html_url: string
  /** 仓库名称 */
  owner: string
  /** 仓库名称 */
  repo: string
}

/** 获取本地路径的Git仓库信息列表 */
export interface GitInfoListType {
  /** 总数 */
  total: number
  items: Array<GitRepoInfoType>
}

export interface GitRepoInfoListOptionsType {
  /** 是否递归查找 */
  loop?: boolean
  /** 递归最大深度 */
  maxDepth?: number
  /** 忽略目录 */
  dir?: string[]
}
