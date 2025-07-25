import {
  DisableRepoWorkflowSuccessMsg,
  EnableRepoWorkflowSuccessMsg,
  FailedToDisableRepoWorkflowFailedMsg,
  FailedToEnableRepoWorkflowFailedMsg,
  FailedToRepoWorkflowDispatchMsg,
  FailedToReRunRepoWorkflowFailedMsg,
  MissingJobIdMsg,
  MissingRefMsg,
  MissingRepoOwnerOrNameMsg,
  MissingWorkflowIdMsg,
  PermissionDeniedMsg,
  ReRunRepoWorkflowSuccessMsg,
  RunRepoWorkflowSuccessMsg,
  WorkflowOrRepoNotFoundMsg
} from '@/common'
import { format_date } from '@candriajs/git-neko-kit-utils'
import { GitHubClient } from '@/models/platform/github/client'
import {
  type ApiResponseType,
  type DisEnableRepoWorkflowParamType,
  type DisEnableRepoWorkflowResponseType,
  type EnableRepoWorkflowParamType,
  type EnableRepoWorkflowResponseType,
  type GetRepoWorkflowsList,
  type GetRepoWorkflowsListResponseType,
  type ReRunRepoWorkflowParamType,
  type ReRunRepoWorkflowResponseType,
  type RunRepoWorkflow,
  type RunRepoWorkflowResponseType,
  type WorkflowInfoParamType,
  type WorkflowInfoResponseType
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
    this.base_url = base.base_url
    this.api_url = base.api_url
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

  /**
   * 运行仓库工作流
   * 权限：
   * - 'actions': 'read-and-write'
   * @param options 运行工作流参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - workflow_id 工作流id
   * - ref 分支或者标签名称
   * - inputs 工作流输入参数
   * @returns 运行工作流结果对象
   * @example
   * ```ts
   * const res = await workflow.run_repo_workflow()
   * -> 运行工作流结果对象
   * ```
   */

  public async run_repo_workflow (options: RunRepoWorkflow): Promise<ApiResponseType<RunRepoWorkflowResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.workflow_id) throw new Error(MissingWorkflowIdMsg)
    if (!options.ref) throw new Error(MissingRefMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, workflow_id } = options
      const body: Record<string, string | number | Record<string, string | number>> = {
        ref: options.ref
      }
      if (options.inputs) body.inputs = options.inputs
      const res = await this.post(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, body)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      let workflowData: RunRepoWorkflowResponseType
      if (res.statusCode === 204) {
        workflowData = {
          success: true,
          message: RunRepoWorkflowSuccessMsg(workflow_id)
        }
      } else {
        workflowData = {
          success: false,
          message: FailedToRepoWorkflowDispatchMsg(workflow_id)
        }
      }
      res.data = workflowData
      return res
    } catch (error) {
      throw new Error(`运行工作流失败: ${(error as Error).message}`)
    }
  }

  /**
   * 启用仓库工作流
   * 权限：
   * - 'actions': 'read-and-write'
   * @param options 启用工作流参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - workflow_id 工作流id
   * @returns 启用工作流结果对象
   * @example
   * ```ts
   * const res = await workflow.enable_repo_workflow()
   * -> 启用工作流结果对象
   * ```
   */

  public async enable_repo_workflow (
    options: EnableRepoWorkflowParamType
  ): Promise<ApiResponseType<EnableRepoWorkflowResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.workflow_id) throw new Error(MissingWorkflowIdMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, workflow_id } = options
      const res = await this.put(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/enable`, null)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      let workflowData: EnableRepoWorkflowResponseType
      if (res.statusCode === 204) {
        workflowData = {
          success: true,
          message: EnableRepoWorkflowSuccessMsg(workflow_id)
        }
      } else {
        workflowData = {
          success: false,
          message: FailedToEnableRepoWorkflowFailedMsg(workflow_id)
        }
      }
      res.data = workflowData
      return res
    } catch (error) {
      throw new Error(`启用工作流失败: ${(error as Error).message}`)
    }
  }

  /**
   * 禁用仓库工作流
   * 权限：
   * - 'actions': 'read-and-write'
   * @param options 禁用工作流参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - workflow_id 工作流id
   * @returns 禁用工作流结果对象
   * @example
   * ```ts
   * const res = await workflow.disable_repo_workflow()
   * -> 禁用工作流结果对象
   * ```
   */

  public async disable_repo_workflow (
    options: DisEnableRepoWorkflowParamType
  ): Promise<ApiResponseType<DisEnableRepoWorkflowResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.workflow_id) throw new Error(MissingWorkflowIdMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, workflow_id } = options
      const res = await this.put(`/repos/${owner}/${repo}/actions/workflows/${workflow_id}/disable`, null)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      let workflowData: DisEnableRepoWorkflowResponseType
      if (res.statusCode === 204) {
        workflowData = {
          success: true,
          message: DisableRepoWorkflowSuccessMsg(workflow_id)
        }
      } else {
        workflowData = {
          success: false,
          message: FailedToDisableRepoWorkflowFailedMsg(workflow_id)
        }
      }
      res.data = workflowData
      return res
    } catch (error) {
      throw new Error(`禁用工作流失败: ${(error as Error).message}`)
    }
  }

  /**
   * 重新运行仓库工作流
   * 权限：
   * - 'actions': 'read-and-write'
   * @param options 重新运行工作流参数
   * - owner 仓库拥有者
   * - repo 仓库名称
   * - job_id 工作流作业id
   * @returns 重新运行工作流结果对象
   * @example
   * ```ts
   * const res = await workflow.rerun_repo_workflow()
   * -> 重新运行工作流结果对象
   * ```
   */

  public async rerun_repo_workflow (
    options: ReRunRepoWorkflowParamType
  ): Promise<ApiResponseType<ReRunRepoWorkflowResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    if (!options.job_id) throw new Error(MissingJobIdMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, job_id } = options
      const res = await this.post(`/repos/${owner}/${repo}/actions/jobs/${job_id}/rerun`, null)
      if (res.statusCode === 404) throw new Error(WorkflowOrRepoNotFoundMsg)
      if (res.statusCode === 403) throw new Error(PermissionDeniedMsg)
      let workflowData: ReRunRepoWorkflowResponseType
      if (res.statusCode === 204) {
        workflowData = {
          success: true,
          message: ReRunRepoWorkflowSuccessMsg(job_id)
        }
      } else {
        workflowData = {
          success: false,
          message: FailedToReRunRepoWorkflowFailedMsg(job_id)
        }
      }
      res.data = workflowData
      return res
    } catch (error) {
      throw new Error(`重新运行工作流失败: ${(error as Error).message}`)
    }
  }
}
