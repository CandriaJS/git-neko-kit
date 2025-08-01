import {
  format_date,
  get_langage_color,
  get_local_git_repo_info,
  get_local_git_repos_list,
  get_local_npm_package_info,
  get_local_npm_packages_list,
  get_local_repo_default_branch,
  get_relative_time,
  get_remote_repo_default_branch,
  render_diff,
  render_markdown
} from '@/common'
import { create_state_id } from '@/models'
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

/** 客户端模块 */
export {
  Client,
  GitHubClient
}
export * as github from '@/models/platform/github'

/** 工具函数 */
export {
  create_state_id,
  format_date,
  get_langage_color,
  get_local_git_repo_info,
  get_local_git_repos_list,
  get_local_npm_package_info,
  get_local_npm_packages_list,
  get_local_repo_default_branch,
  get_relative_time,
  get_remote_repo_default_branch,
  render_diff,
  render_markdown
}
export default Client
export * from '@/types'
