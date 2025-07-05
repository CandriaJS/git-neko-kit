/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { capitalize } from 'radash'

import {
  get_contribution_data,
  MissingAccessTokenMsg,
  MissingUserIdParamMsg,
  MissingUserNameParamMsg,
  OrgNotSupportedMsg,
  OrgOrUserNotFoundMsg,
  PermissionDeniedMsg,
  UserNotFoundMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import {
  ApiResponseType,
  ContributionResult,
  ProxyType,
  UserInfoByIdParamType,
  UserInfoParamType,
  UserInfoResponseType,
  UserNameParamType
} from '@/types'

/**
 * Base 用户操作类
 *
 * 提供对GitHub用户的CRUD操作，包括：
 * - 获取用户信息
 * - 关注指定用户
 */
export class User extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.base_url = base.base_url
    this.api_url = base.api_url
  }

  /**
   * 获取指定的用户信息
   * 不止可以获取用户信息还可以获取组织信息
   * 权限：无需任何权限
   * @param options - 用户参数
   * - username - 用户名或组织名
   * @example
   * ```ts
   * const userInfo = await user.get_user_info({ username: 'username' })
   * -> 用户信息对象
   * ```
   */
  public async get_user_info (
    options: UserInfoParamType
  ):Promise<ApiResponseType<UserInfoResponseType>> {
    if (!options.username) {
      throw new Error(OrgOrUserNotFoundMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/users/${options.username}`)
      if (res.statusCode === 401) {
        throw new Error(PermissionDeniedMsg)
      } else if (res.statusCode === 404) {
        throw new Error(OrgOrUserNotFoundMsg)
      }
      if (res.data) {
        const UserData: UserInfoResponseType = {
          id: res.data.id,
          login: res.data.login,
          name: res.data.name || null,
          type: capitalize(res.data.type.toLowerCase()),
          html_url: res.data.html_url,
          avatar_url: res.data.avatar_url,
          email: res.data.email || null,
          bio: res.data.bio || null,
          blog: res.data.blog || null,
          public_repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following
        }
        res.data = UserData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取用户织信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过用户id获取用户信息
   * user_id 不是用户名, 而是github平台上用户的唯一标识符
   * 权限：无需任何权限
   * @param options - 用户参数
   * - user_id： 用户id
   * @returns 用户信息
   * @example
   * ```ts
   * const userInfo = await user.get_user_info_by_user_id({ user_id: 123456789 })
   * -> 用户信息对象
   * ```
   */
  public async get_user_info_by_user_id (
    options: UserInfoByIdParamType
  ):Promise<ApiResponseType<UserInfoResponseType>> {
    if (!options.user_id) {
      throw new Error(MissingUserIdParamMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get(`/user/${options.user_id}`)
      if (res.statusCode === 401) {
        throw new Error(PermissionDeniedMsg)
      } else if (res.statusCode === 404) {
        throw new Error(UserNotFoundMsg)
      }
      if (res.data) {
        const UserData: UserInfoResponseType = {
          id: res.data.id,
          login: res.data.login,
          name: res.data.name || null,
          type: capitalize(res.data.type.toLowerCase()),
          html_url: res.data.html_url,
          avatar_url: res.data.avatar_url,
          email: res.data.email || null,
          bio: res.data.bio || null,
          blog: res.data.blog || null,
          public_repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following
        }
        res.data = UserData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 通过用户id获取用户信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过访问令牌获取用户信息
   * 权限：无需任何权限
   * @example
   * ```ts
   * const userInfo = await user.get_user_info_by_token()
   * -> 用户信息对象
   * ```
   */
  public async get_user_info_by_auth ():
  Promise<ApiResponseType<UserInfoResponseType>> {
    if (!this.userToken) {
      throw new Error(MissingAccessTokenMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const res = await this.get('/user')
      switch (res.statusCode) {
        case 401:
          throw new Error(PermissionDeniedMsg)
        case 404:
          throw new Error(UserNotFoundMsg)
      }
      if (res.data) {
        const UserData: UserInfoResponseType = {
          id: res.data.id,
          login: res.data.login,
          name: res.data.name || null,
          type: capitalize(res.data.type.toLowerCase()),
          html_url: res.data.html_url,
          avatar_url: res.data.avatar_url,
          email: res.data.email || null,
          bio: res.data.bio || null,
          blog: res.data.blog || null,
          public_repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following
        }
        res.data = UserData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取授权用户信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过访问令牌获取用户信息
   * 权限：无需任何权限
   * @deprecated 该方法已过时，请使用get_user_info_by_auth方法牌
   * ```
   */

  public async get_user_info_by_token ():
  Promise<ApiResponseType<UserInfoResponseType>> {
    return this.get_user_info_by_auth()
  }

  /**
   * 获取用户贡献数据
   * 权限：无需任何权限
   * @param options - 用户参数
   * - username: 用户名
   * @returns 用户贡献数据
   * @example
   * ```ts
   * const contribution = await user.get_user_contribution({ username: 'username' })
   * ->
   * {
   * success: true,
   * status: 'ok',
   * statusCode: 200,
   * msg: '请求成功',
   * data: { total: 5, contributions: [[{ date: '2023-04-16', count: 5 }]] }
   * }
   * ```
   */
  public async get_user_contribution (options: UserNameParamType):
  Promise<ApiResponseType<ContributionResult>> {
    try {
      if (!options.username) {
        throw new Error(MissingUserNameParamMsg)
      }
      const userInfo = await this.get_user_info({ username: options.username })
      if (userInfo.data.type === 'Organization') {
        throw new Error(`${OrgNotSupportedMsg}获取贡献日历`)
      }
      this.setRequestConfig({
        url: get_base_url(this.type, { proxyType: ProxyType.Original })
      })
      const res = await this.get(`/${options.username}`, {
        action: 'show',
        controller: 'profiles',
        tab: 'contributions',
        user_id: options.username
      }, {
        'X-Requested-With': 'XMLHttpRequest'
      })
      if (!res.success) throw new Error('获取用户贡献数据失败')
      if (res.statusCode === 404) {
        throw new Error(MissingUserNameParamMsg)
      }

      const ContributionData = await get_contribution_data(res.data)
      return {
        ...res,
        data: ContributionData
      }
    } catch (error) {
      throw new Error(`[GitHub] 获取用户贡献信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取获取用户id
   * 权限：无需任何权限
   * 该方法会自动获取当前用户的id，需要传入token
   * @returns 用户id
   * @example
   * ```ts
   * const userId = await user.get_user_id()
   * -> 114514
   */
  public async get_user_id (): Promise<number> {
    return (await this.get_user_info_by_auth()).data.id
  }

  /**
   * 快速获取获取用户名
   * 权限：无需任何权限
   * 该方法会自动获取当前用户的用户名，需要传入token
   * @returns 用户名
   * @example
   * ```ts
   * const username = await user.get_username()
   * -> 'loli'
   * ```
   */
  public async get_username (): Promise<string> {
    return (await this.get_user_info_by_auth()).data.login
  }

  /**
   * 快速获取获取用户昵称
   * 该方法会自动获取当前用户的昵称，需要传入token
   * 权限：无需任何权限
   * @returns 昵称
   * @example
   * ```ts
   * const nickname = await user.get_nickname()
   * -> 'loli'
   * ```
   */
  public async get_nickname (): Promise<string | null> {
    return (await this.get_user_info_by_auth()).data.name || null
  }

  /**
   * 快速获取获取用户邮箱
   * 该方法会自动获取当前用户的邮箱，需要传入token
   * 权限：无需任何权限
   * @returns 邮箱
   * @example
   * ```ts
   * const email = await user.get_email()
   * -> '114514@gmail.com'
   * ```
   */
  public async get_user_email (): Promise<string | null> {
    return (await this.get_user_info_by_auth()).data.email || null
  }

  /**
   * 快速获取获取用户头像地址
   * 该方法会自动获取当前用户的头像地址，需要传入token
   * 权限：无需任何权限
   * @returns 头像地址
   * @example
   * ```ts
   * const avatarUrl = await user.get_avatar_url()
   * -> 'https://avatars.githubusercontent.com/u/12345678?v=4'
   * ```
   */
  public async get_avatar_url (): Promise<string> {
    return (await this.get_user_info_by_auth()).data.avatar_url
  }
}
