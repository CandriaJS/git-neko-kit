import type { CommentIdParamType, IssueNumberParamType, RepoBaseParamType } from '@/types/platform/base'
import type { UserInfoResponseType } from '@/types/platform/user'

/** 议题用户信息响应类型 */
export type IssueUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos' | 'type'>

/** 议题标签类型 */
export interface IssueLabelType {
  /** 标签ID */
  id: number;
  /** 标签名称 */
  name: string;
  /** 标签颜色代码 */
  color?: string | null;
}

/** 议题里程碑类型 */
export interface MilestoneType {
  /** 里程碑ID */
  id: number;
  /** 里程碑URL */
  url: string;
  /** 里程碑编号 */
  number: number;
  /** 里程碑状态: open/closed */
  state: 'open' | 'closed';
  /** 里程碑标题 */
  title: string;
  /** 里程碑描述 */
  description: string | null;
  /** 开放议题数 */
  open_issues: number;
  /** 关闭议题数 */
  closed_issues: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 关闭时间 */
  closed_at: string | null;
  /** 截止时间 */
  due_on: string | null;
}

/** 议题信息参数类型 */
export type IssueInfoParamType = RepoBaseParamType & IssueNumberParamType
/** 议题详情响应类型 */
export interface IssueInfoResponseType {
  /** 问题id */
  id: IssueNumberParamType['issue_number']
  /** 议题HTML页面URL */
  html_url: string;
  /** 议题编号 */
  number: number;
  /** 议题状态: open/closed */
  state: string;
  /** 议题标题 */
  title: string;
  /** 议题正文内容 */
  body: string | null;
  /** 议题创建者用户信息 */
  user: IssueUser;
  /** 议题标签 */
  labels: Array<IssueLabelType> | null;
  /**
   * 议题指派人
   * 当没有指派人时，返回 null
   */
  assignee: IssueUser | null;
  /**
   * 议题所有指派人列表
   * 先不处理，后面再说
   * */
  assignees: Array<IssueUser> | null;
  /** 议题所属里程碑 */
  milestone: MilestoneType | null;
  /** 关闭时间 */
  closed_at: string | null;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 议题列表参数类型 */
export interface RepoIssueListParamType extends RepoBaseParamType {
  /**
   * 里程碑筛选
   * @default *
   * - 传入数字时：按里程碑编号筛选
   * - 传入 "*"：接受任何里程碑的议题
   * - 传入 "none"：返回没有里程碑的议题
   */
  milestone?: string | number;

  /**
   * 议题状态
   * @default "open"
   * - open: 打开的议题
   * - closed: 关闭的议题
   * - all: 所有议题
   */
  state?: 'all' | 'open' | 'closed';

  /**
   * 指派人用户名
   * - 传入用户名：返回指派给该用户的议题
   * - 传入 "none"：返回所有的议题
   * - 传入用户名：返回指派给该用户的议题
   * - 传入 "*"：返回已指派给任何用户的议题
   */
  assignee?: string;

  /**
   * 议题类型
   * - 传入类型名：返回指定类型的议题
   * - 传入 "*"：接受任何类型的议题
   * - 传入 "none"：返回没有类型的议题
   */
  type?: string;

  /** 创建者用户名，筛选由特定用户创建的议题 */
  creator?: string;

  /**
   * 标签列表
   * 以逗号分隔的标签名称列表
   * @example "bug,ui,@high"
   */
  labels?: string;

  /**
   * 排序方式
   * @default "created"
   * - created: 按创建时间排序
   * - updated: 按更新时间排序
   * - comments: 按评论数排序
   */
  sort?: 'created' | 'updated' | 'comments';

  /**
   * 排序方向
   * @default "desc"
   * - asc: 升序
   * - desc: 降序
   */
  direction?: 'asc' | 'desc';

  /**
   * 筛选此时间之后更新的议题
   * 仅显示在指定时间之后更新的结果
   * 格式为 ISO 8601: YYYY-MM-DDTHH:MM:SSZ
   * @example "2023-01-01T00:00:00Z"
   */
  since?: string;

