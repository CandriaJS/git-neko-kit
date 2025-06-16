import {
  FailedToRemoveCollaboratorMsg,
  format_date,
  get_langage_color,
  get_remote_repo_default_branch,
  MissingRepoOwnerOrNameMsg,
  MissingUserNameParamMsg,
  OrgNotFoundMsg,
  OrgOrRepoNotFoundMsg,
  OrgOrUserNotFoundMsg,
  PermissionDeniedMsg,
  RemoveCollaboratorSuccessMsg,
  RepoNotFoundMsg,
  RepoOrPermissionDeniedMsg,
  UserNotFoundMsg
} from '@/common'
import { get_base_url } from '@/models/base'
import { GitHubClient } from '@/models/platform/github/client'
import type {
  AddCollaboratorResponseType,
  ApiResponseType,
  CollaboratorInfoResponseType,
  CollaboratorParamType,
  GetCollaboratorListParamType,
  GetCollaboratorListResponseType,
  GetRepoDefaultBranchParamType,
  GetRepoDefaultBranchResponseType,
  GetRepoMainLanguageParamType,
  GetRepoMainLanguageResponseType,
  GetRepoVisibilityParamType,
  GetRepoVisibilityResponseType,
  LanguageInfo,
  OrgRepoCreateParamType,
  OrgRepoCreateResponseType,
  OrgRepoListParmType,
  OrgRepoListResponseType,
  RemoveCollaboratorParamType,
  RemoveCollaboratorResponseType,
  RepoInfoParamType,
  RepoInfoResponseType,
  RepoLanguagesListParamType,
  RepoLanguagesListResponseType,
  UserByTokenRepoListParamType,
  UserRepoCreateParamType,
  UserRepoCreateResponseType,
  UserRepoListParamType,
  UserRepoListType
} from '@/types'

/**
 * GitHub 仓库操作类
 *
 * 提供对GitHub仓库的完整CRUD操作接口，包括：
 * - 组织/用户仓库的查询、创建、删除
 * - 仓库详细信息的获取
 * - 仓库可见性检查
 * - 支持通过URL或owner/repo两种方式操作仓库
 *
 */
export class Repo extends GitHubClient {
  constructor (base: GitHubClient) {
    super(base)
    this.userToken = base.userToken
    this.base_url = get_base_url(this.type, { proxyType: 'original' })
  }

