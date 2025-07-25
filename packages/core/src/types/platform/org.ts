import type { OrgNameParamType, RoleNameType, UserNameParamType } from '@/types/platform/base'
import type { AddCollaboratorResponseType } from '@/types/platform/repo'
import type { UserInfoResponseType } from '@/types/platform/user'

export type OrgUser = Pick<UserInfoResponseType, 'id' | 'login' | 'name' | 'avatar_url' | 'html_url' >
/** 组织信息参数类型 */
export type OrgInfoParamType = OrgNameParamType
/** 组织信息响应类型 */
export interface OrgInfoResponseType {
  /** 组织ID */
  id: number;
  /** 组织名称 */
  login: string;
  /** 组织昵称 */
  name: string;
  /** 组织头像 */
  avatar_url: string;
  /** 组织描述 */
  description: string;
  /** 组织地址 */
  html_url: string;
}
/** 添加组织成员参数类型 */
export interface AddMemberParamType extends OrgNameParamType, UserNameParamType {
  /**
   * 角色
   */
  role?: RoleNameType['role']
}
/** 添加组织成员响应类型 */
export interface AddMemberResponseType extends Omit<AddCollaboratorResponseType, 'permissions' | 'html_url'> {
  /** 组织地址 */
  html_url: string;
  /** 角色 */
  role: RoleNameType['role']
}

/** 获取组织成员信息参数类型 */
export type GetOrgMemberInfoParamType = OrgNameParamType & UserNameParamType
/** 获取组织成员信息响应类型 */
export interface GetOrgMemberInfoResponseType {
  /**
   * 成员状态
   * - active: 已激活
   * - pending: 待处理
   */
  state: 'active' | 'pending'
  /**
   * 成员角色
   * - admin: 管理员
   * - member: 成员
   */
  role: RoleNameType['role']
  /** 组织信息 */
  organization: Pick<OrgInfoResponseType, 'id' | 'login' | 'name' | 'html_url'>
  /** 成员信息 */
  user: OrgUser
}

/** 获取组织成员列表参数 */
export interface GetOrgMemberListParamType extends OrgNameParamType {
  /** 每页数量 */
  per_page: number
  /** 页码 */
  page: number
}
export interface GetOrgMemberListType extends OrgUser {
  /** 角色 */
  role: RoleNameType['role']
}
/** 获取组织成员列表的响应类型 */
export type GetOrgMemberListResponseType = Array<GetOrgMemberListType>

/** 移除组织成员参数类型 */
export type RemoveOrgMemberParamType = OrgNameParamType & UserNameParamType
/** 移除组织成员响应类型 */
export interface RemoveOrgMemberResponseType {
  /** 是否成功 */
  success: boolean
  /** 移除组织成员信息 */
  message: string
}
