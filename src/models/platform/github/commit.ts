import { capitalize, isEmpty } from 'lodash'

import {
  CommitNotFoundMsg,
  CommitOrRepoNotFoundMsg,
  format_date,
  MissingRepoIdentifierMsg,
  parse_git_url,
  RepoOrPermissionDeniedMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/client'
import {
  ApiResponseType,
  CommitInfoParamType,
  CommitInfoResponseType,
  CommitListParamType,
  CommitListResponseType,
  DiffEntry,
  ParentCommit
} from '@/types'

/**
 * Commit 提交操作类
 *
 * 提供对GitHub Commit的CRUD操作，包括：
 * - 获取一个提交信息
 */
export class Commit extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.api_url = base.api_url
    this.base_url = base.base_url
  }

  /**
   * 获取一个提交信息
   * 权限:
   * — Contents: read-only
   * @param options - 提交信息参数对象
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - sha 提交的SHA值，如果不提供，则默认获取仓库的默认分支的最新提交信息
   * @returns 提交信息
   * @example
   * ```ts
   * const commitInfo = await commit.get_commit_info({ owner: 'owner', repo: 'repo' })
   * -> 提交信息对象
   * ```
   */
  public async get_commit_info (
    options: CommitInfoParamType
  ): Promise<ApiResponseType<CommitInfoResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let owner, repo, url, sha
      if ('url' in options) {
        url = options.url
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options.owner
        repo = options.repo
      } else {
        throw new Error(MissingRepoIdentifierMsg)
      }
      if (!options.sha) {
        const repoInfo = await this.get_repo()
        const default_branch = await repoInfo.get_repo_default_branch({ owner, repo })
        sha = default_branch
      } else {
        sha = options.sha
      }
      const res = await this.get(`/repos/${owner}/${repo}/commits/${sha}`)
      switch (res.statusCode) {
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
        case 404:
          throw new Error(CommitOrRepoNotFoundMsg)
        case 422:
          throw new Error(CommitNotFoundMsg)
      }

      if (res.data) {
        const [
          authorDate,
          committerDate
        ] = await Promise.all([
          this.format
            ? await format_date(res.data.commit.author.date)
            : res.data.commit.author.date,
          this.format
            ? await format_date(res.data.commit.committer.date)
            : res.data.commit.committer.date
        ])
        const message: string = res.data?.commit?.message
        const [title, ...bodyParts] = message.split('\n')
        const CommitData: CommitInfoResponseType = {
          html_url: res.data.html_url,
          sha: res.data.sha,
          comments_url: res.data.comments_url,
          commit: {
            url: res.data.commit.url,
            author: {
              id: res.data.author.id,
              login: res.data.author.login,
              name: isEmpty(res.data.commit.author.name) ? null : res.data.commit.author.name,
              email: isEmpty(res.data.commit.author.email) ? null : res.data.commit.author.email,
              avatar_url: res.data.author.avatar_url,
              html_url: res.data.author.html_url,
              type: capitalize(String(res.data.author.type).toLowerCase()),
              date: authorDate
            },
            committer: {
              id: res.data.committer.id,
              login: res.data.committer.login,
              name: isEmpty(res.data.commit.committer.name) ? null : res.data.commit.committer.name,
              email: isEmpty(res.data.commit.committer.email) ? null : res.data.commit.committer.email,
              avatar_url: res.data.committer.avatar_url,
              html_url: res.data.committer.html_url,
              type: capitalize(String(res.data.committer.type).toLowerCase()),
              date: committerDate
            },
            message: res.data.commit.message,
            ...(this.format && {
              title,
              body: bodyParts.length > 0 ? bodyParts.join('\n') : null
            }),
            tree: {
              url: res.data.commit.tree.url,
              sha: res.data.commit.tree.sha
            }
          },
          parents: res.data.parents.map((parent: ParentCommit) => ({
            sha: parent.sha,
            url: parent.url
          })),
          stats: {
            additions: res.data.stats.additions,
            deletions: res.data.stats.deletions,
            total: res.data.stats.total
          },
          files: res.data.files.map((file: DiffEntry) => ({
            sha: file.sha,
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            blob_url: file.blob_url,
            raw_url: file.raw_url
          }))
        }
        res.data = CommitData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取提交信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取提交列表
   * 权限:
   * — Contents: read-only
   * @param options - 提交列表参数对象
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - sha 提交的SHA值，如果不提供，则默认获取仓库的默认分支的最新提交信息
   * - path 可选，提交路径
   * - author 可选，提交作者
   * - since 可选，提交时间范围开始
   * - until 可选，提交时间范围结束
   * - per_page 可选，每页提交数量，默认为30
   * - page 可选，页码，默认为1
   * @returns 提交列表
   * @example
   * ```ts
   * const commitList = await commit.get_commit_list({ owner: 'owner', repo:'repo' })
   * -> 提交对象列表
   * ```
   */
  public async get_commit_list (
    options: CommitListParamType
  ): Promise<ApiResponseType<CommitListResponseType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let owner, repo, url
      if ('url' in options) {
        url = options.url
        const info = parse_git_url(url)
        owner = info?.owner
        repo = info?.repo
      } else if ('owner' in options && 'repo' in options) {
        owner = options.owner
        repo = options.repo
      } else {
        throw new Error(MissingRepoIdentifierMsg)
      }
      const { ...queryOptions } = options
      if (!options.sha) {
        const repoInfo = await this.get_repo()
        const default_branch = await repoInfo.get_repo_default_branch({ owner, repo })
        if (default_branch) queryOptions.sha = default_branch
      } else {
        queryOptions.sha = options.sha
      }
      const params: Record<string, string> = {}
      if (queryOptions.sha) params.sha = queryOptions.sha
      if (queryOptions.path) params.path = queryOptions.path
      if (queryOptions.author) params.author = queryOptions.author
      if (queryOptions.since) params.since = queryOptions.since
      if (queryOptions.until) params.until = queryOptions.until
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.page = queryOptions.page.toString()
      const apiUrl = `/repos/${owner}/${repo}/commits`
      const res = await this.get(apiUrl, params)
      switch (res.statusCode) {
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
        case 404:
          throw new Error(CommitOrRepoNotFoundMsg)
      }
      if (res.data) {
        const CommitData: CommitListResponseType = await Promise.all(res.data.map(async (commit: Record<string, any>): Promise<CommitInfoResponseType> => {
          const [title, ...bodyParts] = commit.commit.message.split('\n')
          return {
            html_url: commit.html_url,
            sha: commit.sha,
            comments_url: commit.comments_url,
            commit: {
              url: commit.commit.url,
              author: {
                id: commit.author.id,
                login: commit.author.login,
                name: isEmpty(commit.committer.name) ? null : commit.committer.name,
                email: isEmpty(commit.committer.email) ? null : commit.committer.email,
                avatar_url: commit.author.avatar_url,
                html_url: commit.author.html_url,
                type: capitalize(String(commit.author.type).toLowerCase()),
                date: this.format
                  ? await format_date(commit.commit.author.date)
                  : commit.commit.author.date
              },
              committer: {
                id: commit.committer.id,
                login: commit.committer.login,
                name: isEmpty(commit.committer.name) ? null : commit.committer.name,
                email: isEmpty(commit.committer.email) ? null : commit.committer.email,
                avatar_url: commit.committer.avatar_url,
                html_url: commit.committer.html_url,
                type: capitalize(String(commit.committer.type).toLowerCase()),
                date: this.format
                  ? await format_date(commit.commit.committer.date)
                  : commit.commit.committer.date
              },
              message: commit.commit.message,
              ...(this.format && {
                title,
                body: bodyParts.length > 0 ? bodyParts.join('\n') : null
              }),
              tree: {
                url: commit.commit.tree.url,
                sha: commit.commit.tree.sha
              }
            },
            parents: commit.parents.map((parent: ParentCommit) => ({
              sha: parent.sha,
              url: parent.url
            })),
            stats: {
              additions: commit.stats.additions,
              deletions: commit.stats.deletions,
              total: commit.stats.total
            },
            files: commit.files.map((file: DiffEntry) => ({
              sha: file.sha,
              filename: file.filename,
              status: file.status,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
              blob_url: file.blob_url,
              raw_url: file.raw_url
            }))
          }
        }))
        res.data = CommitData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取提交列表失败: ${(error as Error).message}`)
    }
  }
}
