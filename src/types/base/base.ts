/** 代理地址类型 */
export type ProxyUrlType = string
/**
 * 代理类型：
 * - reverse: 反向代理
 * - original: 原始代理
 * - common: 通用代理
 */
export enum ProxyType {
  /** 反向代理 */
  Reverse = 'reverse',
  /** 原始代理 */
  Original = 'original',
  /** 通用代理 */
  Common = 'common'
}
/** Git类型 */
export type GitType = 'github' | 'gitee' | 'gitcode'

/** 代理协议类型 */
export enum ProxyProtocol {
  /** HTTP */
  HTTP = 'http',
  /** HTTPS */
  HTTPS = 'https',
  /** SOCKS */
  SOCKS = 'socks',
  /** SOCKS5 */
  SOCKS5 = 'socks5'
}

/**
 * 基本代理配置
 * @typeparam T - 代理类型或协议类型
 */
export interface BaseProxyType<T extends ProxyType | ProxyProtocol> {
  type: T
  address: ProxyUrlType
}

/** 代理配置参数类型 */
export type ProxyParamsType =
  | BaseProxyType<ProxyProtocol.HTTP>
  | BaseProxyType<ProxyProtocol.HTTPS>
  | BaseProxyType<ProxyProtocol.SOCKS>
  | BaseProxyType<ProxyProtocol.SOCKS5>
  | BaseProxyType<ProxyType.Common>
  | BaseProxyType<ProxyType.Reverse>
