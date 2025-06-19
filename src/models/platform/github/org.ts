import { isEmpty } from 'lodash'

import {
  MissingOrgParamMsg,
  MissingUserNameParamMsg,
  OrgNotFoundMsg,
  PermissionDeniedMsg,
  RepoOrPermissionDeniedMsg
} from '@/common'
import { get_base_url } from '@/models/base/common'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  AddMemberParamType,
  AddMemberResponseType,
  ApiResponseType,
  OrgInfoParamType,
  OrgInfoResponseType
} from '@/types'
/**
 * Github 组织操作类
 *
 * 提供对GitHub组织的CRUD操作，包括：
 * - 获取组织信息
 */
export class Org extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.api_url = base.api_url
    this.base_url = base.base_url
  }

  /**
   * 获取组织信息
   * 权限:
   * - Metadata Read-only , 如果获取公开组织可无需此权限
   * @param options 组织参数
   * - org 组织名称
   * @returns 组织信息
   * @example
   * ```ts
   * const orgInfo = await org.get_org_info({ org: 'org' })
   * -> 组织信息对象
   * ```
   */
  public async get_org_info (
    options: OrgInfoParamType
  ): Promise<ApiResponseType<OrgInfoResponseType>> {
    if (!options.org) {
      throw new Error(MissingOrgParamMsg)
    }
    const { org } = options
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/orgs/${org}`)
      if (res.statusCode === 404) {
        throw new Error(OrgNotFoundMsg)
      }
      if (res.data) {
        const OrgData: OrgInfoResponseType = {
          id: res.data.id,
          login: res.data.login,
          name: isEmpty(res.data.name) ? null : res.data.name,
          avatar_url: res.data.avatar_url,
          description: res.data.description,
          html_url: res.data.html_url
        }
        res.data = OrgData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取组织信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 添加组织成员
   * 权限:
   * - Members  Read-And_Write
   * @param options 组织参数
   * - org 组织名称
   * - username 成员名称
   * @returns 成员信息
   * @example
   * ```ts
   * const orgInfo = await org.add_member({ org: 'org', username: 'username' })
   * -> 添加组织成员对象
   * ```
   */
  public async add_member (
    options: AddMemberParamType
  ): Promise<ApiResponseType<AddMemberResponseType>> {
    if (!options.org) {
      throw new Error(MissingOrgParamMsg)
    }
    if (!options.username) {
      throw new Error(MissingUserNameParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      let userid, user_email
      const { org, username, role } = options
      if (username) {
        const user = await this.get_user()
        try {
          userid = await user.get_user_id()
        } catch {
          user_email = await user.get_user_email()
        }
      }
      const body: Record<string, string | number> = {}
      if (userid) {
        body.invitee_id = userid
      } else if (user_email) {
        body.email = user_email
      }
      if (role === 'admin') {
        body.role = 'admin'
      } else if (role === 'member') {
        body.role = 'direct_member'
      } else {
        body.role = 'direct_member'
      }
      const res = await this.post(`/orgs/${org}/invitations`, body)
      if (res.statusCode === 404) throw new Error(RepoOrPermissionDeniedMsg)
      if (res.statusCode === 422) {
        const msg = (res.data as unknown as { message: string }).message
        if (msg) {
          if (msg.includes('is not a valid permission')) throw new Error(PermissionDeniedMsg)
        }
      }
      if (res.data) {
        const OrgData: AddMemberResponseType = {
          id: res.data.inviter.id,
          login: res.data.inviterlogin,
          name: res.data.inviter.name,
          html_url: `${this.Client_Secret}/${org}`,
          role: role as 'admin' | 'member'
        }
        res.data = OrgData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 添加组织成员失败: ${(error as Error).message}`)
    }
  }
}
