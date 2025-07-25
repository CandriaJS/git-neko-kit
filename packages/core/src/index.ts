
import { GitHubClient } from '@/models/platform/github'
import { ClientType } from '@/types'

/** 基本客户端 */
class Client {
  public github: GitHubClient
  constructor (options: ClientType) {
    if (!options.github) {
      throw new Error('GitHub 客户端未配置')
    }
    this.github = new GitHubClient(options.github)
  }
}

export {
  Client
}
/** GitHub 模块 */
export {
  GitHubClient
}
export * as github from '@/models/platform/github'

export default Client
export * from '@/types'