  /**
   * 每页结果数量
   * @default 30
   * @remarks 取值范围：1-100
   */
  per_page?: number;

  /**
   * 页码
   * @default 1
   */
  page?: number;
}

/** 议题列表响应类型 */
export type IssueListResponseType = IssueInfoResponseType[]

/** 创建议题参数类型 */
export type CreteIssueParamType = RepoBaseParamType & {
  /** 标题 */
  title: string
  /** 正文内容 */
  body?: string | null
  /** 里程碑 */
  milestone?: number | string | null
  /** 标签列表 */
  labels?: Array<string> | string | null
  /** 指派的用户名 */
  assignees?: Array<string> | string | null
}
/** 创建议题响应类型 */
export type CreateIssueResponseType = IssueInfoResponseType

/** 更新议题参数类型 */
export interface UpdateIssueParamType extends Omit<CreteIssueParamType, 'title' | 'type'>, IssueNumberParamType {
  /** 问题的名称 */
  title?: string | null
  /** 问题的内容 */
  body?: string | null
  /** 问题的状态：open/closed */
  state?: 'open' | 'closed'
}

/** 更新议题响应类型 */
export type UpdateIssueResponseType = IssueInfoResponseType

/** 打开议题参数类型 */
export type OpenIssueParamType = RepoBaseParamType & IssueNumberParamType
/** 打开议题响应类型 */
export type OpenIssueResponseType = IssueInfoResponseType

/** 关闭议题参数类型 */
export type CloseIssueParamType = OpenIssueParamType
/** 关闭议题响应类型 */
export type CloseIssueResponseType = IssueInfoResponseType

/** 锁定议题参数类型 */
export interface LockIssueParamType extends RepoBaseParamType, IssueNumberParamType {
  /**
   * 锁定原因
   * 可以是以下之一：
   * - off-topic：锁定议题，因为该议题与仓库无关
   * - too heated：锁定议题，因为讨论过于激烈
   * - resolved：锁定议题，因为该议题已解决
   * - spam：锁定议题，因为该议题是垃圾邮件
   */
  lock_reason?: 'off-topic' | 'too heated' | 'resolved' | 'spam'
}
/** 锁定议题响应类型 */
export interface LockIssueResponseType {
  /** 是否成功锁定 */
  success: boolean
  /** 锁定状态信息 */
  message: string
}

/** 解锁议题参数类型 */
export type UnLockIssueParamType = Omit<LockIssueParamType, 'lock_reason'>
/** 解锁议题响应类型 */
export interface UnLockIssueResponseType {
  /** 是否成功解锁 */
  success: LockIssueResponseType['success']
  /** 解锁状态信息 */
  message: LockIssueResponseType['message']
}

/** 议题评论信息参数类型 */
export type IssueCommentInfoParamType = RepoBaseParamType & CommentIdParamType
/** 议题评论信息响应类型 */
export interface IssueCommentInfoResponseType {
  /** 评论ID */
  id: number;
  /** 评论HTML页面URL */
  html_url: string;
  /** 评论内容 */
  body: string;
  /** 评论用户信息 */
  user: IssueUser;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 仓库评论列表参数类型 */
export interface RepoCommentsListParamType extends RepoBaseParamType {
  /**
   * 排序依据
   * 用于指定结果的排序属性
   * @default created
   * - created: 按创建时间排序
   * - updated: 按更新时间排序
   */
  sort?: 'created' | 'updated';

  /**
   * 排序方向
   * 指定结果的排序方向
   * 注意：如果没有指定 sort 参数，此参数将被忽略
   * @default desc 当 sort 参数存在时
   * - asc: 升序
   * - desc: 降序
   */
  direction?: 'asc' | 'desc';

  /**
   * 筛选此时间之后更新的评论
   * 仅显示在指定时间之后更新的结果
   * 格式为 ISO 8601: YYYY-MM-DDTHH:MM:SSZ
   * @example "2023-01-01T00:00:00Z"
   */
  since?: string;