  /**
   * 获取组织仓库列表
   * 权限: Metadata - Read-only , 如果获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - org - 组织名称
   * - type - 仓库类型，可选值：'all' | 'public' | 'private' | 'forks' | 'sources' | 'member', 默认值：'all'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 组织仓库列表
   * @example
   * ```ts
   * const repos = await repo.get_org_repos_list({ org: 'org' })
   * -> 组织仓库信息对象列表
   * ```
   */
  public async get_org_repos_list (
    options: OrgRepoListParmType
  ): Promise<ApiResponseType<OrgRepoListResponseType>> {
    if (!options.org) {
      throw new Error(OrgNotFoundMsg)
    }
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { org, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions?.type) params.type = queryOptions.type
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions?.page) params.page = queryOptions.page.toString()
      const url = `/orgs/${org}/repos`
      const res = await this.get(url, params)
      switch (res.statusCode) {
        case 404:
          throw new Error(OrgNotFoundMsg)
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
      }
      if (res.data) {
        const RepoData: OrgRepoListResponseType = await Promise.all(
          res.data.map(async (repo: Record<string, any>):Promise<RepoInfoResponseType> => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name ?? null,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              email: repo.owner.email ?? null
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
          }))
        )
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取组织仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 通过授权用户查询仓库列表
   * 权限: Metadata - read-only , 如果获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - type - 仓库类型，可选值：可选all， public， private
   * - visibility - 仓库可见性，可选值：'public' | 'private' | 'internal', 默认值：'all'
   * - affiliation - 仓库关联，可选值：'owner' | 'collaborator' | 'organization_member', 默认值：'owner,collaborator,organization_member'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 仓库详细信息
   * @example
   * ```ts
   * const repos = await repo.get_repos_list({ username: 'username' })
   * -> 用户仓库信息对象列表
   * ```
   */
  public async get_user_repos_list_by_token (
    options?: UserByTokenRepoListParamType
  ): Promise<ApiResponseType<UserRepoListType>> {
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { ...queryOptions } = options
      const params: Record<string, string> = {}
      if (!options?.visibility && !options?.affiliation && queryOptions?.type) {
        params.type = queryOptions.type
      }
      if (queryOptions?.visibility) params.visibility = queryOptions.visibility
      if (queryOptions?.affiliation) {
        params.affiliation = queryOptions.affiliation
      }
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions?.page) params.page = queryOptions.page.toString()

      const url = '/uses/repos'
      const res = await this.get(url, params)
      if (res.statusCode === 401) {
        throw new Error(RepoOrPermissionDeniedMsg)
      }
      if (res.data) {
        const RepoData: RepoInfoResponseType[] = await Promise.all(
          res.data.map(async (repo: Record<string, any>): Promise<RepoInfoResponseType> => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              email: repo.owner.email
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
          }))
        )
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取授权用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取用户仓库列表
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options - 请求参数对象
   * - username - 用户名
   * 优先获取授权用户仓库列表，若授权用户不存在则获取指定用户仓库列表
   * - type - 仓库类型，可选值：all， owner， member，, 默认值：'all'
   * - sort - 排序字段，可选值：'created' | 'updated' | 'pushed' | 'full_name', 默认值：'created'
   * - direction - 排序方向，可选值：'asc' | 'desc', 默认值：'desc'
   * - per_page - 每页数量（1-100）, 默认值：30
   * - page - 页码 默认值：1
   * @returns 用户仓库列表
   * @example
   * ```ts
   * const repos = await github.get_user_repos_list({ username: 'loli' })
   * -> 用户仓库信息对象列表
   * ```
   */
  public async get_user_repos_list (
    options: UserRepoListParamType
  ): Promise<ApiResponseType<UserRepoListType>> {
    try {
      if (!options.username) throw new Error(MissingUserNameParamMsg)
      this.setRequestConfig({
        token: this.userToken
      })
      const { username, ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions?.type) params.type = queryOptions.type
      if (queryOptions?.sort) params.sort = queryOptions.sort
      if (queryOptions?.direction) params.direction = queryOptions.direction
      if (queryOptions?.per_page) {
        params.per_page = queryOptions.per_page.toString()
      }
      if (queryOptions?.page) params.page = queryOptions.page.toString()

      const url = `/users/${username}/repos`
      const res = await this.get(url, params)

      switch (res.statusCode) {
        case 404:
          throw new Error(UserNotFoundMsg)
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
      }

      if (res.data) {
        const RepoData = await Promise.all(
          res.data.map(async (repo: Record<string, any>): Promise<RepoInfoResponseType> => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: {
              id: repo.owner.id,
              login: repo.owner.login,
              name: repo.owner.name,
              avatar_url: repo.owner.avatar_url,
              type: repo.owner.type,
              html_url: repo.owner.html_url,
              email: repo.owner.email
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

          }))
        )
        res.data = RepoData
      }

      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取用户仓库列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库信息
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options - 仓库信息参数对象，必须包含以下两种组合之一：
   * - owner 仓库拥有者
   * - repo 仓库名称
   * @example
   * ```ts
   * const repo = await repo.get_repo_info({ owner: 'owner', repo: 'repo' })
   * -> 仓库信息对象
   * ```
   */
  public async get_repo_info (
    options: RepoInfoParamType
  ): Promise<ApiResponseType<RepoInfoResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo } = options
      const res = await this.get(`/repos/${owner}/${repo}`)
      switch (res.statusCode) {
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
        case 404:
          throw new Error(OrgOrUserNotFoundMsg)
      }
      if (res.data) {
        const RepoData: RepoInfoResponseType = {
          id: res.data.id,
          name: res.data.name,
          full_name: res.data.full_name,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            avatar_url: res.data.owner.avatar_url,
            type: res.data.owner.type,
            html_url: res.data.owner.html_url,
            email: res.data.owner.email
          },
          public: !res.data.private,
          private: res.data.private,
          visibility: res.data.private ? 'private' : 'public',
          fork: res.data.fork,
          archived: res.data.archived,
          disabled: res.data.disabled,
          html_url: res.data.html_url,
          description: res.data.description,
          stargazers_count: res.data.stargazers_count,
          watchers_count: res.data.watchers_count,
          language: res.data.language,
          forks_count: res.data.forks_count,
          open_issues_count: res.data.open_issues_count,
          default_branch: res.data.default_branch,
          created_at: this.format
            ? await format_date(res.data.created_at)
            : res.data.created_at,
          updated_at: this.format
            ? await format_date(res.data.updated_at)
            : res.data.updated_at,
          pushed_at: this.format
            ? await format_date(res.data.pushed_at)
            : res.data.pushed_at
        }
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库信息失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库语言列表
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options - 仓库信息参数对象，必须包含以下两种组合之一：
   * - owner 仓库拥有者
   * - repo 仓库名称
   * @example
   * ```ts
   * const repo = await repo.get_repo_languages_list({ owner: 'owner', repo: 'repo' })
   * -> 仓库语言对象列表
   * ```
   */
  public async get_repo_languages_list (
    options: RepoLanguagesListParamType
  ): Promise<ApiResponseType<RepoLanguagesListResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo } = options
      const res = await this.get(`/repos/${owner}/${repo}/languages`)
      switch (res.statusCode) {
        case 401:
          throw new Error(RepoOrPermissionDeniedMsg)
        case 404:
          throw new Error(RepoNotFoundMsg)
      }
      if (res.data) {
        const entries = Object.entries(res.data)
        const totalBytes = entries.reduce((sum, [, bytes]) => sum + (bytes as number), 0)

        const languages: LanguageInfo[] = entries.map(([language, bytes]): LanguageInfo => ({
          language,
          color: get_langage_color(language.toLowerCase()),
          percent: Number(((bytes as number / totalBytes) * 100).toFixed(2)),
          bytes: bytes as number
        }))
        const LanguagesData: RepoLanguagesListResponseType = {
          languages
        }
        res.data = LanguagesData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库语言列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建组织仓库
   * 权限：
   * - Administration: Read and write
   * @param options 创建组织仓库参数
   * - org: 组织名称
   * - name: 仓库名称
   * - description: 仓库描述
   * - homepage: 仓库主页URL
   * - visibility: 仓库可见性，可选值：'public' | 'private', 默认值：'public'
   * - has_issues: 是否启用issues功能, 默认值：true
   * - has_wiki: 是否启用wiki功能, 默认值：true
   * - auto_init: 是否自动初始化仓库 默认值：false
   * @returns 返回创建成功的仓库信息
   * @example
   * ```ts
   * const repoInfo = await org.create_org_repo({org: 'loli', repo: 'git-neko-kit'})
   * -> 创建组织仓库信息对象
   * ```
   */
  public async create_org_repo (
    options: OrgRepoCreateParamType
  ): Promise<ApiResponseType<OrgRepoCreateResponseType>> {
    try {
      const { org, ...repoOptions } = options
      if (!org || !options.name) throw new Error(OrgOrRepoNotFoundMsg)
      const body: Record<string, string | boolean> = {}
      body.name = repoOptions.name
      if (repoOptions.description) body.description = repoOptions.description.toString()
      if (repoOptions.homepage) body.homepage = repoOptions.homepage.toString()
      if (repoOptions.visibility) body.private = repoOptions.visibility.toString()
      if (repoOptions.has_wiki) body.has_wiki = repoOptions.has_wiki
      if (repoOptions.auto_init) body.auto_init = repoOptions.auto_init
      const res = await this.post(`/orgs/${org}/repos`, body)
      if (res.statusCode === 401) {
        throw new Error(RepoOrPermissionDeniedMsg)
      }
      if (res.data) {
        const RepoData: OrgRepoCreateResponseType = {
          id: res.data.id,
          name: res.data.name,
          full_name: res.data.full_name,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            avatar_url: res.data.owner.avatar_url,
            type: res.data.owner.type,
            html_url: res.data.owner.html_url,
            email: res.data.owner.email
          },
          public: !res.data.private,
          private: res.data.private,
          visibility: res.data.private ? 'private' : 'public',
          fork: res.data.fork,
          archived: res.data.archived,
          disabled: res.data.disabled,
          html_url: res.data.html_url,
          description: res.data.description,
          stargazers_count: res.data.stargazers_count,
          watchers_count: res.data.watchers_count,
          language: res.data.language,
          forks_count: res.data.forks_count,
          open_issues_count: res.data.open_issues_count,
          default_branch: res.data.default_branch,
          created_at: this.format
            ? await format_date(res.data.created_at)
            : res.data.created_at,
          updated_at: this.format
            ? await format_date(res.data.updated_at)
            : res.data.updated_at,
          pushed_at: this.format
            ? await format_date(res.data.pushed_at)
            : res.data.pushed_at
        }
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 创建组织仓库失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建用户仓库
   * 权限：
   * - Administration: Read and write
   * @param options 创建组织仓库参数
   * - owner: 仓库拥有者，用户名称
   * - name: 仓库名称
   * - description: 仓库描述
   * - homepage: 仓库主页URL
   * - visibility: 仓库可见性，可选值：'public' | 'private', 默认值：'public'
   * - has_issues: 是否启用issues功能, 默认值：true
   * - has_wiki: 是否启用wiki功能, 默认值：true
   * - auto_init: 是否自动初始化仓库 默认值：false
   * @returns 返回创建成功的仓库信息
   * @example
   * ```ts
   * const repoInfo = await repo.create_user_repo({org: 'loli', repo: 'git-neko-kit'})
   * -> 创建用户仓库信息对象
   * ```
   */
  public async create_user_repo (
    options: UserRepoCreateParamType
  ): Promise<ApiResponseType<UserRepoCreateResponseType>> {
    try {
      const { owner, ...repoOptions } = options
      if (!owner || !options.name) throw new Error(MissingRepoOwnerOrNameMsg)
      const body: Record<string, string | boolean> = {}
      body.name = repoOptions.name
      if (repoOptions.description) body.description = repoOptions.description.toString()
      if (repoOptions.homepage) body.homepage = repoOptions.homepage.toString()
      if (repoOptions.visibility === 'private') body.private = true
      if (repoOptions.has_wiki) body.has_wiki = repoOptions.has_wiki
      if (repoOptions.auto_init) body.auto_init = repoOptions.auto_init
      const res = await this.post('/user/repos', body)
      if (res.statusCode === 401) {
        throw new Error(RepoOrPermissionDeniedMsg)
      }
      if (res.data) {
        const RepoData: OrgRepoCreateResponseType = {
          id: res.data.id,
          name: res.data.name,
          full_name: res.data.full_name,
          owner: {
            id: res.data.owner.id,
            login: res.data.owner.login,
            name: res.data.owner.name,
            avatar_url: res.data.owner.avatar_url,
            type: res.data.owner.type,
            html_url: res.data.owner.html_url,
            email: res.data.owner.email
          },
          public: !res.data.private,
          private: res.data.private,
          visibility: res.data.private ? 'private' : 'public',
          fork: res.data.fork,
          archived: res.data.archived,
          disabled: res.data.disabled,
          html_url: res.data.html_url,
          description: res.data.description,
          stargazers_count: res.data.stargazers_count,
          watchers_count: res.data.watchers_count,
          language: res.data.language,
          forks_count: res.data.forks_count,
          open_issues_count: res.data.open_issues_count,
          default_branch: res.data.default_branch,
          created_at: this.format
            ? await format_date(res.data.created_at)
            : res.data.created_at,
          updated_at: this.format
            ? await format_date(res.data.updated_at)
            : res.data.updated_at,
          pushed_at: this.format
            ? await format_date(res.data.pushed_at)
            : res.data.pushed_at
        }
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 创建用户仓库失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建用户仓库
   * @deprecated 请使用create_user_repo方法
   * 权限：
   * - Administration: Read and write
   * @param options 创建组织仓库参数
   * - owner: 仓库拥有者，用户名称
   * - name: 仓库名称
   * - description: 仓库描述
   * - homepage: 仓库主页URL
   * - visibility: 仓库可见性，可选值：'public' | 'private', 默认值：'public'
   * - has_issues: 是否启用issues功能, 默认值：true
   * - has_wiki: 是否启用wiki功能, 默认值：true
   * - auto_init: 是否自动初始化仓库 默认值：false
   * @returns 返回创建成功的仓库信息
   */
  public async create_repo (
    options: UserRepoCreateParamType
  ): Promise<ApiResponseType<RepoInfoResponseType>> {
    return this.create_user_repo(options)
  }

  /**
   * 获取协作者列表
   * 权限：
   * - Metadata: Read
   * @param options 获取协作者列表对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * url和owner、repo参数传入其中的一种
   * - affiliation: 协作者类型，可选outside, direct, all，默认为all
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
   * - per_page: 每页数量，默认为30
   * - page: 页码，默认为1
   * @returns 返回获取协作者列表结果
   * @example
   * ```ts
   * const result = await collaborator.get_collaborators_list(options)
   * -> 仓库协作者信息对象列表
   * ```
   */
  public async get_collaborators_list (
    options: GetCollaboratorListParamType
  ): Promise<ApiResponseType<GetCollaboratorListResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo } = options
      const { ...queryOptions } = options
      const params: Record<string, string> = {}
      if (queryOptions.affiliation) params.milestone = queryOptions.affiliation.toString()
      if (queryOptions.permission) params.permission = queryOptions.permission.toString()
      if (queryOptions.per_page) params.per_page = queryOptions.per_page.toString()
      if (queryOptions.page) params.page = queryOptions.page.toString()
      const res = await this.get(`/repos/${owner}/${repo}/collaborators`, params)
      if (res.data) {
        const RepoData = await Promise.all(
          res.data.map((repo: Record<string, any>): CollaboratorInfoResponseType => ({
            id: repo.id,
            login: repo.login,
            avatar_url: repo.avatar_url,
            email: repo.email,
            name: repo.name,
            permissions: repo.permissions === 'triage' || repo.permissions === 'maintain'
              ? 'admin'
              : repo.permissions
          }))
        )
        res.data = RepoData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库协作者列表失败: ${(error as Error).message}`)
    }
  }

  /**
   * 邀请协作者
   * 权限：
   * - Administration: Read and write
   * @param options 邀请协作者对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - url: 仓库地址
   * owner和repo或者url选择一个即可
   * - username: 要邀请协作者用户名
   * - permission: 协作者权限，可选pull，triage, push, maintain, admin，默认为pull
   * @returns 返回邀请协作者结果
   * @example
   * ```ts
   * const result = await collaborator.add_collaborator({
   *  owner: 'owner',
   *  repo: 'repo',
   *  username: 'username',
   *  permission: 'pull'
   * })
   * -> 邀请仓库协作者信息对象
   * ```
   */
  public async add_collaborator (
    options: CollaboratorParamType
  ): Promise<ApiResponseType<AddCollaboratorResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, username, permission } = options
      const body : Record<string, string> = {}
      if (permission === 'pull') {
        body.permission = 'pull'
      } else if (permission === 'push') {
        body.permission = 'push'
      } else if (permission === 'admin') {
        body.permission = 'admin'
      } else {
        body.permission = 'pull'
      }
      const res = await this.put(`/repos/${owner}/${repo}/collaborators/${username}`, body)
      if (res.statusCode === 404) throw new Error(RepoOrPermissionDeniedMsg)
      if (res.statusCode === 422) {
        const msg = (res.data as unknown as { message: string }).message
        if (msg) {
          if (msg.includes('is not a valid permission')) throw new Error(PermissionDeniedMsg)
        }
      }

      if (res.data) {
        const collaboratorData: AddCollaboratorResponseType = {
          id: res.data.inviter.id,
          login: res.data.inviter.login,
          name: res.data.inviter.name,
          html_url: res.data.repository.html_url,
          permissions: res.data.permissions
        }
        res.data = collaboratorData
      }
      return res
    } catch (error) {
      throw new Error(`[GitHub] 添加协作者失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除协作者
   * 权限：
   * - Administration: Read and write
   * @param options 删除协作者对象
   * - owner: 仓库拥有者
   * - repo: 仓库名称
   * - username: 要删除协作者用户名
   * @returns 返回删除协作者结果
   * @example
   * ```ts
   * const result = await collaborator.remove_collaborator({
   *  owner: 'owner',
   *  repo:'repo',
   *  username: 'username'
   * })
   * -> 移除仓库协作者信息对象
   * ```
   */
  public async remove_collaborator (
    options: RemoveCollaboratorParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      this.setRequestConfig({
        token: this.userToken
      })
      const { owner, repo, username } = options
      const res = await this.delete(`/repos/${owner}/${repo}/collaborators/${username}`)
      if (res.statusCode === 404) throw new Error(RepoOrPermissionDeniedMsg)
      let repoData: RemoveCollaboratorResponseType
      if (res.status && res.statusCode === 204) {
        repoData = {
          success: true,
          message: RemoveCollaboratorSuccessMsg(username)
        }
      } else {
        repoData = {
          success: false,
          message: FailedToRemoveCollaboratorMsg(username)
        }
      }
      res.data = repoData
      return res
    } catch (error) {
      throw new Error(`[GitHub] 移除协作者失败: ${(error as Error).message}`)
    }
  }

  /**
   * 删除协作者
   * @deprecated 请使用remove_collaborator方法
   * @param options 删除协作者对象
   * @returns 返回删除协作者结果
  */
  public async delete_collaborator (
    options: RemoveCollaboratorParamType
  ): Promise<ApiResponseType<RemoveCollaboratorResponseType>> {
    return this.remove_collaborator(options)
  }

  /**
   * 快速获取仓库可见性
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @remarks 优先使用url参数，若url参数不存在则使用owner和repo参数
   * @returns 仓库可见性，
   * @example
   * ```ts
   * // 公开仓库
   * const visibility = await repo.get_repo_visibility({url: 'https://github.com/CandriaJS/git-neko-kit'})
   * -> 'public'
   * // 私有仓库
   * const visibility = await repo.get_repo_visibility({url: 'https://github.com/CandriaJS/git-neko-kit'})
   * -> 'private'
   * ```
   */
  public async get_repo_visibility (
    options: GetRepoVisibilityParamType
  ): Promise<GetRepoVisibilityResponseType> {
    try {
      const { owner, repo } = options
      return (await this.get_repo_info({ owner, repo })).data.visibility
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库可见性失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库默认分支
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - owner 仓库拥有者
   * - repo 仓库名称
   * @example
   * ```ts
   * const defaultBranch = await repo.get_repo_default_branch({owner: CandriaJS, repo: meme-plugin)}
   * -> 'main'
   * ```ts
   */
  public async get_repo_default_branch (
    options: GetRepoDefaultBranchParamType
  ): Promise<GetRepoDefaultBranchResponseType | null> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      const { owner, repo } = options
      let default_branch
      try {
        const github_url = this.base_url + '/' + owner + '/' + repo
        default_branch = await get_remote_repo_default_branch(github_url)
      } catch (error) {
        default_branch = (await this.get_repo_info({ owner, repo })).data.default_branch
      }

      return default_branch
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库默认分支失败: ${(error as Error).message}`)
    }
  }

  /**
   * 获取仓库主要语言
   * 权限:
   * - Metadata: Read-only, 如果只获取公开仓库可无需此权限
   * @param options
   * - url 仓库URL地址
   * - owner 仓库拥有者
   * - repo 仓库名称
   * url参数和owner、repo参数传入其中的一种
   * @example
   * ```ts
   * const language =  await repo.get_repo_language({url: 'URL_ADDRESS.com/CandriaJS/meme-plugin')}
   * -> 'JavaScript'
   * ```ts
   */
  public async get_repo_main_language (
    options: GetRepoMainLanguageParamType
  ): Promise<GetRepoMainLanguageResponseType> {
    if (!options.owner || !options.repo) throw new Error(MissingRepoOwnerOrNameMsg)
    try {
      const { owner, repo } = options
      return (await this.get_repo_info({ owner, repo })).data.language
    } catch (error) {
      throw new Error(`[GitHub] 获取仓库语言失败: ${(error as Error).message}`)
    }
  }
}
