import type { AccessTokenClentTYpe, AppClientType, formatParamType } from '@/types/platform/base'

/** GitHub客户端类型 */
export type GitHubBaseClient = AppClientType | AccessTokenClentTYpe
export type GitHubClientType = GitHubBaseClient & {
  /** 是否格式化 */
  readonly format?: formatParamType['format']
}

/** 客户端类型 */
export interface ClientType {
  /** GitHub客户端 */
  github: GitHubClientType;
}