  /**
   * 每页结果数量
   * 指定每页返回的结果数
   * @default 30
   * @remarks 取值范围：1-100
   */
  per_page?: number;

  /**
   * 页码
   * 指定要获取的结果页码
   * @default 1
   * @remarks 必须大于等于1
   */
  page?: number;
}
/** 仓库评论列表响应类型 */
export type RepoCommentsListResponseType = IssueCommentInfoResponseType[]

/** 议题评论列表参数类型 */
export interface IssueCommentsListParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];

  /**
   * 筛选此时间之后更新的评论
   * 仅显示在指定时间之后更新的结果
   * 格式为 ISO 8601: YYYY-MM-DDTHH:MM:SSZ
   * @example "2023-01-01T00:00:00Z"
   */
  since?: string;

  /**
   * 每页结果数量
   * @default 30
   * @remarks 取值范围：1-100
   */
  per_page?: number;

  /**
   * 页码
   * @default 1
   * @remarks 取值范围：1-100
   */
  page?: number;
}
/** 议题评论列表响应类型 */
export type IssueCommentsListResponseType = IssueCommentInfoResponseType[]

/** 创建议题评论参数类型 */
export interface CreteIssueCommentParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];
  /** 评论内容 */
  body: string;
}
/** 创建议题评论响应类型 */
export type CreteIssueCommentResponseType = IssueCommentInfoResponseType

/** 更新议题评论参数类型 */
export interface UpdateIssueCommentParamType extends IssueCommentInfoParamType {
  /** 评论内容 */
  body: string
}
/** 更新议题评论响应类型 */
export type UpdateIssueCommentResponseType = IssueCommentInfoResponseType

/** 删除议题评论参数类型 */
export interface RemoveIssueCommentParamType extends RepoBaseParamType {
  /** 评论ID */
  comment_id: string | number;
}
/** 删除议题评论响应类型 */
export interface RemoveIssueCommentResponseType {
  /** 是否成功删除议题 */
  success: boolean;
  /** 删除状态信息 */
  message: string
}

/** 获取子议题列表参数类型 */
export interface SubIssueListParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];
  /**
   * 每页结果数量
   * @default 30
   */
  per_page?: number;
  /**
   * 页码
   * @default 1
   */
  page?: number;
}
/** 获取子议题列表响应类型 */
export type SubIssueListResponseType = IssueInfoResponseType[]

/** 添加子议题参数类型 */
export interface CreateSubIssueParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];
  /** * 子议题ID */
  sub_issue_id: IssueNumberParamType['issue_number'];
  /** * 是否替换父议题 */
  replace_parent: boolean;
}
/** 添加子议题响应类型 */
export type CreateSubIssueResponseType = IssueInfoResponseType

/** 删除子议题参数类型 */
export interface RemoveSubIssueParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];
  /** 子议题ID */
  sub_issue_id: IssueNumberParamType['issue_number'];
}
/** 删除子议题响应类型 */
export type RemoveSubIssueResponseType = IssueInfoResponseType

/** 重新确定子议题优先级参数类型 */
export interface ReprioritizeSubIssueParamType extends RepoBaseParamType {
  /** 议题ID */
  issue_number: IssueNumberParamType['issue_number'];
  /** 子议题ID */
  sub_issue_id: IssueNumberParamType['issue_number'];
  /**
   * 要优先排序的子问题的 ID（与 before_id 互斥，只能指定其中一个）
   * 在此 ID 之后放置子问题
   */
  after_id?: IssueNumberParamType['issue_number'];
  /**
   * 要优先排序的子问题的 ID（与 after_id 互斥，只能指定其中一个）
   * 在此 ID 之前放置子问题
   */
  before_id?: IssueNumberParamType['issue_number'];
}
/** 重新确定子议题优先级响应类型 */
export type ReprioritizeSubIssueResponseType = IssueInfoResponseType
