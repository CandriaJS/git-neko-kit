import { isEmpty } from 'lodash'

import {
  ConflictPullRequestShaValueMsg,
  format_date,
  MissingBaseBranchMsg,
  MissingHeadBranchMsg,
  MissingLinkedIssueIdentifierMsg,
  MissingLinkedIssueMsg,
  MissingPullRequestCommentBodyMsg,
  MissingPullRequestCommentNumberMsg,
  MissingPullRequestNumberMsg,
  MissingRepoOwnerOrNameMsg,
  MissingTitleMsg,
  PermissionDeniedMsg,
  PullRequestCommentOrRepoNotFoundMsg,
  PullRequestCommentRemoveFailedMsg,
  PullRequestCommentRemoveSuccessMsg,
  PullRequestCommentUpdateFailedMsg,
  PullRequestCommentUpdateSuccessMsg,
  PullRequestMergeMethodNotSupportedMsg,
  PullRequestOrRepoNotFoundMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  ApiResponseType,
  CreatePullRequestCommentParamType,
  CreatePullRequestCommentResponseType,
  CreatePullRequestParamType,
  CreatePullRequestResponseType,
  DeletePullRequestCommentParamType,
  DeletePullRequestCommentResponseType,
  GetPullRequestCommentInfoParamType,
  GetPullRequestCommentInfoResponseType,
  GetPullRequestCommentsListParamType,
  GetPullRequestCommentsListResponseType,
  GetPullRequestFilesListParamType,
  GetPullRequestFilesListResponseType,
  IssueLabelType,
  MergePullRequestParamType,
  MergePullRequestResponseType,
  PrUser,
  PullRequestFilesListType,
  PullRequestInfoParamType,
  PullRequestInfoResponseType,
  PullRequestListParamType,
  PullRequestListResponseType,
  UpdatePullRequestCommentParamType,
  UpdatePullRequestCommentResponseType,
  UpdatePullRequestParamType,
  UpdatePullRequestResponseType
} from '@/types'

/**
 * GitHub pull_request类
 *
 * 提供完整的GitHub pull_request管理，包括
 * - 获取pull_request列表
 * - 获取pull_request详情
 *
 * @class Auth
 * @extends GitHubClient GitHub基础操作类
 */
