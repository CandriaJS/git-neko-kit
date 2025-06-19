import fs from 'node:fs'
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
  exists,
  parse_git_url
} from '@/common/utils'
import type {
  GitInfoListType,
  GitRepoInfoListOptionsType,
  GitRepoInfoType
} from '@/types'

/**
 * 获取 Git 版本
 * @returns Git 版本
 * @example
 * ```ts
 * console.log(await get_git_version())
 * -> 'git version 2.39.2.windows.1'
 * ```
 */
async function get_git_version (): Promise<string | null> {
  try {
    return await simpleGit().raw(['--version'])
  } catch {
    return null
  }
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
  return !!await get_git_version()
}

/**
 * 获取本地 Git 仓库信息
 * @description 获取本地 Git 仓库信息，返回仓库名称、仓库路径、仓库地址等信息
 * @param local_path - 本地仓库路径
 * @returns Git 仓库信息
 * @example
 * ```ts
 * const info = await get_local_git_repo_info('D:/project/repo')
 * console.log(info)
 * -> {
 *   name: 'repo',
 *   path: 'D:/project/repo',
 *   url: 'https://github.com/owner/repo.git',
 *   html_url: 'https://github.com/owner/repo',
 *   owner: 'owner',
 *   repo: 'repo'
 * }
 * ```
 */
export async function get_local_git_repo_info (
  local_path: string
): Promise<GitRepoInfoType | null> {
  try {
    if (!local_path) throw new Error(MissingLocalRepoPathMsg)
    if (!await exists(path.join(local_path)) || !await exists(path.join(local_path, '.git'))) return null
    const git = simpleGit(local_path)
    const remotes = await git.getRemotes(true)
    if (remotes.length > 0) {
      const remoteUrl = remotes[0].refs.push
      const { owner, repo, html_url } = parse_git_url(remoteUrl)
      return {
        name: path.basename(local_path),
        path: path.join(local_path),
        url: remoteUrl,
        html_url,
        owner,
        repo,
        default_branch: await get_local_repo_default_branch(local_path)
      }
    }
    return null
  } catch (error) {
    throw new Error(`获取本地仓库信息失败: ${error}`)
  }
}

/**
 * 获取本地仓库信息列表
 * @param local_path 本地仓库路径
 * @param options 配置项
 * - loop 是否递归查找
 * - maxDepth 递归最大深度
 * - dir 忽略的文件夹名称列表
 * @returns LocalGitInfoListType 仓库信息列表
 * @example
 * ```ts
 * // 无数据
 * const res = await get_local_git_repo_list('D:\\project\\GitHub', { loop: true, maxDepth: 5, dir: ['node_modules'] })
 * -> {
 *   total: 0,
 *   items: []
 * }
 *
 * // 有数据
 * const res = await get_local_git_repo_list('D:\\project\\GitHub', { loop: true, maxDepth: 5, dir: ['node_modules'] })
 * -> {
 *   total: 1,
 *   items: [{
 *     name: "GitHub",
 *     path: "D:\\project\\GitHub\\GitHub",
 *     url: "https://github.com/GitHub/GitHub.git",
 *     html_url: "https://github.com/GitHub/GitHub",
 *     owner: "GitHub",
 *     repo: "GitHub"
 *   }]
 * }
 * ```
 */
export async function get_local_git_repos_list (
  dirpath: string,
  options: GitRepoInfoListOptionsType = {
    loop: false,
    maxDepth: 5,
    dir: []
  }
): Promise<GitInfoListType> {
  const { loop = false, maxDepth = 5, dir = [] } = options

  const searchRepo = async (
    dirPath: string,
    currentDepth: number = 0
  ): Promise<GitRepoInfoType[]> => {
    try {
      if (!await exists(dirPath)) return []
      const stat = await fs.promises.stat(dirPath)
      if (!stat.isDirectory()) return []

      const items: GitRepoInfoType[] = []
      const currentRepoInfo = await get_local_git_repo_info(dirPath)

      if (currentRepoInfo) {
        items.push(currentRepoInfo)
      }

      if (loop && currentDepth < maxDepth) {
        const dirItems = await fs.promises.readdir(dirPath, { withFileTypes: true })

        const subResults = await Promise.all(
          dirItems
            .filter(item =>
              item.isDirectory() &&
              !dir.includes(item.name)
            )
            .map(async item => {
              const subPath = path.join(dirPath, item.name)
              return await searchRepo(subPath, currentDepth + 1)
            })
        )

        items.push(...subResults.flat())
      }

      return items
    } catch (error) {
      return []
    }
  }

  try {
    if (!dirpath) throw new Error(MissingLocalRepoPathMsg)
    dirpath = path.resolve(dirpath).replace(/\\/g, '/')
    if (!await exists(dirpath)) throw new Error(LocalRepoPathNotFoundMsg(dirpath))
    if (!await is_installed_git()) throw new Error(GitClientNotInstalledMsg)

    const items = await searchRepo(dirpath)
    return {
      total: items.length,
      items
    }
  } catch (error) {
    throw new Error(`获取本地目录git仓库列表失败: ${(error as Error).message}`)
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
