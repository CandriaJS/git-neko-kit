import type { OrgNameParamType, UserNameParamType } from '@/types/platform/base'
import type { RepoInfoParamType, RepoInfoResponseType } from '@/types/platform/repo'
import type { UserInfoResponseType } from '@/types/platform/user'

export type AppUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'>

/**
 * 定义 Base 应用所需的权限
 */
export interface AppPermissions {
  /** 对仓库内容的权限（例如读取、写入） */
  contents: string;
  /** 对部署的权限（例如读取、写入） */
  deployments: string;
  /** 对议题的权限（例如写） */
  issues: string;
  /** 对检查的权限 */
  checks: string;
  /** 对元数据的权限（例如读取） */
  metadata: string;
}
export interface AppInfoParamType {
  /**
   * 应用的标识符
   * 是https://github.com/settings/apps/:app_slug的
   * */
  app_slug: string;
}
/**
 * 应用的详细信息
 */
export interface AppInfoResponseType {
  /** 应用的唯一 ID */
  id: number;
  /** 应用的名称 */
  name: string;
  /** 应用的 Client ID */
  client_id: string;
  /** 应用的标识符（slug） */
  slug: string;
  /** 应用所有者的信息 */
  owner: AppUser;
  /** 应用的描述 */
  description: string;
  /** 应用的外部 URL */
  external_url: string;
  /** 应用的 Base 页面 URL */
  html_url: string;
  /** 应用所需的权限 */
  permissions: AppPermissions;
  /** 应用监听的事件列表 */
  events: string[];
  /** 应用创建时间的时间戳 */
  created_at: string;
  /** 应用最后更新时间的时间戳 */
  updated_at: string;
}

