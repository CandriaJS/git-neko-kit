import crypto from 'node:crypto'

import {
  InvalidWebHookSignatureFormatMsg,
  MissingWebHookPayloadMsg,
  MissingWebHookSecretMsg,
  MissingWebHookSignatureMsg,
  WebHookSignatureSuccessMsg,
  WebHookSignatureVerificationFailedMsg
} from '@/common'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  ApiResponseType,
  WebHookSignatureParamType,
  WebHookSignatureResponseType
} from '@/types'

/**
 * GitHUb WebHook操作类
 *
 * 提供对GitHub WebHook的CRUD操作，包括：
 * - 检查webhook签名是否正确
 */
export class WebHook extends GitHubClient {
  /**
   * 检查WebHook签名是否正确
   * 权限：无需任何权限
   * @param options - WebHook参数对象，必须包含以下参数：
   * - payload: 要验证的签名主体
   * - signature: 要验证的签名
   * @returns 验证结果
   * @example
   * ```ts
   * const res = await check_webhook_signature({
   *   payload: 'your_payload',
   *   signature: 'your_signature'
   * })
   * ->
   * {
   *   success: true,
   *   status: 'ok',
   *   msg: '请求成功'
   *   data: {
   *     success: true,
   *     message: '验证成功'
   *   }
   * }
   * ```
   */
  public async check_webhook_signature (
    options: WebHookSignatureParamType
  ):Promise<ApiResponseType<WebHookSignatureResponseType>> {
    if (!this.WebHook_Secret) throw new Error(MissingWebHookSecretMsg)
    if (!options.payload) throw new Error(MissingWebHookPayloadMsg)
    if (!options.signature) throw new Error(MissingWebHookSignatureMsg)
    if (!options.signature.startsWith('sha256=')) throw new Error(InvalidWebHookSignatureFormatMsg)

    let success: boolean = false
    let status: 'ok' | 'error' = 'error'
    let statusCode = 400
    let msg: string
    let WebHookdata: WebHookSignatureResponseType

    const hmac = crypto.createHmac('sha256', this.WebHook_Secret)
    const payloadString = typeof options.payload === 'string'
      ? options.payload
      : JSON.stringify(options.payload)
    hmac.update(payloadString, 'utf8')
    const calculatedSignature = hmac.digest('hex')
    const receivedSignature = options.signature.replace('sha256=', '')

    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(receivedSignature)
    )

    if (isValid) {
      success = true
      status = 'ok'
      statusCode = 200
      msg = '请求成功'
      WebHookdata = {
        success,
        message: WebHookSignatureSuccessMsg
      }
    } else {
      success = false
      status = 'error'
      statusCode = 403
      msg = '请求失败'
      WebHookdata = {
        success,
        message: WebHookSignatureVerificationFailedMsg
      }
    }
    return Promise.resolve(
      {
        success,
        status,
        statusCode,
        msg,
        data: WebHookdata
      }
    )
  }
}
