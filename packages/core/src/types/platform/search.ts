import { RepoInfoResponseType } from '@/types/platform/repo'
import { UserInfoResponseType } from '@/types/platform/user'

export type SearchUser = Pick<UserInfoResponseType, 'id' | 'login' | 'name' | 'avatar_url' | 'html_url' | 'email'>
export type SearchRepo = Pick<RepoInfoResponseType, 'id' | 'owner' | 'name' | 'full_name' | 'description' | 'visibility' | 'public' | 'private' | 'archived' | 'language' | 'pushed_at'>

/** 搜索用户参数列表 */
export interface SearchUsersParamType {
  /** 搜索关键字 */
  q: string;
  /** 排序顺序 */
  order: 'desc' | 'asc';
  /** 每页数量 */
  per_page?: number;
  /** 页码 */
  page?: number;
}
/** 搜索用户响应列表 */
export interface SearchUsersResponseType {
  /** 搜索结果数量 */
  total_count: number;
  /** 用户列表 */
  items: Array<SearchUser>;
}

export interface SearchReposParamType {
  /** 搜索关键字 */
  q: string;
  /** 排序顺序 */
  order: 'desc' | 'asc';
  /** 每页数量 */
  per_page?: number;
  /** 页码 */
  page?: number;
}
export interface SearchReposResponseType {
  /** 搜索结果数量 */
  total_count: number;
  /** 用户列表 */
  items: Array<SearchRepo>;
}
