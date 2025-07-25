import type { RepoBaseParamType, workflowIdParamType } from '@/types/platform/base'

/** 工作流状态 */
export const enum WorkflowState {
  /** 工作流已激活 */
  Active = 'active',
  /** 工作流已删除 */
  Deleted = 'deleted',
  /** for仓库未启用工作流 */
  DisabledFork = 'disabled_fork',
  /** 工作流已禁用（因为超过30天未使用） */
  DisabledInactivity = 'disabled_inactivity',
  /** 工作流已禁用（手动） */
  DisabledManually = 'disabled_manually'
}

/** 工作流信息参数类型 */
export type WorkflowInfoParamType = RepoBaseParamType & workflowIdParamType
/** 工作流信息响应类型 */
export interface WorkflowInfoResponseType {
  /** 工作流id */
  id: number;
  /** 工作流所属仓库的URL */
  html_url: string
  /** 工作流名称 */
  name: string;
  /** 工作流文件路径 */
  path: string
  /** 工作流状态 */
  state: WorkflowState;
  /** 工作流创建时间 */
  created_at: string;
  /** 工作流更新时间 */
  updated_at: string;
}

/** 获取仓库工作流列表参数类型 */
export interface GetRepoWorkflowsList extends RepoBaseParamType {
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}
/** 获取仓库工作流列表响应类型 */
export interface GetRepoWorkflowsListResponseType {
  /** 总数 */
  total: number
  /** 工作流列表 */
  workflows: WorkflowInfoResponseType[]
}

/** 运行仓库工作流参数类型 */
export interface RunRepoWorkflow extends WorkflowInfoParamType {
  /** 分支或者标签名称 */
  ref: string
  /** 工作流输入参数, 该参数最多10个 */
  inputs?: Record<string, string | number>
}
/** 运行仓库工作流响应类型 */
export interface RunRepoWorkflowResponseType {
  /** 是否成功 */
  success: boolean
  /** 运行状态信息 */
  message: string
}

/** 启用仓库工作流参数类型 */
export type EnableRepoWorkflowParamType = WorkflowInfoParamType
/** 启用仓库工作流响应类型 */
export interface EnableRepoWorkflowResponseType {
  /** 是否成功 */
  success: boolean
  /** 启用状态信息 */
  message: string
}

/** 禁用仓库工作流参数类型 */
export type DisEnableRepoWorkflowParamType = WorkflowInfoParamType
/** 禁用仓库工作流响应类型 */
export interface DisEnableRepoWorkflowResponseType {
  /** 是否成功 */
  success: boolean
  /** 禁用状态信息 */
  message: string
}

/** 重新运行仓库工作流参数类型 */
export interface ReRunRepoWorkflowParamType extends Omit<WorkflowInfoParamType, 'workflow_id'> {
  /** 工作流作业id */
  job_id: number
}
/** 重新运行仓库工作流响应类型 */
export interface ReRunRepoWorkflowResponseType {
  /** 是否成功重新运行仓库工作流 */
  success: boolean
  /** 重新运行状态信息 */
  message: string
}
