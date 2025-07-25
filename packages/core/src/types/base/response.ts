import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
/** 是否响应成功类型 */
export type ResponseSuccessType = boolean

/** 状态码响应类型 */
export type ResponseStatusCodeType = number

/** 消息响应类型 */
export type ResponseMsgType = string

/** 响应头类型 */
export type ResponseHeadersType = RawAxiosResponseHeaders | AxiosResponseHeaders

/** 响应类型 */
export interface ResponseType<D = any> {
  success: ResponseSuccessType
  statusCode: ResponseStatusCodeType
  headers: ResponseHeadersType
  msg: ResponseMsgType
  data: D
}

/** API响应类型 */
export interface ApiResponseType<D = any> extends Omit<ResponseType<D>, 'headers'> {
  status: 'ok' | 'error'
}
