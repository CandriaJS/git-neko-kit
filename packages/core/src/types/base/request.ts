/** 请求令牌的类型 */
export type RequestTokenType = 'Bearer' | 'Basic'

/** 请求配置类型 */
export interface RequestConfigType {
  /** 请求地址 */
  url?: string,
  /** 访问令牌令牌 */
  token?: string | null,
  /** 令牌类型，默认为 Bearer，即使用 Bearer 令牌 */
  tokenType?: RequestTokenType
}
