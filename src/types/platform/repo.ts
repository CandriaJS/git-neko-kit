import type {
  OrgNameParamType,
  RepoBaseParamType,
  RepoOwnerParamType,
  UserNameParamType
} from '@/types/platform/base'
import type { UserInfoResponseType } from '@/types/platform/user'

/** 仓库所有者参数类型 */
export type RepoUser = Omit<UserInfoResponseType, 'followers' | 'following' | 'blog' | 'bio' | 'public_repos'>

/** 仓库列表参数类型 */
export interface RepoListBaseParamType {
  /** 排序方式，可选created， updated， pushed， full_name， 默认为 full_name */
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  /** 排序方式，可选asc， desc， 默认为 desc */
  direction?: 'asc' | 'desc'
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}

export interface UserByTokenRepoListParamType extends RepoListBaseParamType {
  /** 仓库的可见性，可选all， public， private， 默认为 all */
  visibility?: 'all' | 'public' | 'private'
  /** 仓库的状态，可选all， public， private， 默认为 all */
  affiliation?: 'owner' | 'collaborator' | 'organization_member'
  /** 类型，可选all， owner， member， 默认为 all */
  type?: 'all' | 'owner' | 'member'
}

/** 仓库信息请求参数 */
export type RepoInfoParamType = RepoBaseParamType

/** * 仓库信息 */
export interface RepoInfoResponseType {
  /** * 仓库的唯一 ID */
  id: number;
  /** * 仓库的名称 */
  name: string;
  /** * 仓库的完整名称，包含用户名或组织名 */
  full_name: string;
  /** * 仓库拥有者的信息 */
  owner: RepoUser;
  /** 仓库是否公开 */
  public: boolean;
  /** * 仓库是否私有 */
  private: boolean;
  /** * 仓库的可见性 */
  visibility: 'public' | 'private';
  /** * 仓库是否是 fork 仓库 */
  fork: boolean;
  /** * 仓库是否已归档 */
  archived: boolean;
  /** * 仓库是否被禁用 */
  disabled: boolean;
  /** * 仓库的 HTML 页面 URL */
  html_url: string;
  /** * 仓库的描述信息 */
  description: string | null;
  /** * 仓库的 Stargazer 数量 */
  stargazers_count: number;
  /** * 仓库的 Watcher 数量 */
  watchers_count: number;
  /** * 仓库的主编程语言 */
  language: string | null;
  /** * 仓库的 fork 数量 */
  forks_count: number;
  /** * 开放的 issue 数量 */
  open_issues_count: number;
  /** * 仓库的默认分支 */
  default_branch: string;
  /** * 仓库的创建时间 */
  created_at: string;
  /** * 仓库的更新时间 */
  updated_at: string;
  /** * 仓库的推送时间 */
  pushed_at: string;
}

/** 组织仓库列表参数类型 */
export interface OrgRepoListParmType extends RepoListBaseParamType {
  /** 组织名称 */
  org: string
  /** 类型，可选all， public， private 默认为 all */
  type?: 'all' | 'public' | 'private'
}
/**
 * 组织仓库列表响应类型
 * 该类型包含了多个仓库的信息，每个仓库都有自己的详细信息。
 */
export type OrgRepoListResponseType = RepoInfoResponseType[]

/** 创建组织仓库请求参数 */
export interface OrgRepoCreateParamType extends OrgNameParamType {
  /** 仓库名称 */
  name: string;
  /** 仓库描述 */
  description?: string;
  /** 仓库主页 */
  homepage?: string;
  /** 仓库可见性 */
  visibility?: 'public' | 'private';
  /** 是否开启议题issue */
  has_issues?: boolean;
  /** 是否开启wiki */
  has_wiki?: boolean;
  /** 仓库自动初始化 */
  auto_init?: boolean;
}
/** 创建组织仓库响应类型 */
export type OrgRepoCreateResponseType = RepoInfoResponseType

/** 创建用户仓库参数类型 */
export type UserRepoCreateParamType = Omit<OrgRepoCreateParamType, 'org'> & RepoOwnerParamType
/** 创建用户仓库响应类型 */
export type UserRepoCreateResponseType = RepoInfoResponseType

