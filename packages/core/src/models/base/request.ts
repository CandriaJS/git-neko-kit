import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { pkg } from '@/common'
import type { ProxyParamsType, RequestTokenType, ResponseType } from '@/types'

/**
 * HTTP请求客户端类，支持GET/POST请求、代理配置和多种认证方式
 */
export class Request {
  private readonly baseUrl: string
  private readonly tokenType: RequestTokenType
  private readonly authorization?: string | null
  private readonly proxy?: ProxyParamsType | null
  private readonly defaultHeaders?: Record<string, string> | null

  /**
   * 创建Request实例
   * @param baseUrl - 基础URL
   * @param tokenType - 认证类型，默认为'Bearer'
   * @param authorization - 认证令牌
   * @param proxy - 代理配置
   * @param defaultHeaders - 默认请求头信息
   */
  constructor (
    baseUrl: string,
    tokenType: RequestTokenType = 'Bearer',
    authorization?: string | null,
    proxy?: ProxyParamsType | null,
    defaultHeaders?: Record<string, string> | null
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.authorization = authorization
    this.proxy = proxy
    this.tokenType = tokenType
    this.defaultHeaders = defaultHeaders
  }

  /**
   * 执行HTTP请求
   * @param method - HTTP方法 ('get' | 'post' | 'put')
   * @param path - 请求路径
   * @param data - POST请求体数据
   * @param params - URL查询参数
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  private async request (
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    path: string,
    params?: any,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+|\/+$/g, '')}`
    const config: AxiosRequestConfig = {
      headers: this.createHeaders(customHeaders),
      params,
      maxRedirects: 2,
      validateStatus: () => true
    }

    /** 代理配置 */
    if (this.proxy) {
      const proxyType = this.proxy.type
      const proxyAddress = this.proxy.address

      switch (proxyType) {
        /** HTTP代理配置 */
        case 'http':
          config.httpAgent = new HttpProxyAgent(proxyAddress)
          config.httpsAgent = new HttpsProxyAgent(proxyAddress)
          break
          /** HTTPS代理配置 */
        case 'https':
          config.httpsAgent = new HttpsProxyAgent(proxyAddress)
          break
          /** SOCKS代理配置 */
        case 'socks':
        {
          const socksAgent = new SocksProxyAgent(proxyAddress)
          config.httpAgent = socksAgent
          config.httpsAgent = socksAgent
          break
        }
      }
    }
    try {
      let response
      switch (method) {
        case 'get':
          response = await axios.get(url, config)
          break
        case 'post':
          response = await axios.post(url, data, config)
          break
        case 'patch':
          response = await axios.patch(url, data, config)
          break
        case 'put':
          response = await axios.put(url, data, config)
          break
        case 'delete':
          response = await axios.delete(url, {
            ...config,
            data
          })
          break
        default:
          throw new Error(`不支持的请求方法: ${method}`)
      }

      const headers = Object.fromEntries(
        Object.entries(response.headers)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k.toLowerCase(), v])
      )
      return {
        success: true,
        statusCode: response.status,
        headers,
        data: response.data,
        msg: response.status >= 200 && response.status < 500 ? '请求成功' : '请求异常'
      }
    } catch (error) {
      const axiosError = error as AxiosError
      const errorHeaders = axiosError.response?.headers
        ? Object.fromEntries(
          Object.entries(axiosError.response.headers)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, v])
        )
        : {}

      return {
        success: false,
        statusCode: axiosError.response?.status ?? 500,
        headers: errorHeaders,
        msg: axiosError.message ?? '网络连接失败',
        data: null
      }
    }
  }

  /**
   * 发送GET请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  public async get (
    path: string,
    params?: Record<string, string>,
    customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    return this.request('get', path, params, null, customHeaders)
  }

  /**
   * 发送POST请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param data - 请求体数据
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  public async post (
    path: string,
    params?: Record<string, string>,
    data?: any, customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    return this.request('post', path, params, data, customHeaders)
  }

  /**
   * 发送PATCH请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param data - 请求体数据
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  public async patch (
    path: string,
    params: Record<string, string> | null = null,
    data?: any, customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    return this.request('patch', path, params, data, customHeaders)
  }

  /**
   * 发送PUT请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param data - 请求体数据
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  public async put (
    path: string,
    params?: Record<string, string>,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    return this.request('put', path, params, data, customHeaders)
  }

  /**
   * 发送DELETE请求
   * @param path - 请求路径
   * @param params - URL查询参数
   * @param data - 请求体数据
   * @param customHeaders - 自定义请求头
   * @returns 响应结果
   */
  public async delete (
    path: string,
    params: Record<string, string> | null = null,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ResponseType> {
    return this.request('delete', path, params, data, customHeaders)
  }

  /**
   * 创建请求头
   * @param customHeaders - 自定义请求头
   * @returns 包含基础头信息和认证信息的请求头对象
   */
  private createHeaders (customHeaders?: Record<string, string>) {
    const pkgName = pkg.name.includes('/')
      ? pkg.name.split('/').pop()
      : pkg.name
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': `${pkgName}/v${pkg.version}`,
      ...(this.defaultHeaders ?? {})
    }

    if (this.authorization) {
      if (this.tokenType === 'Basic') {
        const basicToken = Buffer.from(this.authorization).toString('base64')
        headers['Authorization'] = `Basic ${basicToken}`
      } else if (this.tokenType === 'Bearer') {
        headers['Authorization'] = `Bearer ${this.authorization}`
      } else {
        headers['Authorization'] = `${this.tokenType} ${this.authorization}`
      }
    }
    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }

    return headers
  }
}
