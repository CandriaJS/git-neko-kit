import type { OrgNameParamType, UserNameParamType } from '@/types/platform/base'
import { AddCollaboratorResponseType } from '@/types/platform/repo'

/** 组织信息参数类型 */
export type OrgInfoParamType = OrgNameParamType
/** 组织信息响应类型 */
export interface OrgInfoResponseType {
  /** 组织ID */
  id: number;
  /** 组织名称 */
  login: string;
  /** 组织描述 */
  name: string;
  /** 组织头像 */
  avatar_url: string;
  /** 组织描述 */
  description: string;
  /** 组织地址 */
  html_url: string;
}
export type RoleNameType = 'admin' | 'member'
/** 添加组织成员参数类型 */
export interface AddMemberParamType extends OrgNameParamType, UserNameParamType {
  /**
   * 角色
   * @default 'member'
   */
  role?: 'admin' | 'member'
}
/** 添加组织成员响应类型 */
export interface AddMemberResponseType extends Omit<AddCollaboratorResponseType, 'permissions' | 'html_url'> {
  /** 组织地址 */
  html_url: string;
  /** 角色 */
  role: 'admin' | 'member'
}