/** 用户仓库列表参数类型 */
export interface UserRepoListParamType extends RepoListBaseParamType {
  /** 用户名 */
  username: string
  /** 类型，可选all， owner， member， 默认为 all */
  type?: 'all' | 'owner' | 'member'
}
/** 用户仓库列表类型 */
export type UserRepoListType = Array<RepoInfoResponseType & {
  /** * 仓库的角色名称 */
  role_name?: string;
}>

/** 仓库语言信息类型 */
export interface LanguageInfo {
  /** 编程语言名称 */
  language: string;
  /** 语言对应的颜色 */
  color: string;
  /** 在仓库中的占比（百分比） */
  percent: number;
  /** 该语言的代码字节数 */
  bytes: number;
}

/** 仓库语言列表参数类型 */
export type RepoLanguagesListParamType = RepoBaseParamType
/** 仓库语言列表类型 */
export interface RepoLanguagesListResponseType {
  /** 仓库的语言统计信息列表 */
  languages: LanguageInfo[];
}

/** 获取仓库可见性参数类型 */
export type GetRepoVisibilityParamType = RepoBaseParamType
/** 获取仓库可见性响应类型 */
export type GetRepoVisibilityResponseType = RepoInfoResponseType['visibility']

/** 获取仓库默认分支参数类型 */
export type GetRepoDefaultBranchParamType = RepoBaseParamType
/** 获取仓库默认分支响应类型 */
export type GetRepoDefaultBranchResponseType = RepoInfoResponseType['default_branch']

/** 获取仓库主要语言参数类型 */
export type GetRepoMainLanguageParamType = RepoBaseParamType
/** 仓库主要语言响应类型 */
export type GetRepoMainLanguageResponseType = RepoInfoResponseType['language']

/**
 * 协作者权限 ,可选 pull，triage, push, maintain, admin，默认pull
 * pull - 只读访问，协作者可以查看仓库内容。
 * push - 允许推送代码到仓库分支，同时拥有 pull 权限。
 * admin - 拥有仓库的完全控制权，包括更改设置和删除仓库。
 */
export type CollaboratorPermissionType = 'pull' | 'push' | 'admin'

/** 协作者参数类型 */
export type CollaboratorParamType = RepoInfoParamType & UserNameParamType & {
  /** 邀请的权限 */
  permission?: CollaboratorPermissionType
}

/** 邀请协作者响应类型 */
export interface AddCollaboratorResponseType {
  /** 被邀请者ID */
  id: number;
  /** 被邀请者用户名 */
  login: string;
  /** 被邀请者的别名 */
  name: string | null;
  /** 仓库的地址 */
  html_url: string;
  /** 被邀请者的权限 */
  permissions: string;
}

/** 协作者列表参数类型 */
export type GetCollaboratorListParamType = RepoInfoParamType & {
  /**
   * 筛选按隶属关系返回的协作者
   * outside - 列出所有外部协作者，包括仓库成员和外部 collaborator。
   * direct - 列出仓库成员。
   * all - 列出仓库成员和外部 collaborator。
  */
  affiliation?: 'outside' | 'direct' | 'all';
  /** 权限 */
  permission?: CollaboratorPermissionType
  /** 每页数量 */
  per_page?: number;
  /** 页码 */
  page?: number;
}

/** 协作者信息类型 */
export interface CollaboratorInfoResponseType {
  /** 协作者id */
  id: number;
  /** 协作者登录名 */
  login: string;
  /** 头像URL */
  avatar_url: string;
  /** 协作者邮箱 */
  email: string | null;
  /** 协作者姓名 */
  name: string | null;
  /** 权限设置 */
  permissions: {
    /** 拉取权限 */
    pull: boolean;
    /** 分类权限 */
    triage: boolean;
    /** 推送权限 */
    push: boolean;
    /** 维护权限 */
    maintain: boolean;
    /** 管理权限 */
    admin: boolean;
  };
}

/** 协作者列表响应类型 */
export type GetCollaboratorListResponseType = CollaboratorInfoResponseType[]

/** 移除协作者参数类型 */
export type RemoveCollaboratorParamType = RepoBaseParamType & UserNameParamType
/** 移除协作者响应类型 */
export interface RemoveCollaboratorResponseType {
  /** 状态信息 */
  info: string;
}
