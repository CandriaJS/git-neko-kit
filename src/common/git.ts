import path from 'node:path'

import { simpleGit } from 'simple-git'

import {
  GitClientNotInstalledMsg,
  LocalRepoPathNotFoundMsg,
  MissingLocalRepoPathMsg,
  MissingRemoteRepoUrlMsg,
  MissingRepoUrlMsg
} from '@/common/errorMsg'
import {
  exec,
  exists,
  parse_git_url
} from '@/common/utils'

/**
 * 获取 Git 版本
 * @returns Git 版本
 * @example
 * ```ts
 * console.log(await get_git_version())
 * -> 'git version 2.39.2.windows.1'
 * ```
 */
async function get_git_version (): Promise<string> {
  const { stdout } = await exec('git --version')
  return stdout.toString().trim()
}

/**
 * 检查 Git 是否已安装
 * @returns Git 是否已安装
 * @example
 * ```ts
 * console.log(await is_installed_git())
 * -> true
 * ```
 */
async function is_installed_git (): Promise<boolean> {
  try {
    await get_git_version()
    return true
  } catch (error) {
    return false
  }
}
/**
 * 获取本地仓库的默认分支
 * @param local_path - 本地仓库路径
 * @returns 默认分支名称
 * @example
 * ```ts
 * console.log(await get_local_repo_default_branch('/path/to/repo'))
 * -> 'main'
 * ```
 */
export async function get_local_repo_default_branch (local_path: string): Promise<string> {
  if (!local_path) throw new Error(MissingLocalRepoPathMsg)
  try {
    if (!await is_installed_git()) throw new Error(GitClientNotInstalledMsg)
    const git_path = path.join(local_path)
    const isGitRepo = await exists(git_path)
    if (!isGitRepo) {
      throw new Error(LocalRepoPathNotFoundMsg(git_path))
    }

    const repo = simpleGit(local_path)
    const head = await repo.revparse(['--abbrev-ref', 'HEAD'])
    if (!head) {
      throw new Error('喵呜~, 无法获取仓库分支信息，请确保仓库已初始化')
    }

    return head.trim()
  } catch (error) {
    throw new Error(`获取本地仓库默认分支失败: ${(error as Error).message}`)
  }
}

/**
 * 获取远程仓库的默认分支
 * @param remote_url - 远程仓库URL
 * @returns 默认分支名称
 * @example
 * ```ts
 * console.log(await get_remote_repo_default_branch('https://github.com/CandriaJS/git-neko-kit'))
 * -> 'main'
 * ```
 */
export async function get_remote_repo_default_branch (remote_url: string): Promise<string> {
  if (!remote_url) throw new Error(MissingRemoteRepoUrlMsg)
  try {
    if (!await is_installed_git()) throw new Error(GitClientNotInstalledMsg)
    const git_url = new URL(remote_url)
    const { owner, repo: RepoName } = parse_git_url(git_url.href)
    if (!(owner || RepoName)) throw new Error(MissingRepoUrlMsg(git_url.href))
    const repo = simpleGit()
    const remoteInfo = await repo.raw(['ls-remote', '--symref', remote_url, 'HEAD'])
    const defaultBranchMatch = remoteInfo.match(/^ref: refs\/heads\/([^\t\n]+)/m)
    if (!defaultBranchMatch) {
      throw new Error('喵呜~, 无法从远程仓库获取默认分支信息')
    }
    return defaultBranchMatch[1]
  } catch (error) {
    throw new Error(`获取远程仓库默认分支失败: ${(error as Error).message}`)
  }
}
