import type { RepoBaseParamType } from '@/types/platform/base'
import type { UserInfoResponseType } from '@/types/platform/user'

export type ReleaseUser = Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'>
/** 反应信息类型 */
export interface ReactionInfoType {
  /** 反应 API URL */
  url: string;
  /** 总反应数 */
  total_count: number;
  /** 👍 反应数 */
  '+1': number;
  /** 👎 反应数 */
  '-1': number;
  /** 😄 反应数 */
  laugh: number;
  /** 😕 反应数 */
  confused: number;
  /** ❤️ 反应数 */
  heart: number;
  /** 🎉 反应数 */
  hooray: number;
  /** 👀 反应数 */
  eyes: number;
  /** 🚀 反应数 */
  rocket: number;
}

/** 发布资源类型 */
export interface ReleaseAssetsType {
  /** 资源 URL */
  url: string;
  /** 资源下载 URL */
  browser_download_url: string;
}

/** 获取Release信息参数类型 */
export type ReleaseInfoParamType = RepoBaseParamType & {
  /** 发布ID */
  release_id: number
}
/** 获Release信息响应类型 */
export interface ReleaseInfoResponseType {
  /**
   * 发布版本的 ID
   * 该字段在gitcode平台为null
   */
  id: number | null;
  /** 标签名称 */
  tag_name: string;
  /** 目标分支或提交 */
  target_commitish: string;
  /** 发布版本名称 */
  name: string | null;
  /** 发布说明 */
  body: string | null;
  /** 是否为预发布版本 */
  prerelease: boolean;
  /** 发布者信息 */
  author: ReleaseUser;
  /** 发布资源列表 */
  assets: Array<ReleaseAssetsType>;
  /** 发布时间 */
  created_at: string;
}

/** 获取最新Release参数类型 */
export type ReleaseLatestParamTypeType = RepoBaseParamType
/** 获取最新Release响应类型 */
export type ReleaseLatestResponseType = ReleaseInfoResponseType

/** 通过Tag获取Release信息参数类型 */
export type ReleaseInfoByTagParamType = RepoBaseParamType & {
  /** 标签名称 */
  tag: string
}
/** 通过Tag获取Release信息响应类型 */
export type ReleaseInfoByTagResponseType = ReleaseInfoResponseType

/** 获取Release列表参数类型 */
export type ReleaseListParamType = RepoBaseParamType & {
  /** 每页数量 */
  per_page?: number
  /** 页码 */
  page?: number
}
/** 获取Release列表响应类型 */
export type ReleaseListResponseType = Array<ReleaseInfoResponseType>

/** 创建Release参数类型 */
export type CreateReleaseParamType = RepoBaseParamType & {
  /** 标签名称 */
  tag_name: string
  /** 目标分支或提交 */
  target_commitish: string
  /** 发布版本名称 */
  name: string
  /** 发布说明 */
  body: string
  /** 是否为预发布版本 */
  prerelease: boolean
}
/** 获取Release列表参数类型 */
export type CreateReleaseResponseType = ReleaseInfoResponseType

/** 更新Release参数类型 */
export type UpdateReleaseParamType = CreateReleaseParamType
/** 更新Release响应类型 */
export type UpdateReleaseResponseType = ReleaseInfoResponseType

/** 删除Release参数类型 */
export type DeleteReleaseParamType = ReleaseInfoParamType
/** 删除Release响应类型 */
export interface DeleteReleaseResponseType {
  /** 是否删除成功 */
  success: boolean
  /** 删除状态信息 */
  message: string
}