export class Pull_Request extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.api_url = base.api_url
    this.base_url = base.base_url
  }

  /**
   * 获取拉取请求详情
   * 权限:
   * - Pull requests: Read-And-Wirte
   * - Contents: Read-And-Wirte
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number Pr编号
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const res = await pull_request.get_pull_request_info({ owner: 'owner', repo:'repo', pr_number:1 })
   * -> 拉取提交信息对象
   * ```
   */
  public async get_pull_request_info (
    options: PullRequestInfoParamType
  ): Promise<ApiResponseType<PullRequestInfoResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, pr_number } = options
      const res = await this.get(`/repos/${owner}/${repo}/pulls/${pr_number}`)
      if (res.data) {
        const [
          createdAt,
          mergeddAt,
          updatedAt,
          closedAt,
          milestoneCreatedAt,
          milestoneUpdatedAt,
          milestoneClosedAt,
          milestoneDueOn
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at,
          !isEmpty(res.data.merged_at)
            ? this.format
              ? await format_date(res.data.merged_at)
              : res.data.merged_at
            : null,
          !isEmpty(res.data.closed_at)
            ? this.format
              ? await format_date(res.data.closed_at)
              : res.data.closed_at
            : null,
          this.format ? await format_date(res.data.milestone.created_at) : res.data.milestone.created_at,
          this.format ? await format_date(res.data.milestone.updated_at) : res.data.milestone.updated_at,
          !isEmpty(res.data.milestone.closed_at)
            ? this.format
              ? await format_date(res.data.milestone.closed_at)
              : res.data.milestone.closed_at
            : null,
          !isEmpty(res.data.milestone.due_on)
            ? this.format
              ? await format_date(res.data.milestone.due_on)
              : res.data.milestone.due_on
            : null
        ])
        const PrData: PullRequestInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          state: res.data.merged_at && !isEmpty(res.data.merged_at) ? 'merged' : res.data.state,
          locked: res.data.locked,
          title: res.data.title,
          body: res.data.body,
          draft: res.data.draft,
          created_at: createdAt,
          merged_at: mergeddAt,
          updated_at: updatedAt,
          closed_at: closedAt,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: isEmpty(res.data.user.name) ? null : res.data.user.name,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url
          },
          base: {
            label: res.data.base.label,
            ref: res.data.base.ref,
            sha: res.data.base.sha,
            user: {
              id: res.data.base.user.id,
              login: res.data.base.user.login,
              name: isEmpty(res.data.base.user.name) ? null : res.data.base.user.name,
              html_url: res.data.base.user.html_url,
              avatar_url: res.data.base.user.avatar_url
            },
            repo: {
              id: res.data.base.repo.id,
              owner: res.data.base.repo.owner,
              name: res.data.base.repo.name,
              full_name: res.data.base.repo.full_name
            }
          },
          head: {
            label: res.data.head.label,
            ref: res.data.head.ref,
            sha: res.data.head.sha,
            user: {
              id: res.data.head.user.id,
              login: res.data.head.user.login,
              name: isEmpty(res.data.head.user.name) ? null : res.data.head.user.name,
              html_url: res.data.head.user.html_url,
              avatar_url: res.data.head.user.avatar_url
            },
            repo: {
              id: res.data.head.repo.id,
              owner: res.data.head.repo.owner,
              name: res.data.head.repo.name,
              full_name: res.data.head.repo.full_name
            }
          },
          assignee: !isEmpty(res.data.assignee)
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: isEmpty(res.data.assignee.name) ? null : res.data.assignee.name,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url
              }
            : null,
          assignees: !isEmpty(res.data.assignees)
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
              id: assignee.id,
              login: assignee.login,
              name: isEmpty(assignee.name) ? null : assignee.name,
              html_url: assignee.html_url,
              avatar_url: assignee.avatar_url
            }))
            : null,
          milestone: !isEmpty(res.data.milestone)
            ? {
                id: res.data.milestone.id,
                url: res.data.milestone.url,
                number: res.data.milestone.number,
                state: res.data.milestone.state,
                title: res.data.milestone.title,
                description: res.data.milestone.description,
                open_issues: res.data.milestone.open_issues,
                closed_issues: res.data.milestone.closed_issues,
                created_at: milestoneCreatedAt,
                updated_at: milestoneUpdatedAt,
                closed_at: milestoneClosedAt,
                due_on: milestoneDueOn
              }
            : null,
          labels: !isEmpty(res.data.labels)
            ? res.data.labels.map((label: IssueLabelType) => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: res.data.commits,
          additions: res.data.additions,
          deletions: res.data.deletions,
          changed_files: res.data.changed_files
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取拉取请求信息失败： ${(error as Error).message}`)
    }
  }

  /**
   * 获取拉取请求列表
   * 权限:
   * - Pull requests: Read-Only
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number Pr编号
   * - state 状态
   * - base 基准分支
   * - sort 排序
   * - direction 排序方向
   * - per_page 每页数量
   * - page 页码
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const res = await pull_request.get_get_pull_request_list({ owner: 'owner', repo:'repo' })
   * -> 拉取提交信息对象列表
   * ```
   */
  public async get_get_pull_request_list (
    options: PullRequestListParamType
  ): Promise<ApiResponseType<PullRequestListResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.state) params.state = queryOptions.state
      if (queryOptions.base) params.base = queryOptions.base
      if (queryOptions.sort) params.sort = queryOptions.sort
      if (queryOptions.direction && !queryOptions.sort) params.direction = queryOptions.direction
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.page = queryOptions.page.toString()
      const res = await this.get(`/repos/${owner}/${repo}/pulls`, params)
      if (res.data) {
        const PrData: PullRequestListResponseType = await Promise.all(res.data.map(async (pr: Record<string, any>): Promise<PullRequestInfoResponseType> => ({
          id: pr.id,
          html_url: pr.html_url,
          number: pr.number,
          state: !isEmpty(pr.merged_at) ? 'merged' : pr.state,
          locked: pr.locked,
          title: pr.title,
          body: pr.body,
          draft: pr.draft,
          created_at: this.format ? format_date(pr.created_at) : pr.created_at,
          merged_at: !isEmpty(pr.merged_at)
            ? this.format
              ? await format_date(pr.merged_at)
              : pr.merged_at
            : null,
          updated_at: this.format ? format_date(pr.updated_at) : pr.updated_at,
          closed_at: !isEmpty(pr.closed_at)
            ? this.format
              ? await format_date(pr.closed_at)
              : pr.closed_at
            : null,
          user: {
            id: pr.user.id,
            login: pr.user.login,
            name: isEmpty(pr.user.name) ? null : pr.user.name,
            html_url: pr.user.html_url,
            avatar_url: pr.user.avatar_url
          },
          base: {
            label: pr.base.label,
            ref: pr.base.ref,
            sha: pr.base.sha,
            user: {
              id: pr.base.user.id,
              login: pr.base.user.login,
              name: isEmpty(pr.base.user.name) ? pr.base.user.login : pr.base.user.name,
              html_url: pr.base.user.html_url,
              avatar_url: pr.base.user.avatar_url
            },
            repo: {
              id: pr.base.repo.id,
              owner: pr.base.repo.owner,
              name: pr.base.repo.name,
              full_name: pr.base.repo.full_name
            }
          },
          head: {
            label: pr.head.label,
            ref: pr.head.ref,
            sha: pr.head.sha,
            user: {
              id: pr.head.user.id,
              login: pr.head.user.login,
              name: isEmpty(pr.head.user.name) ? null : pr.head.user.name,
              html_url: pr.head.user.html_url,
              avatar_url: pr.head.user.avatar_url
            },
            repo: {
              id: pr.head.repo.id,
              owner: pr.head.repo.owner,
              name: pr.head.repo.name,
              full_name: pr.head.repo.full_name
            }
          },
          assignee: !isEmpty(pr.assignee)
            ? {
                id: pr.assignee.id,
                name: pr.assignee.name,
                login: pr.assignee.login,
                html_url: pr.assignee.html_url,
                avatar_url: pr.assignee.avatar_url
              }
            : null,
          assignees: !isEmpty(pr.assignees)
            ? pr.assignees.map((assignee: Record<string, any>): PrUser => ({
              id: assignee.id,
              name: assignee.name,
              login: assignee.login,
              html_url: assignee.html_url,
              avatar_url: assignee.avatar_url
            }))
            : null,
          milestone: !isEmpty(pr.milestone)
            ? {
                id: pr.milestone.id,
                url: pr.milestone.url,
                number: pr.milestone.number,
                state: pr.milestone.state,
                title: pr.milestone.title,
                description: pr.milestone.description,
                open_issues: pr.milestone.open_issues,
                closed_issues: pr.milestone.closed_issues,
                created_at: this.format ? await format_date(pr.milestone.created_at) : pr.milestone.created_at,
                updated_at: this.format ? await format_date(pr.milestone.updated_at) : pr.milestone.updated_at,
                closed_at: pr.milestone.closed_at
                  ? this.format
                    ? await format_date(pr.milestone.closed_at)
                    : pr.milestone.closed_at
                  : null,
                due_on: pr.milestone.due_on
                  ? this.format
                    ? await format_date(pr.milestone.due_on)
                    : pr.milestone.due_on
                  : null
              }
            : null,
          labels: !isEmpty(pr.labels)
            ? pr.labels.map((label: Record<string, any>): IssueLabelType => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: pr.commits,
          additions: pr.additions,
          deletions: pr.deletions,
          changed_files: pr.changed_files
        })
        ))
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取拉取请求列表失败： ${(error as Error).message}`)
    }
  }

  /**
   * 创建一个拉取请求
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - title 标题
   * - body 内容
   * - issue 关联的议题
   * title和body与issue参数传入其中一种，当传入issue参数时，title和body参数将自动填充
   * - head 拉取请求源分支
   * - head_repo 拉取请求源仓库, 如果两个存储库都由同一组织拥有，则跨存储库拉取请求需要此字段
   * - base 拉取请求目标分支
   * - draft 是否为草稿
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const res = await pull_request.create_pull_requestt({ owner: 'owner', repo:'repo', issue: 1, head: 'head', base: 'base' })
   * -> 创建拉取提交信息对象
   */
  public async create_pull_request (
    options: CreatePullRequestParamType
  ): Promise<ApiResponseType<CreatePullRequestResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.head) throw new Error(MissingHeadBranchMsg)
    if (!options.base) throw new Error(MissingBaseBranchMsg)
    if (!('issue' in options) && !('title' in options)) {
      throw new Error(MissingLinkedIssueIdentifierMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const body: Record<string, string | number | boolean> = {}
      if ('issue' in options) {
        if (!options.issue) throw new Error(MissingLinkedIssueMsg)
        body.issue = options.issue
      } else if ('title' in options) {
        if (!options.title) throw new Error(MissingTitleMsg)
        body.title = options.title
        if (options.body) body.body = options.body
      }
      if (options.head) body.head = options.head
      if (options.head_repo) body.head_repo = options.head_repo
      if (options.base) body.base = options.base
      if (options.draft) body.draft = options.draft
      const { owner, repo } = options
      const res = await this.post(`/repos/${owner}/${repo}/pulls`,
        body
      )
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      if (res.data) {
        const [
          createdAt,
          mergeddAt,
          updatedAt,
          closedAt,
          milestoneCreatedAt,
          milestoneUpdatedAt,
          milestoneClosedAt,
          milestoneDueOn
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at,
          res.data.merged_at
            ? this.format
              ? await format_date(res.data.merged_at)
              : res.data.merged_at
            : null,
          res.data.closed_at
            ? this.format
              ? await format_date(res.data.closed_at)
              : res.data.closed_at
            : null,
          this.format ? await format_date(res.data.milestone.created_at) : res.data.milestone.created_at,
          this.format ? await format_date(res.data.milestone.updated_at) : res.data.milestone.updated_at,
          res.data.milestone.closed_at
            ? this.format
              ? await format_date(res.data.milestone.closed_at)
              : res.data.milestone.closed_at
            : null,
          res.data.milestone.due_on
            ? this.format
              ? await format_date(res.data.milestone.due_on)
              : res.data.milestone.due_on
            : null
        ])
        const PrData: CreatePullRequestResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          state: !isEmpty(res.data.merged_at) ? 'merged' : res.data.state,
          locked: res.data.locked,
          title: res.data.title,
          body: res.data.body,
          draft: res.data.draft,
          created_at: createdAt,
          merged_at: mergeddAt,
          updated_at: updatedAt,
          closed_at: closedAt,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: isEmpty(res.data.user.name) ? null : res.data.user.name,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url
          },
          base: {
            label: res.data.base.label,
            ref: res.data.base.ref,
            sha: res.data.base.sha,
            user: {
              id: res.data.base.user.id,
              login: res.data.base.user.login,
              name: isEmpty(res.data.base.user.name) ? null : res.data.base.user.name,
              html_url: res.data.base.user.html_url,
              avatar_url: res.data.base.user.avatar_url
            },
            repo: {
              id: res.data.base.repo.id,
              owner: res.data.base.repo.owner,
              name: res.data.base.repo.name,
              full_name: res.data.base.repo.full_name
            }
          },
          head: {
            label: res.data.head.label,
            ref: res.data.head.ref,
            sha: res.data.head.sha,
            user: {
              id: res.data.head.user.id,
              login: res.data.head.user.login,
              name: isEmpty(res.data.head.user.name) ? null : res.data.head.user.name,
              html_url: res.data.head.user.html_url,
              avatar_url: res.data.head.user.avatar_url
            },
            repo: {
              id: res.data.head.repo.id,
              owner: res.data.head.repo.owner,
              name: res.data.head.repo.name,
              full_name: res.data.head.repo.full_name
            }
          },
          assignee: !isEmpty(res.data.assignee)
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: isEmpty(res.data.assignee.name) ? null : res.data.assignee.name,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url
              }
            : null,
          assignees: !isEmpty(res.data.assignees)
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
              id: assignee.id,
              login: assignee.login,
              name: isEmpty(assignee.name) ? null : assignee.name,
              html_url: assignee.html_url,
              avatar_url: assignee.avatar_url
            }))
            : null,
          milestone: !isEmpty(res.data.milestone)
            ? {
                id: res.data.milestone.id,
                url: res.data.milestone.url,
                number: res.data.milestone.number,
                state: res.data.milestone.state,
                title: res.data.milestone.title,
                description: res.data.milestone.description,
                open_issues: res.data.milestone.open_issues,
                closed_issues: res.data.milestone.closed_issues,
                created_at: milestoneCreatedAt,
                updated_at: milestoneUpdatedAt,
                closed_at: milestoneClosedAt,
                due_on: milestoneDueOn
              }
            : null,
          labels: !isEmpty(res.data.labels)
            ? res.data.labels.map((label: Record<string, any>): IssueLabelType => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: res.data.commits,
          additions: res.data.additions,
          deletions: res.data.deletions,
          changed_files: res.data.changed_files
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 创建拉取请求失败: ${(error as Error).message}`)
    }
  }

  /**
   * 更新一个拉取请求
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - title 标题
   * - body 内容
   * - state 状态
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const res = await pull_request.create_pull_requestt({ owner: 'owner', repo:'repo', pr_number:1, state:'open' })
   * -> 更新拉取提交信息对象
   */
  public async update_pull_request (
    options: UpdatePullRequestParamType
  ): Promise<ApiResponseType<UpdatePullRequestResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const body: Record<string, string> = {}
      if (options.title) body.title = options.title
      if (options.body) body.body = options.body
      if (options.state) body.state = options.state
      const { owner, repo, pr_number } = options
      const res = await this.patch(`/repos/${owner}/${repo}/pulls/${pr_number}`, null, body)
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      if (res.data) {
        const [
          createdAt,
          mergeddAt,
          updatedAt,
          closedAt,
          milestoneCreatedAt,
          milestoneUpdatedAt,
          milestoneClosedAt,
          milestoneDueOn
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at,
          res.data.merged_at
            ? this.format
              ? await format_date(res.data.merged_at)
              : res.data.merged_at
            : null,
          res.data.closed_at
            ? this.format
              ? await format_date(res.data.closed_at)
              : res.data.closed_at
            : null,
          this.format ? await format_date(res.data.milestone.created_at) : res.data.milestone.created_at,
          this.format ? await format_date(res.data.milestone.updated_at) : res.data.milestone.updated_at,
          res.data.milestone.closed_at
            ? this.format
              ? await format_date(res.data.milestone.closed_at)
              : res.data.milestone.closed_at
            : null,
          res.data.milestone.due_on
            ? this.format
              ? await format_date(res.data.milestone.due_on)
              : res.data.milestone.due_on
            : null
        ])
        const PrData: UpdatePullRequestResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          number: res.data.number,
          state: !isEmpty(res.data.merged_at) ? 'merged' : res.data.state,
          locked: res.data.locked,
          title: res.data.title,
          body: res.data.body,
          draft: res.data.draft,
          created_at: createdAt,
          merged_at: mergeddAt,
          updated_at: updatedAt,
          closed_at: closedAt,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: isEmpty(res.data.user.name) ? null : res.data.user.name,
            html_url: res.data.user.html_url,
            avatar_url: res.data.user.avatar_url
          },
          base: {
            label: res.data.base.label,
            ref: res.data.base.ref,
            sha: res.data.base.sha,
            user: {
              id: res.data.base.user.id,
              login: res.data.base.user.login,
              name: isEmpty(res.data.base.user.name) ? null : res.data.base.user.name,
              html_url: res.data.base.user.html_url,
              avatar_url: res.data.base.user.avatar_url
            },
            repo: {
              id: res.data.base.repo.id,
              owner: res.data.base.repo.owner,
              name: res.data.base.repo.name,
              full_name: res.data.base.repo.full_name
            }
          },
          head: {
            label: res.data.head.label,
            ref: res.data.head.ref,
            sha: res.data.head.sha,
            user: {
              id: res.data.head.user.id,
              login: res.data.head.user.login,
              name: isEmpty(res.data.head.user.name) ? null : res.data.head.user.name,
              html_url: res.data.head.user.html_url,
              avatar_url: res.data.head.user.avatar_url
            },
            repo: {
              id: res.data.head.repo.id,
              owner: res.data.head.repo.owner,
              name: res.data.head.repo.name,
              full_name: res.data.head.repo.full_name
            }
          },
          assignee: !isEmpty(res.data.assignee)
            ? {
                id: res.data.assignee.id,
                login: res.data.assignee.login,
                name: isEmpty(res.data.assignee.name) ? null : res.data.assignee.name,
                html_url: res.data.assignee.html_url,
                avatar_url: res.data.assignee.avatar_url
              }
            : null,
          assignees: !isEmpty(res.data.assignees)
            ? res.data.assignees.map((assignee: Record<string, any>): PrUser => ({
              id: assignee.id,
              login: assignee.login,
              name: isEmpty(assignee.name) ? null : assignee.name,
              html_url: assignee.html_url,
              avatar_url: assignee.avatar_url
            }))
            : null,
          milestone: !isEmpty(res.data.milestone)
            ? {
                id: res.data.milestone.id,
                url: res.data.milestone.url,
                number: res.data.milestone.number,
                state: res.data.milestone.state,
                title: res.data.milestone.title,
                description: res.data.milestone.description,
                open_issues: res.data.milestone.open_issues,
                closed_issues: res.data.milestone.closed_issues,
                created_at: milestoneCreatedAt,
                updated_at: milestoneUpdatedAt,
                closed_at: milestoneClosedAt,
                due_on: milestoneDueOn
              }
            : null,
          labels: !isEmpty(res.data.labels)
            ? res.data.labels.map((label: Record<string, any>): IssueLabelType => ({
              id: label.id,
              name: label.name,
              color: label.color
            }))
            : null,
          commits: res.data.commits,
          additions: res.data.additions,
          deletions: res.data.deletions,
          changed_files: res.data.changed_files
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 更新拉取请求失败: ${(error as Error).message}`)
    }
  }

  /**
   * 合并拉取请求
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number 拉取请求编号
   * - commit_title 合并提交标题
   * - commit_message 合并提交信息
   * - sha 拉取请求头部必须匹配的 SHA 才能允许合并
   * - merge_method 拉取请求合并方式, 默认为 merge
   * @returns 包含pull_request信息的响应对象
   * @example
   * ```ts
   * const res = await pull_request.merge_pull_request({ owner: 'owner', repo:'repo', pr_number:1 })
   * -> 合并拉取提交信息对象
   * ```
   */

  public async merge_pull_request (
    options: MergePullRequestParamType
  ): Promise<ApiResponseType<MergePullRequestResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const body: Record<string, string> = {}
      if (options.commit_title) body.commit_title = options.commit_title
      if (options.commit_message) body.commit_message = options.commit_message
      if (options.sha) body.sha = options.sha
      if (options.merge_method) {
        const validMethods = ['merge', 'squash', 'rebase'] as const
        body.merge_method = validMethods.includes(options.merge_method)
          ? options.merge_method
          : validMethods[0]
      }
      const { owner, repo, pr_number } = options
      const res = await this.put(`/repos/${owner}/${repo}/pulls/${pr_number}/merge`, body)
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestOrRepoNotFoundMsg)
        case 405:
          throw new Error(PullRequestMergeMethodNotSupportedMsg)
        case 409:
          throw new Error(ConflictPullRequestShaValueMsg)
      }
      if (res.statusCode === 200 && res.data) {
        const PrData: MergePullRequestResponseType = {
          sha: res.data.sha,
          merged: res.data.merged,
          message: res.data.message
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 合并拉取请求失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取拉取请求文件列表
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number 拉取请求编号
   * - per_page 每页结果数量
   * - page 页码
   * @returns 包含拉取请求文件列表的响应对象
   * @example
   * ```ts
   * const res = await pull_request.get_pull_request_files_list({ owner: 'owner', repo:'repo', pr_number:1 })
   * -> 拉取提交文件信息对象列表
   * ```
   */
  public async get_pull_request_files_list (
    options: GetPullRequestFilesListParamType
  ): Promise<ApiResponseType<GetPullRequestFilesListResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const params: Record<string, string> = {}
      if (options.per_page) params.per_page = options.per_page
      if (options.page) params.page = options.page
      const { owner, repo, pr_number } = options
      const res = await this.get(`/repos/${owner}/${repo}/pulls/${pr_number}/files`,
        params
      )
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestOrRepoNotFoundMsg)
      }
      if (res.data) {
        const PrData: GetPullRequestFilesListResponseType = res.data.map((file: Record<string, any>): PullRequestFilesListType => ({
          sha: file.sha,
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          blob_url: file.blob_url,
          raw_url: file.raw_url,
          patch: file.patch
        }))
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取拉取请求文件列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取拉取请求评论信息
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * @returns 包含拉取请求指定的评论id的信息
   * @example
   * ```ts
   * const res = await pull_request.get_pull_request_comment_info({ owner: 'owner', repo:'repo', comment_id:1 })
   * -> 拉取提交评论信息对象
   * ```
   */
  public async get_pull_request_comment_info (
    options: GetPullRequestCommentInfoParamType
  ): Promise<ApiResponseType<GetPullRequestCommentInfoResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.comment_id) throw new Error(MissingPullRequestCommentNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id } = options
      const res = await this.get(`/repos/${owner}/${repo}/pulls/comments/${comment_id}`)
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestCommentOrRepoNotFoundMsg)
      }
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const PrData: GetPullRequestCommentInfoResponseType = {
          id: res.data.id,
          body: res.data.body,
          user: {
            id: res.data.user.id,
            login: res.data.user.login,
            name: isEmpty(res.data.user.name) ? null : res.data.user.name,
            avatar_url: res.data.user.avatar_url,
            html_url: res.data.user.html_url
          },
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取拉取请求评论评论信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取拉取请求评论列表
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number 拉取请求编号
   * - direction 排序方向
   * - per_page 每页结果数量
   * - page 页码
   * @returns 包含拉取请求评论列表响应信息列表
   * @example
   * ```ts
   * const res = await pull_request.get_pull_request_comments_list({ owner: 'owner', repo:'repo', pr_number:1 })
   * -> 拉取提交评论信息对象
   * ```
   */
  public async get_pull_request_comments_list (
    options: GetPullRequestCommentsListParamType
  ): Promise<ApiResponseType<GetPullRequestCommentsListResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const params: Record<string, string> = {}
      if (options.direction) params.direction = options.direction
      if (options.per_page) params.per_page = options.per_page
      if (options.page) params.page = options.page
      const { owner, repo, pr_number } = options
      const res = await this.get(`/repos/${owner}/${repo}/pulls/${pr_number}/comments`, params)
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestCommentOrRepoNotFoundMsg)
      }
      if (res.data) {
        const PrData: GetPullRequestCommentsListResponseType = await Promise.all(res.data.map(async (comment: Record<string, any>): Promise<GetPullRequestCommentInfoResponseType> => {
          return {
            id: comment.id,
            body: comment.body,
            user: {
              id: comment.user.id,
              login: comment.user.login,
              name: isEmpty(comment.user.name) ? null : comment.user.name,
              html_url: comment.user.html_url,
              avatar_url: comment.user.avatar_url
            },
            created_at: this.format ? await format_date(comment.created_at) : comment.created_at,
            updated_at: this.format ? await format_date(comment.updated_at) : comment.updated_at
          }
        }))
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取拉取请求评论列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建拉取请求评论
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - pr_number 拉取请求编号
   * - body 评论内容
   * @returns 包含创建拉取请求评论响应信息
   * @example
   * ```ts
   * const res = await pull_request.create_pull_request_comment({ owner: 'owner', repo:'repo', pr_number:1， body: 'loli' })
   * -> 创建拉取提交评论信息对象
   * ```
   */
  public async create_pull_request_comment (
    options: CreatePullRequestCommentParamType
  ): Promise<ApiResponseType<CreatePullRequestCommentResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.pr_number) throw new Error(MissingPullRequestNumberMsg)
    if (!options.body) throw new Error(MissingPullRequestCommentBodyMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, pr_number, body } = options
      const res = await this.post(`/repos/${owner}/${repo}/pulls/${pr_number}/comments`, { body })
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestOrRepoNotFoundMsg)
      }
      if (res.data) {
        const PrData: CreatePullRequestCommentResponseType = {
          id: res.data.id,
          body: res.data.body
        }
        res.data = PrData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 创建拉取请求评论失败: ${(error as Error).message}`)
    }
  }

  /**
   * 更新拉取请求评论
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * - body 评论内容
   * @returns 包含更新拉取请求评论响应信息
   * @example
   * ```ts
   * const res = await pull_request.update_pull_request_comment({ owner: 'owner', repo:'repo', comment_id:1， body: 'loli' })
   * -> 更新拉取提交评论信息对象
   * ```
   */
  public async update_pull_request_comment (
    options: UpdatePullRequestCommentParamType
  ): Promise<ApiResponseType<UpdatePullRequestCommentResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.comment_id) throw new Error(MissingPullRequestCommentNumberMsg)
    if (!options.body) throw new Error(MissingPullRequestCommentBodyMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, comment_id, body } = options
      const res = await this.patch(`/repos/${owner}/${repo}/issues/comments/${comment_id}`, null, { body })
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestCommentOrRepoNotFoundMsg)
      }
      let commentData: UpdatePullRequestCommentResponseType
      if (res.statusCode === 200) {
        commentData = {
          success: true,
          message: PullRequestCommentUpdateSuccessMsg
        }
      } else {
        commentData = {
          success: false,
          message: PullRequestCommentUpdateFailedMsg
        }
      }
      res.data = commentData
      return res
    } catch (error) {
      throw new Error(`[GitHub] 更新拉取请求评论失败: ${(error as Error).message}`)
    }
  }

  /**
   * 编辑拉取请求评论
   * @deprecated  请使用update_issue_comment方法
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options - 删除拉取请求评论参数对象
   * @returns 删除结果
   * ```
   */
  public async edit_pull_request_comment (
    options: UpdatePullRequestCommentParamType
  ):Promise<ApiResponseType<UpdatePullRequestCommentResponseType>> {
    return await this.update_pull_request_comment(options)
  }

  /**
   * 删除拉取请求评论
   * 权限:
   * - Pull requests: Read-And-Write
   * @param options 请求参数列表
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - comment_id 评论ID
   * @returns 包含更新拉取请求评论响应信息
   * @example
   * ```ts
   * const res = await pull_request.delete_pull_request_comment({ owner: 'owner', repo:'repo', comment_id: 1 })
   * -> 更新拉取提交评论信息对象
   * ```
   */
  public async delete_pull_request_comment (
    options: DeletePullRequestCommentParamType
  ):Promise<ApiResponseType<DeletePullRequestCommentResponseType>> {
    if (!(options.owner || options.repo)) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.comment_id) throw new Error(MissingPullRequestCommentNumberMsg)
    try {
      const res = await this.delete(`/repos/${options.owner}/${options.repo}/pulls/comments/${options.comment_id}`)
      switch (res.statusCode) {
        case 403:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(PullRequestCommentOrRepoNotFoundMsg)
      }
      let commentData: DeletePullRequestCommentResponseType
      if (res.statusCode === 204) {
        commentData = {
          success: true,
          message: PullRequestCommentRemoveSuccessMsg
        }
      } else {
        commentData = {
          success: false,
          message: PullRequestCommentRemoveFailedMsg
        }
        res.data = commentData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 删除拉取请求评论失败: ${(error as Error).message}`)
    }
  }
}
