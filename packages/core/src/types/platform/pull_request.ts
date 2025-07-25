import type { CommentIdParamType, PullRequestNumberParamType, RepoBaseParamType } from '@/types/platform/base'
import type { IssueLabelType, MilestoneType } from '@/types/platform/issue'
import type { RepoInfoResponseType } from '@/types/platform/repo'
import type { UserInfoResponseType } from '@/types/platform/user'

export type PrUser = Pick<UserInfoResponseType, 'id' | 'login' | 'name' | 'avatar_url' | 'html_url'>
export type PrRepo = Pick<RepoInfoResponseType, 'id' | 'owner' | 'name' | 'full_name'>

/** 拉取请求信息参数类型 */
export type PullRequestInfoParamType = PullRequestNumberParamType & RepoBaseParamType
/** 拉取请求信息响应类型 */
export interface PullRequestInfoResponseType {
  /** 拉取请求的id */
  id: number
  /** 拉取请求的URL */
  html_url: string
  /** 拉取请求的编号 */
  number: number
  /** 拉取请求的状态 (open/closed) */
  state: 'open' | 'closed' | 'merged'
  /** 是否被锁定 */
  locked: boolean
  /** 拉取请求的标题 */
  title: string
  /** 拉取请求的描述 */
  body: string | null
  /** 是否为草稿PR */
  draft: boolean
  /** 创建时间 */
  created_at: string
  /** 更新时间 */
  updated_at: string | null
  /** 关闭时间 */
  closed_at: string | null
  /** 合并时间 */
  merged_at: string | null
  /** PR作者 */
  user: PrUser
  /** PR的目标分支 */
  base: {
    /** 分支标签 */
    label: string
    /** 分支名称 */
    ref: string
    /** 当前分支最新提交的 SHA 值 */
    sha: string
    /** 分支的用户信息 */
    user: PrUser
    /** 分支的仓库信息 */
    repo: PrRepo
  }
  /** PR的源分支信息 */
  head: {
    /** 分支标签 */
    label: string
    /** 分支名称 */
    ref: string
    /** 当前分支最新提交的 SHA 值 */
    sha: string
    /** 分支的用户信息 */
    user: PrUser
    /** 分支的仓库信息 */
    repo: PrRepo
  }
  /** 指派人 */
  assignee: PrUser | null
  /** 指派人列表 */
  assignees: Array<PrUser> | null
  /** 里程碑 */
  milestone: MilestoneType | null
  /** 标签列表 */
  labels: Array<IssueLabelType>
  /** 提交数量 */
  commits: number
  /** 新增行数 */
  additions: number
  /** 删除行数 */
  deletions: number
  /** 更改的文件数 */
  changed_files: number
}

/** 拉取请求列表参数类型 */
export interface PullRequestListParamType extends RepoBaseParamType {
  /**
   * 拉取请求状态
   * @default "open"
   * - open: 打开的拉取请求
   * - closed: 已关闭的拉取请求
   * - all: 所有拉取请求
   */
  state?: 'open' | 'closed' | 'all'
  /**
   * 基础分支名称
   * 用于筛选指定目标分支的拉取请求
   * @example "main"
   */
  base?: string
  /**
   * 排序依据
   * @default "created"
   * - created: 按创建时间排序
   * - updated: 按更新时间排序
   */
  sort?: 'created' | 'updated'
  /**
   * 排序方向
   * @default "desc"
   * - asc: 升序
   * - desc: 降序
   */
  direction?: 'asc' | 'desc'
  /**
   * 每页结果数量
   * @default "30"
   * @remarks 取值范围：1-100
   */
  per_page?: string
  /**
   * 页码
   * @default "1"
   * @remarks 必须大于等于1
   */
  page?: string
}
/** 拉取请求列表响应类型 */
export type PullRequestListResponseType = Array<PullRequestInfoResponseType>

/** 使用issue填充拉取提交标题与内容 */
type WithIssue = {
  /** 拉取请求标题 */
  title?: never;
  /** 拉取请求描述 */
  body?: never;
  /**
   * 关联的议题
   * Pull Request的标题和内容可以根据指定的Issue Id自动填充
   */
  issue: string | number;
}
/** 不使用issue填充拉取提交标题与内容 */
type WithoutIssue = {
  /** 拉取请求标题 */
  title: string
  /** 拉取请求描述 */
  body?: string
  /**
   * 关联的议题
   * Pull Request的标题和内容可以根据指定的Issue Id自动填充
   */
  issue?: never;
}

/** 创建拉取提交参数类型 */
export type CreatePullRequestParamType = RepoBaseParamType & (WithIssue | WithoutIssue) & {
  /** 拉取请求源分支 */
  head: string
  /**
   * 拉取请求源仓库
   * 。如果两个存储库都由同一组织拥有，则跨存储库拉取请求需要此字段
   * */
  head_repo?: string
  /** 拉取请求目标分支 */
  base: string
  /** 是否为草稿 */
  draft?: boolean
}
/** 创建拉取请求响应类型 */
export type CreatePullRequestResponseType = PullRequestInfoResponseType

