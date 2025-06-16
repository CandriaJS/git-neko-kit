import {
  format_date,
  MissingRepoOwnerOrNameMsg,
  MissingWorkflowIdMsg,
  WorkflowOrRepoNotFoundMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  ApiResponseType,
  GetRepoWorkflowsList,
  GetRepoWorkflowsListResponseType,
  WorkflowInfoParamType,
  WorkflowInfoResponseType
} from '@/types'

/**
 * GitHub 工作流管理类
 *
 * 提供对GitHub Workflow的完整管理功能，包括：
 * - 仓库工作流信息
 *
 */
export class Workflow extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.base_url = get_base_url(this.type, { proxyType: 'original' })
  }

  /**
   * 获取仓库工作流信息
   * 权限：
   * - 'actions': 'read-only'
   * @param options 获取工作流信息参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - workflow_id 工作流id
   * @returns 包含工作流信息的响应对象
   * @example
   * ```ts
   * const res = await workflow.get_workflow_info()
   * -> 工作流信息对象
   * ```
   */
  public async get_workflow_info (
    options: WorkflowInfoParamType
  ): Promise<ApiResponseType<WorkflowInfoResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.workflow_id) throw new Error(MissingWorkflowIdMsg)
    try {
      const { owner, repo, workflow_id } = options
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}`)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.data) {
        const WorkflowData: WorkflowInfoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          name: res.data.name,
          path: res.data.path,
          state: res.data.state,
          created_at: this.format ? await format_date(res.data.created_at) : res.data.created_at,
          updated_at: this.format ? await format_date(res.data.updated_at) : res.data.updated_at
        }
        res.data = WorkflowData
      }
      return res
    } catch (error) {
      throw new Error(`获取工作流信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库工作流列表
   * 权限：
   * - 'actions': 'read-only'
   * @param options 获取工作流列表参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - per_page 每页数量
   * - page 页码
   * @returns 包含工作流列表的响应对象
   * @example
   * ```ts
   * const res = await workflow.get_repo_workflows_list()
   * -> 工作流列表对象
   * ```
   */

  public async get_repo_workflows_list (
    options: GetRepoWorkflowsList
  ): Promise<ApiResponseType<GetRepoWorkflowsListResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo } = options
      const params: Record<string, number> = {}
      if (options.per_page) params.per_page = options.per_page
      if (options.page) params.page = options.page
      const res = await this.get(`/repos/${owner}/${repo}/actions/workflows`, params)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.data) {
        const WorkflowList: GetRepoWorkflowsListResponseType = {
          total: res.data.total_count,
          workflows: await Promise.all(
            res.data.workflows.map(async (workflow: Record<string, any>): Promise<WorkflowInfoResponseType> => ({
              id: workflow.id,
              html_url: workflow.html_url,
              name: workflow.name,
              path: workflow.path,
              state: workflow.state,
              created_at: this.format ? await format_date(workflow.created_at) : workflow.created_at,
              updated_at: this.format ? await format_date(workflow.updated_at) : workflow.updated_at
            }))
          )
        }
        res.data = WorkflowList
      }
      return res
    } catch (error) {
      throw new Error(`获取工作流列表失败: ${(error as Error).message}`)
    }
  }
}
