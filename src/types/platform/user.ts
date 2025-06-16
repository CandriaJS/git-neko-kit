import type {
  UserIdParamType,
  UserNameParamType
} from '@/types/platform/base'

/** 用户信息参数类型 */
export type UserInfoParamType = UserNameParamType
/** 通过用户ID 获取用户信息参数类型 */
export type UserInfoByIdParamType = UserIdParamType
/** 用户信息响应类型 */
export interface UserInfoResponseType {
  /** 账号ID */
  id: number;
  /** 账号登录名 */
  login: string;
  /** 用户全名 */
  name: string | null;
  /** 邮箱 */
  email: string | null;
  /**
   * 账号类型
   * User: 用户
   * Organization: 组织
   */
  type: string;
  /** 账号主页URL */
  html_url: string;
  /** 账号头像URL */
  avatar_url: string;
  /** 个人简介 */
  bio: string | null;
  /** 博客URL */
  blog: string | null;
  /** 公开仓库数量 */
  public_repos: number;
  /** 粉丝数 */
  followers: number;
  /** 关注数 */
  following: number;
}