/** 更新拉取请求参数类型 */
export interface UpdatePullRequestParamType extends RepoBaseParamType, PullRequestNumberParamType {
  /** 拉取请求标题 */
  title?: string
  /** 拉取请求内容 */
  body?: string
  /** 拉取请求状态 */
  state?: 'open' | 'closed'
}
/** 更新拉取请求响应类型 */
export type UpdatePullRequestResponseType = PullRequestInfoResponseType

/**
 * 合并拉取请求方式类型
 * merge: 合并提交
 * squash: 压缩提交
 * rebase: 变基提交
*/
export type MergeMethodType = 'merge' | 'squash' | 'rebase'

/** 合并拉取请求参数类型 */
export interface MergePullRequestParamType extends RepoBaseParamType, PullRequestNumberParamType {
  /** 拉取请求合并提交信息 */
  commit_title?: string
  /** 拉取请求合并提交信息 */
  commit_message?: string
  /**
   * 拉取请求合并SHA值
   * 拉取请求头部必须匹配的 SHA 才能允许合并
   * */
  sha?: string
  /**
   * 拉取请求合并方式
   * @default merge
   * merge: 合并提交
   * squash: 压缩提交
   * rebase: 变基提交
   * */
  merge_method?: MergeMethodType
}
/**
 * 合并拉取请求响应类型
 * 对应 GitHub API 返回的 Pull Request Merge Result 结构
 */
export interface MergePullRequestResponseType {
  /**
   * 合并后的提交 SHA 值
   * 表示合并操作生成的提交哈希
   */
  sha: string
  /**
   * 是否成功合并
   * - true: 成功合并
   * - false: 合并失败或冲突
   */
  merged: boolean
  /**
   * 合并结果描述信息
   * 包含成功或失败的具体原因
   */
  message: string
}

/** 文件列表类型 */
export interface PullRequestFilesListType {
  /** 文件的SHA值 */
  sha: string
  /** 文件路径 */
  filename: string
  /** 文件状态 */
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'changed' | 'unchanged'
  /** 文件添加行数 */
  additions: number
  /** 文件删除行数 */
  deletions: number
  /** 文件修改行数 */
  changes: number
  /** 文件的blob SHA值 */
  blob_url: string
  /** 文件的raw URL */
  raw_url: string
  /** 文件的patch内容, 也就是diff差异内容 */
  patch: string
}

/** 获取拉取请求文件列表参数类型 */
export interface GetPullRequestFilesListParamType extends RepoBaseParamType, PullRequestNumberParamType {
  /** 每页结果数量 */
  per_page?: string
  /** 页码 */
  page?: string
}
/** 获取拉取请求文件列表响应类型 */
export type GetPullRequestFilesListResponseType = Array<PullRequestFilesListType>

/** 获取拉取请求差异内容参数类型 */
export type GetPullRequestDiffParamType = RepoBaseParamType & PullRequestNumberParamType
/** 获取拉取请求差异内容响应类型 */
export type GetPullRequestDiffResponseType = string

/** 获取拉取请求评论信息参数类型 */
export type GetPullRequestCommentInfoParamType = RepoBaseParamType & CommentIdParamType

/** 获取拉取请求评论信息响应类型 */
export interface GetPullRequestCommentInfoResponseType {
  /** 评论ID */
  id: CommentIdParamType['comment_id']
  /** 评论内容 */
  body: string
  /** 评论用户 */
  user: PrUser
  /** 评论创建时间 */
  created_at: string
  /** 评论更新时间 */
  updated_at: string
}

/** 获取拉取请求评论列表参数类型 */
export interface GetPullRequestCommentsListParamType extends RepoBaseParamType, PullRequestNumberParamType {
  direction: 'asc' | 'desc'
  /** 每页结果数量 */
  per_page?: string
  /** 页码 */
  page?: string
}
/** 获取拉取请求评论列表响应类型 */
export type GetPullRequestCommentsListResponseType = Array<GetPullRequestCommentInfoResponseType>

/** 创建拉取请求评论参数类型 */
export interface CreatePullRequestCommentParamType extends RepoBaseParamType, PullRequestNumberParamType {
  /** 评论内容 */
  body: string
}

/** 创建拉取请求评论响应类型 */
export interface CreatePullRequestCommentResponseType {
  /** 评论id */
  id: CommentIdParamType['comment_id']
  /** 评论内容 */
  body: string
}

/** 更新拉取请求评论参数类型 */
export interface UpdatePullRequestCommentParamType extends RepoBaseParamType, CommentIdParamType {
  /** 评论内容 */
  body: string
}

/** 更新拉取请求评论响应类型 */
export interface UpdatePullRequestCommentResponseType {
  /** 是否更新评论信息成功 */
  success: boolean
  /** 更新评论状态信息 */
  message: string
}

/** 删除拉取请求评论参数类型 */
export type DeletePullRequestCommentParamType = RepoBaseParamType & CommentIdParamType

/** 删除拉取请求评论响应类型 */
export interface DeletePullRequestCommentResponseType {
  /** 是否删除成功 */
  success: boolean
  /** 删除状态信息 */
  message: string
}
