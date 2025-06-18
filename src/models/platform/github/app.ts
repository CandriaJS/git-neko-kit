import { capitalize, isEmpty } from 'lodash'

import {
  FailedRevokeAppAccrssTokenMsg,
  format_date,
  MissingAccessTokenMsg,
  MissingAppClientMsg,
  MissingAppInstallIdMsg,
  MissingAppSlugMsg,
  MissingOrgParamMsg,
  MissingRepoOwnerOrNameMsg,
  MissingUserNameParamMsg,
  RepoMovedMsg,
  RepoNotFoundMsg,
  RevokeAccessTokenSuccessMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import {
  type AccessTokenPermissionsType,
  type ApiResponseType,
  type AppInfoParamType,
  type AppInfoResponseType,
  type CreateAccessTokenForAppParamType,
  type CreateAccessTokenForAppResponseType,
  type GetAppInfoByOrgParamType,
  type GetAppInfoByOrgResponseType,
  type GetAppInfoByRepoParamType,
  type GetAppInfoByRepoResponseType,
  type GetAppInfoByUserParamType,
  type GetAppInfoByUserResponseType,
  type isAppInstalledInRepo,
  ProxyType,
  type RepoInfoResponseType,
  type RevokeAccessTokenResponseType
} from '@/types'

/**
 * GitHub 应用管理类
 *
 * 提供对GitHub App的完整管理功能，包括：
 * - 获取应用基本信息
 * - 生成应用安装链接
 * - 生成应用配置链接
 *
 */
export class App extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.base_url = get_base_url(this.type, { proxyType: ProxyType.Original })
  }

  /**
   * 获取应用基本信息
   * 权限：
   * - `none` 无
   * @param options - 应用标识符
   * @returns 应用基本信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_info({ app_slug: 'loli' }))
   * -> app的信息
   * ```
   */
  public async get_app_info (
    options: AppInfoParamType
  ): Promise<ApiResponseType<AppInfoResponseType>> {
    if (!options.app_slug) throw new Error(MissingAppSlugMsg)
    if (!this.userToken) throw new Error(MissingAccessTokenMsg)
    try {
      this.setRequestConfig(
        {
          token: this.userToken
        })
      const { app_slug } = options
      const res = await this.get(`/apps/${app_slug}`)
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const AppData: AppInfoResponseType = {
          id: res.data.id,
          name: res.data.name,
          client_id: res.data.client_id,
          slug: res.data.slug,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: isEmpty(res.data.owner.name) ? null : res.data.owner.name,
            email: isEmpty(res.data.owner.email) ? null : res.data.owner.email,
            html_url: res.data.owner.html_url,
            avatar_url: res.data.owner.avatar_url,
            type: capitalize(res.data.owner.type.toLowerCase())
          },
          description: res.data.description,
          external_url: res.data.external_url,
          html_url: res.data.html_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取当前 Github App 信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @returns 返回 Github App 信息
   * @example
   * ```ts
   * const app = base.get_app()
   * console.log(app.get_app_info_by_auth())
   * -> app的信息
   * ```
   */
  public async get_app_info_by_auth ()
    : Promise<ApiResponseType<AppInfoResponseType>> {
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      const res = await this.get('/app')
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const AppData: AppInfoResponseType = {
          id: res.data.id,
          name: res.data.name,
          client_id: res.data.client_id,
          slug: res.data.slug,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: isEmpty(res.data.owner.name) ? null : res.data.owner.name,
            email: isEmpty(res.data.owner.email) ? null : res.data.owner.email,
            html_url: res.data.owner.html_url,
            avatar_url: res.data.owner.avatar_url,
            type: capitalize(res.data.owner.type.toLowerCase())
          },
          description: res.data.description,
          external_url: res.data.external_url,
          html_url: res.data.html_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库的应用安装信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * @returns 返回应用安装信息
   * @example
   * ```ts
   * console.log(app.get_app_installation_by_repo({owner: 'owner', repo: 'repo'}))
   * -> 仓库安装应用信息
   * ```
   */

  public async get_app_installation_by_repo (
    options: GetAppInfoByRepoParamType
  ): Promise<ApiResponseType<GetAppInfoByRepoResponseType>> {
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      const { owner, repo } = options
      const res = await this.get(`/repos/${owner}/${repo}/installation`)
      switch (res.statusCode) {
        case 404:
          throw new Error(RepoNotFoundMsg)
        case 301:
          throw new Error(RepoMovedMsg)
      }
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const AppData: GetAppInfoByRepoResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          app_id: res.data.app_id,
          app_slug: res.data.app_slug,
          target_id: res.data.target_id,
          target_type: res.data.target_type,
          account: {
            id: res.data.account.id,
            login: res.data.account.login,
            name: isEmpty(res.data.account.name) ? null : res.data.account.name,
            email: isEmpty(res.data.account.email) ? null : res.data.account.email,
            html_url: res.data.account.html_url,
            avatar_url: res.data.account.avatar_url,
            type: capitalize(res.data.account.type.toLowerCase())
          },
          repository_selection: res.data.repository_selection,
          access_tokens_url: res.data.access_tokens_url,
          repositories_url: res.data.repositories_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取存储库安装应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取用户的应用安装信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * @returns 返回应用安装信息
   * @example
   * ```ts
   * console.log(app.get_app_installation_by_repo({owner: 'owner', repo: 'repo'}))
   * -> 用户安装应用信息
   * ```
   */

  public async get_app_installation_by_user (
    options: GetAppInfoByUserParamType
  ): Promise<ApiResponseType<GetAppInfoByUserResponseType>> {
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    if (!options.username) throw new Error(MissingUserNameParamMsg)
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      const { username } = options
      const res = await this.get(`/users/${username}/installation`)
      switch (res.statusCode) {
        case 404:
          throw new Error(RepoNotFoundMsg)
        case 301:
          throw new Error(RepoMovedMsg)
      }
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const AppData: GetAppInfoByUserResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          app_id: res.data.app_id,
          app_slug: res.data.app_slug,
          target_id: res.data.target_id,
          target_type: res.data.target_type,
          account: {
            id: res.data.account.id,
            login: res.data.account.login,
            name: isEmpty(res.data.account.name) ? null : res.data.account.name,
            email: isEmpty(res.data.account.email) ? null : res.data.account.email,
            html_url: res.data.account.html_url,
            avatar_url: res.data.account.avatar_url,
            type: capitalize(res.data.account.type.toLowerCase())
          },
          repository_selection: res.data.repository_selection,
          access_tokens_url: res.data.access_tokens_url,
          repositories_url: res.data.repositories_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取存储库安装应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取组织的应用安装信息
   * 权限：
   * - `none` 此节点仅App Client可用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * @returns 返回应用安装信息
   * @example
   * ```ts
   * console.log(app.get_app_installation_by_repo({owner: 'owner', repo: 'repo'}))
   * -> 组织安装应用信息
   * ```
   */

  public async get_app_installation_by_org (
    options: GetAppInfoByOrgParamType
  ): Promise<ApiResponseType<GetAppInfoByOrgResponseType>> {
    if (!this.is_app_client) throw new Error(MissingAppClientMsg)
    if (!options.org) throw new Error(MissingOrgParamMsg)
    try {
      this.setRequestConfig(
        {
          token: this.jwtToken
        })
      const { org } = options
      const res = await this.get(`/orgs/${org}/installation`)
      switch (res.statusCode) {
        case 404:
          throw new Error(RepoNotFoundMsg)
        case 301:
          throw new Error(RepoMovedMsg)
      }
      if (res.data) {
        const [
          createdAt,
          updatedAt
        ] = await Promise.all([
          this.format ? format_date(res.data.created_at) : res.data.created_at,
          this.format ? format_date(res.data.updated_at) : res.data.updated_at
        ])
        const AppData: GetAppInfoByOrgResponseType = {
          id: res.data.id,
          html_url: res.data.html_url,
          app_id: res.data.app_id,
          app_slug: res.data.app_slug,
          target_id: res.data.target_id,
          target_type: res.data.target_type,
          account: {
            id: res.data.account.id,
            login: res.data.account.login,
            name: isEmpty(res.data.account.name) ? null : res.data.account.name,
            email: isEmpty(res.data.account.email) ? null : res.data.account.email,
            html_url: res.data.account.html_url,
            avatar_url: res.data.account.avatar_url,
            type: capitalize(res.data.account.type.toLowerCase())
          },
          repository_selection: res.data.repository_selection,
          access_tokens_url: res.data.access_tokens_url,
          repositories_url: res.data.repositories_url,
          permissions: res.data.permissions,
          events: res.data.events,
          created_at: createdAt,
          updated_at: updatedAt
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取存储库安装应用信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 为应用程序创建访问令牌
   * @param options
   * - installation_id - 安装 ID
   * @returns 创建访问令牌对象
   * @example
   * ```ts
   * const accessToken = await app.create_access_token_for_app({ installation_id: 123456 })
   * -> 创建访问令牌对象
   * ```
   */
  public async create_access_token_for_app (
    options: CreateAccessTokenForAppParamType
  ): Promise<ApiResponseType<CreateAccessTokenForAppResponseType>> {
    if (!options.installation_id) throw new Error(MissingAppInstallIdMsg)
    try {
      this.setRequestConfig({
        token: this.jwtToken
      })
      const body: Record<string, string | Array<number> | Array<string> | AccessTokenPermissionsType> = {}
      if (options.repositories) body.repositories = options.repositories
      if (options.repository_ids) body.repository_ids = options.repository_ids
      if (options.permissions) body.permissions = options.permissions
      const res = await this.post(`app/installations/${options.installation_id}/access_tokens`, body)
      if (res.statusCode === 201 && res.data) {
        const expiresAt = this.format ? await format_date(res.data.expires_at) : res.data.expires_at
        const AppData: CreateAccessTokenForAppResponseType = {
          token: res.data.token,
          expires_at: expiresAt,
          permissions: res.data.permissions,
          repository_selection: res.data.repository_selection,
          repositories: await Promise.all(res.data.repositories.map(async (repo: Record<string, any>): Promise<RepoInfoResponseType> => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: isEmpty(res.data.owner.name) ? null : res.data.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url
            },
            public: !repo.private,
            private: repo.private,
            visibility: repo.private ? 'private' : 'public',
            fork: repo.fork,
            archived: repo.archived,
            disabled: repo.disabled,
            html_url: repo.html_url,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            default_branch: repo.default_branch,
            created_at: this.format
              ? await format_date(repo.created_at)
              : repo.created_at,
            updated_at: this.format
              ? await format_date(repo.updated_at)
              : repo.updated_at,
            pushed_at: this.format
              ? await format_date(repo.pushed_at)
              : repo.pushed_at
          })
          ))
        }
        res.data = AppData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 为应用程序创建访问令牌失败: ${(error as Error).message}`)
    }
  }

  /**
   * 撤销应用程序访问令牌
   * @returns 撤销应用程序访问令牌
   * @example
   * ```ts
   * const res = await auth.revoke_access_token_for_app()
   * -> data: { 'success': true, 'message': '喵呜~ 访问令牌撤销成功' }
   */
  public async revoke_access_token_for_app (
  ): Promise<ApiResponseType<RevokeAccessTokenResponseType>> {
    this.setRequestConfig({
      token: this.jwtToken
    })
    const res = await this.delete('/installation/token')
    let success: boolean = false
    let status: 'ok' | 'error' = 'error'
    let msg: string
    let statusCode = 400
    let RevokeAccessTokenData: RevokeAccessTokenResponseType
    if (res.statusCode === 201) {
      success = true
      status = 'ok'
      statusCode = 200
      msg = '请求成功'
      RevokeAccessTokenData = {
        success,
        message: RevokeAccessTokenSuccessMsg
      }
    } else {
      success = false
      status = 'error'
      statusCode = 403
      msg = '请求失败'
      RevokeAccessTokenData = {
        success,
        message: FailedRevokeAppAccrssTokenMsg
      }
    }
    return Promise.resolve(
      {
        success,
        status,
        statusCode,
        msg,
        data: RevokeAccessTokenData
      }
    )
  }

  /**
   * 生成Github App 安装链接
   * @param state_id - 随机生成的 state_id，用于验证授权请求的状态，可选，默认不使用
   * @returns install_link 安装链接，用于跳转 Github 安装页
   * @example
   * ```ts
   * const link = await app.create_install_link('state_id')
   * -> https://github.com/apps/<app_name>/installations/new?state=<state_id>
   * ```
   */
  public async create_install_link (state_id?: string): Promise<string> {
    try {
      if (!this.is_app_client) throw new Error(MissingAppClientMsg)
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.base_url)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`[GitHub] 生成应用安装链接失败: ${(error as Error).message}`)
    }
  }

  /**
    * 生成Github Apps 配置链接
    * @param state_id - 传入的 state_id, 随机字符串
    * @returns 返回配置链接对象
    * @returns config_install_link 配置链接
    * @example
    * ```ts
    * const link = await app.create_config_install_link('state_id')
    * -> // https://github.com/apps/<app_name>/installations/new?state=<state_id></state_id>
    * ```
    */
  public async create_config_install_link (state_id?: string): Promise<string> {
    try {
      if (!this.is_app_client) throw new Error(MissingAppClientMsg)
      const url = new URL(`apps/${await this.get_app_name()}/installations/new`, this.base_url)
      url.search = new URLSearchParams({
        ...(state_id && { state: state_id })
      }).toString()
      return url.toString()
    } catch (error) {
      throw new Error(`[GitHub] 生成应用配置链接失败: ${(error as Error).message}`)
    }
  }

  /**
   * 快速获取当前 Github App 名称
   * @returns 返回 Github App 名称
   * @example
   * ```ts
   * console.log(app.get_app_name())
   * ->  输出AppName
   * ```
   */
  public async get_app_name (): Promise<string> {
    return (await this.get_app_info_by_auth()).data.name
  }

  /**
   * 快速判断指定仓库是否安装了当前App 应用
   * @param options - 仓库安装应用参数对象
   * - owner 拥有者
   * - repo 仓库名
   * @returns 是否安装
   * @example
   * ```ts
   * // 当前App已安装在此仓库
   * const isInstalled = await app.is_app_inttalled_in_repo({ owner: 'owner', repo: 'repo' })
   * -> true
   * // 当前App未安装此仓库
   * const isInstalled = await app.is_app_inttalled_in_repo({ owner: 'owner', repo: 'repo' })
   * -> false
   */
  public async is_app_installed_in_repo (
    options: isAppInstalledInRepo
  ): Promise<boolean> {
    try {
      const res = await this.get_app_installation_by_repo({
        owner: options.owner,
        repo: options.repo
      })
      return !!res
    } catch {
      return false
    }
  }
}