/** GitHub应用安装仓库信息响应类型 */
export interface AppRepoInfoResponseType {
  /** 安装的唯一ID */
  id: number;
  /** 安装页面URL */
  html_url: string;
  /** 应用ID */
  app_id: number;
  /** 应用标识符 */
  app_slug: string;
  /** 目标ID（用户或组织的ID） */
  target_id: number;
  /** 目标类型（如'Organization'） */
  target_type: string;
  /** 安装的账户信息，可以是用户或企业 */
  account: AppUser;
  /** 仓库选择类型 */
  repository_selection: 'all' | 'selected';
  /** 访问令牌URL */
  access_tokens_url: string;
  /** 仓库列表URL */
  repositories_url: string;
  /** 权限配置 */
  permissions: AppPermissions;
  /** 事件列表 */
  events: string[];
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/** 通过仓库信息获取应用信息参数类型 */
export type GetAppInfoByRepoParamType = RepoInfoParamType
/** 通过仓库信息获取应用信息响应类型 */
export type GetAppInfoByRepoResponseType = AppRepoInfoResponseType

/** 通过用户信息获取应用信息参数 */
export type GetAppInfoByUserParamType = UserNameParamType
/** 通过用户信息获取应用信息响应类型 */
export type GetAppInfoByUserResponseType = AppRepoInfoResponseType

/** 通过用户信息获取应用信息参数 */
export type GetAppInfoByOrgParamType = OrgNameParamType
/** 通过用户信息获取应用信息响应类型 */
export type GetAppInfoByOrgResponseType = AppRepoInfoResponseType

/** 访问令牌权限 */
export interface AccessTokenPermissionsType {
  /** GitHub Actions 工作流、工作流运行和工件的权限 */
  actions: 'read' | 'write';
  /** 存储库创建、删除、设置、团队和协作者创建的权限 */
  administration: 'read' | 'write';
  /** 代码检查的权限 */
  checks: 'read' | 'write';
  /** 创建、编辑、删除和列出 GitHub Codespaces 的权限 */
  codespaces: 'read' | 'write';
  /** 存储库内容、提交、分支、下载、发布和合并的权限 */
  contents: 'read' | 'write';
  /** 管理 Dependabot 密钥的权限 */
  dependabot_secrets: 'read' | 'write';
  /** 部署和部署状态的权限 */
  deployments: 'read' | 'write';
  /** 管理存储库环境的权限 */
  environments: 'read' | 'write';
  /** 问题和相关评论、指派、标签和里程碑的权限 */
  issues: 'read' | 'write';
  /** 搜索存储库、列出协作者和访问存储库元数据的权限 */
  metadata: 'read' | 'write';
  /** 管理 GitHub Packages 发布的包的权限 */
  packages: 'read' | 'write';
  /** 获取 Pages 状态、配置和构建的权限，并创建新的构建 */
  pages: 'read' | 'write';
  /** 管理拉取请求及相关评论、指派、标签、里程碑和合并的权限 */
  pull_requests: 'read' | 'write';
  /** 查看和编辑存储库自定义属性的权限 */
  repository_custom_properties: 'read' | 'write';
  /** 管理存储库的 post-receive 钩子的权限 */
  repository_hooks: 'read' | 'write';
  /** 管理存储库项目、列和卡片的权限 */
  repository_projects: 'read' | 'write' | 'admin';  // 权限级别：read、write 或 admin
  /** 查看和管理秘密扫描警报的权限 */
  secret_scanning_alerts: 'read' | 'write';
  /** 管理存储库秘密的权限 */
  secrets: 'read' | 'write';
  /** 查看和管理安全事件的权限，比如代码扫描警报 */
  security_events: 'read' | 'write';
  /** 只管理单个文件的权限 */
  single_file: 'read' | 'write';
  /** 管理提交状态的权限 */
  statuses: 'read' | 'write';
  /** 管理 Dependabot 警报的权限 */
  vulnerability_alerts: 'read' | 'write';
  /** 更新 GitHub Actions 工作流文件的权限 */
  workflows: 'write';  // 权限级别：write
  /** 管理组织团队和成员的权限 */
  members: 'read' | 'write';
  /** 管理组织访问权限的权限 */
  organization_administration: 'read' | 'write';
  /** 管理自定义存储库角色的权限 */
  organization_custom_roles: 'read' | 'write';
  /** 管理自定义组织角色的权限 */
  organization_custom_org_roles: 'read' | 'write';
  /** 管理自定义属性的权限 */
  organization_custom_properties: 'read' | 'write' | 'admin';  // 权限级别：read、write 或 admin
  /** 管理 GitHub Copilot 组织成员访问权限的权限 */
  organization_copilot_seat_management: 'write';  // 权限级别：write
  /** 查看和管理组织公告横幅的权限 */
  organization_announcement_banners: 'read' | 'write';
  /** 查看组织活动的权限 */
  organization_events: 'read';  // 权限级别：read
  /** 管理组织的 post-receive 钩子的权限 */
  organization_hooks: 'read' | 'write';
  /** 查看和管理组织的个人访问令牌请求的权限 */
  organization_personal_access_tokens: 'read' | 'write';
  /** 查看和管理组织批准的个人访问令牌的权限 */
  organization_personal_access_token_requests: 'read' | 'write';
  /** 查看组织计划的权限 */
  organization_plan: 'read';  // 权限级别：read
  /** 管理组织项目的权限 */
  organization_projects: 'read' | 'write' | 'admin';  // 权限级别：read、write 或 admin
  /** 管理组织 GitHub Packages 包的权限 */
  organization_packages: 'read' | 'write';
  /** 管理组织秘密的权限 */
  organization_secrets: 'read' | 'write';
  /** 查看和管理组织 GitHub Actions 自托管运行器的权限 */
  organization_self_hosted_runners: 'read' | 'write';
  /** 查看和管理被组织屏蔽的用户的权限 */
  organization_user_blocking: 'read' | 'write';
  /** 管理团队讨论和相关评论的权限 */
  team_discussions: 'read' | 'write';
  /** 管理用户的电子邮件地址的权限 */
  email_addresses: 'read' | 'write';
  /** 管理用户的关注者的权限 */
  followers: 'read' | 'write';
  /** 管理 Git SSH 密钥的权限 */
  git_ssh_keys: 'read' | 'write';  // 权限级别：read 或 writ
  /** 查看和管理 GPG 密钥的权限 */
  gpg_keys: 'read' | 'write';
  /** 查看和管理存储库的互动限制的权限 */
  interaction_limits: 'read' | 'write';
  /** 管理用户的个人资料设置的权限 */
  profile: 'write';  // 权限级别：write
  /** 列出和管理用户标星的存储库的权限 */
  starring: 'read' | 'write';
}
/** 为应用创建访问令牌参数类型 */
export interface CreateAccessTokenForAppParamType {
  /** 应用安装id */
  installation_id: number;
  /** 存储库名称列表 */
  repositories: Array<string>;
  /** 存储库id列表 */
  repository_ids: Array<number>;
  /** 访问令牌权限 */
  permissions: AccessTokenPermissionsType
}
/** 为应用创建访问令牌响应类型 */
export interface CreateAccessTokenForAppResponseType {
  /** 访问令牌 */
  token: string;
  /** 访问令牌过期时间 */
  expires_at: string;
  /** 访问令牌权限 */
  permissions: Record<string, string>
  /** 访问令牌仓库选择范围 */
  repository_selection: 'all' | 'selected'
  /** 访问令牌仓库列表 */
  repositories: Array<RepoInfoResponseType>
}

/** 撤销应用程序访问令牌响应类型 */
export interface RevokeAccessTokenResponseType {
  /** 是否撤销成功 */
  success: boolean
  /** 撤销结果信息 */
  info: string
}
