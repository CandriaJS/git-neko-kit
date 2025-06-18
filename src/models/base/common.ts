import { v4 as uuidv4 } from 'uuid'

import { GitTypeNotSupportedMsg, MissingProxyUrlMsg, UrlProtocolNotSupportedMsg } from '@/common'
import { GitType, ProxyType, ProxyUrlType } from '@/types'

/**
 * 获取API基础URL方法
 * @param type - GIt类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @param proxyType - 代理类型，默认original，可选reverse, common, original
 * @returns 返回URL
 * @example
 * ```ts
 * // 通用代理
 * get_api_base_url('github', { proxyUrl: 'https://proxy.example.com', proxyType: 'common'})
 * -> 'https://proxy.example.com/https://api.github.com'
 * // 反向代理
 * get_api_base_url('github', { proxyUrl: 'https://proxy.example.com', proxyType: 'reverse'})
 * -> 'https://proxy.example.com'
 * // 不使用代理
 * get_api_base_url('github', { proxyType: 'original'})
 * -> 'https://api.github.com'
 */
export function get_api_base_url (
  type: GitType = 'github',
  options: {
    proxyUrl?: ProxyUrlType,
    proxyType?: ProxyType
  } = {}
): string {
  const gitType = ['github', 'gitee', 'gitcode']
  if (!gitType.includes(type)) {
    throw new Error(GitTypeNotSupportedMsg)
  }

  const { proxyUrl, proxyType = 'original' } = options

  const urlMap: Record<GitType, string> = {
    github: 'api.github.com',
    gitee: 'gitee.com/api/v5',
    gitcode: 'api.gitcode.com/api/v5'
  } as const

  const baseUrl = `https://${urlMap[type]}`

  if (proxyType !== 'original') {
    if (!proxyUrl) {
      throw new Error(MissingProxyUrlMsg)
    }
    if (!proxyUrl.startsWith('http')) {
      throw new Error(UrlProtocolNotSupportedMsg)
    }

    const cleanedProxy = proxyUrl.replace(/(^\/|\/$)/g, '')
    return proxyType === 'common'
      ? `${cleanedProxy}/${urlMap[type]}`
      : cleanedProxy
  }

  return baseUrl.replace(/\/$/, '')
}

/**
 * 获取基础URL方法
 * @param type - Git类型, 默认github, 可选gitee, gitcode
 * @param proxyUrl - 代理URL，可选，默认不使用
 * @param proxyType - 代理类型，默认common，可选reverse, common
 * @example
 * ```ts
 * // 通用代理
 * get_api_base_url('github', { proxyUrl: 'https://proxy.example.com', proxyType: 'common'})
 * -> 'https://proxy.example.com/https://github.com'
 * // 反向代理
 * get_api_base_url('github', { proxyUrl: 'https://proxy.example.com', proxyType: 'reverse'})
 * -> 'https://proxy.example.com'
 * // 不使用代理
 * get_api_base_url('github', { proxyType: 'original'})
 * -> 'https://api.github.com'
 */
export function get_base_url (
  type: GitType = 'github',
  options: {
    proxyUrl?: ProxyUrlType,
    proxyType?: ProxyType
  } = {}
): string {
  const gitType = ['github', 'gitee', 'gitcode']
  if (!gitType.includes(type)) {
    throw new Error(GitTypeNotSupportedMsg)
  }
  const { proxyUrl, proxyType = 'original' } = options
  const urlMap: Record<GitType, string> = {
    github: 'github.com',
    gitee: 'gitee.com',
    gitcode: 'gitcode.com'
  } as const

  const baseUrl = `https://${urlMap[type]}`

  if (proxyType !== 'original') {
    if (!proxyUrl) {
      throw new Error(MissingProxyUrlMsg)
    }
    if (!proxyUrl.startsWith('http')) {
      throw new Error(UrlProtocolNotSupportedMsg)
    }

    const cleanedProxy = proxyUrl.replace(/(^\/|\/$)/g, '')
    return proxyType === 'common'
      ? `${cleanedProxy}/${urlMap[type]}`
      : cleanedProxy
  }

  return baseUrl.replace(/\/$/, '')
}

/**
 * 生成一个用户唯一的标识符
 * @returns 生成的唯一标识符
 * @example
 * ```ts
 * const stateId = await create_state_id()
 * -> '34523452345234523452345234523452'
 * ```
 */
export async function create_state_id (): Promise<string> {
  return Promise.resolve(uuidv4().replace(/-/g, ''))
}
