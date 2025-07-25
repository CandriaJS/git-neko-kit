import { isEmpty } from "radashi";

import {
	FailedToRemoveOrgMemberMsg,
	MissingOrgParamMsg,
	MissingUserNameParamMsg,
	OrgForUserNotFoundMsg,
	OrgNotFoundMsg,
	PermissionDeniedMsg,
	RemoveOrgMemberSuccessMsg,
	RepoOrPermissionDeniedMsg,
} from "@/common";
import { GitHubClient } from "@/models/platform/github/client";
import type {
	AddMemberParamType,
	AddMemberResponseType,
	ApiResponseType,
	GetOrgMemberInfoParamType,
	GetOrgMemberInfoResponseType,
	GetOrgMemberListParamType,
	GetOrgMemberListResponseType,
	GetOrgMemberListType,
	OrgInfoParamType,
	OrgInfoResponseType,
	RemoveOrgMemberParamType,
	RemoveOrgMemberResponseType,
} from "@/types";
/**
 * Github 组织操作类
 *
 * 提供对GitHub组织的CRUD操作，包括：
 * - 获取组织信息
 */
export class Org extends GitHubClient {
	constructor(base: GitHubClient) {
		super(base);
		this.userToken = base.userToken;
		this.api_url = base.api_url;
		this.base_url = base.base_url;
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
	public async get_org_info(
		options: OrgInfoParamType,
	): Promise<ApiResponseType<OrgInfoResponseType>> {
		if (!options.org) {
			throw new Error(MissingOrgParamMsg);
		}
		const { org } = options;
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const res = await this.get(`/orgs/${org}`);
			if (res.statusCode === 404) {
				throw new Error(OrgNotFoundMsg);
			}
			if (res.data) {
				const OrgData: OrgInfoResponseType = {
					id: res.data.id,
					login: res.data.login,
					name: isEmpty(res.data.name) ? null : res.data.name,
					avatar_url: res.data.avatar_url,
					description: res.data.description,
					html_url: res.data.html_url,
				};
				res.data = OrgData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 获取组织信息失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 获取组织成员信息
	 * 权限：
	 *  - Member: Read
	 * @description 该函数必需要授权访问，否则会获取失败
	 * @param options 组织信息参数
	 * - org 组织名称
	 * - username 成员名称
	 * @returns 组织信息
	 * @example
	 * ```ts
	 * console.log(await get_org_member_info({ org: 'CandriaJS', username: 'CandriaJS' }))
	 * -> {
	 * "state": "active",
	 * "role": "admin",
	 * "organization": {
	 * "id": 123456789,
	 * "login": "CandriaJS",
	 * "name": "CandriaJS",
	 * "html_url": "https://github.com/CandriaJS"
	 * },
	 * "user": {
	 * "id": 123456789,
	 * "login": "CandriaJS",
	 * "name": "CandriaJS",
	 * "avatar_url": "https://avatars.githubusercontent.com/u/123456789?v=4",
	 * "html_url": "https://github.com/CandriaJS"
	 * }
	 * }
	 * ```
	 */
	public async get_org_member_info(
		options: GetOrgMemberInfoParamType,
	): Promise<ApiResponseType<GetOrgMemberInfoResponseType>> {
		if (!options.org) throw new Error(MissingOrgParamMsg);
		if (!options.username) throw new Error(MissingUserNameParamMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { org, username } = options;
			const res = await this.get(`/orgs/${org}/members/${username}`);
			if (res.statusCode === 403) throw new Error(PermissionDeniedMsg);
			if (res.statusCode === 404) throw new Error(OrgForUserNotFoundMsg);
			if (res.data) {
				const OrgData: GetOrgMemberInfoResponseType = {
					state: res.data.state,
					role: res.data.role,
					organization: {
						id: res.data.organization.id,
						login: res.data.organization.login,
						name: isEmpty(res.data.organization.name)
							? null
							: res.data.organization.name,
						html_url: res.data.organization.html_url,
					},
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						avatar_url: res.data.user.avatar_url,
						html_url: res.data.user.html_url,
					},
				};
				res.data = OrgData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取组织成员信息失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 获取组织成员列表
	 * 权限：
	 *  - Member: Read
	 * @description 该函数必需要授权访问，否则会获取失败
	 * @param options
	 * - org 组织名称
	 * - per_page 每页数量
	 * - page 页码
	 * @returns
	 * @example
	 * ```ts
	 * const res = await github.issue.get_org_member_list({ org: 'CandriaJS'})
	 * -> [
	 *      {
	 *         "id": 1234567890,
	 *         "login": "username",
	 *         "name": "username",
	 *         "role": "admin",
	 *         "avatar_url": "https://avatars.githubusercontent.com/u/1234567890?v=4",
	 *         "html_url": "https://github.com/username"
	 *       }
	 *     ]
	 * ```
	 */
	public async get_org_member_list(
		options: GetOrgMemberListParamType,
	): Promise<ApiResponseType<GetOrgMemberListResponseType>> {
		if (!options.org) throw new Error(MissingOrgParamMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { org } = options;
			const params: Record<string, number> = {};
			if (options.per_page) params.per_page = options.per_page;
			if (options.page) params.page = options.page;
			const res = await this.get("/user/memberships/orgs", params);
			if (res.statusCode === 403) throw new Error(PermissionDeniedMsg);
			if (res.statusCode === 404) throw new Error(OrgForUserNotFoundMsg);
			if (res.data) {
				const orgData: GetOrgMemberListResponseType = res.data
					.filter(
						(item: Record<string, any>) => item.organization.login === org,
					)
					.map((item: Record<string, any>): GetOrgMemberListType => {
						return {
							id: item.user.id,
							login: item.user.login,
							name: isEmpty(item.user.name) ? null : item.user.name,
							role: item.role,
							avatar_url: item.user.avatar_url,
							html_url: item.user.html_url,
						};
					});
				res.data = orgData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取组织成员列表失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 添加组织成员
	 * 权限:
	 * - Members  Read-And-Write
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
	public async add_member(
		options: AddMemberParamType,
	): Promise<ApiResponseType<AddMemberResponseType>> {
		if (!options.org) throw new Error(MissingOrgParamMsg);
		if (!options.username) throw new Error(MissingUserNameParamMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			let userid, user_email;
			const { org, username, role } = options;
			if (username) {
				const user = await this.get_user();
				try {
					userid = await user.get_user_id();
				} catch {
					user_email = await user.get_user_email();
				}
			}
			const body: Record<string, string | number> = {};
			if (userid) {
				body.invitee_id = userid;
			} else if (user_email) {
				body.email = user_email;
			}
			if (role === "admin") {
				body.role = "admin";
			} else if (role === "member") {
				body.role = "direct_member";
			} else {
				body.role = "direct_member";
			}
			const res = await this.post(`/orgs/${org}/invitations`, body);
			if (res.statusCode === 404) throw new Error(RepoOrPermissionDeniedMsg);
			if (res.statusCode === 422) {
				const msg = (res.data as unknown as { message: string }).message;
				if (msg) {
					if (msg.includes("is not a valid permission"))
						throw new Error(PermissionDeniedMsg);
				}
			}
			if (res.data) {
				const OrgData: AddMemberResponseType = {
					id: res.data.inviter.id,
					login: res.data.inviterlogin,
					name: res.data.inviter.name,
					html_url: `${this.Client_Secret}/${org}`,
					role: role as "admin" | "member",
				};
				res.data = OrgData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 添加组织成员失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 移除组织成员
	 * 权限:
	 * - Members  Read-And-Write
	 * @param options
	 * - org 组织名
	 * - username 成员名
	 * @returns
	 * @example
	 * ```ts
	 * const res = await github.remove_org_member({ org: 'org', username: 'loli'})
	 * -> {
	 * "success": true,
	 * "message": "喵呜, 移除组织成员loli成功"
	 * }
	 * ```
	 */
	public async remove_org_member(
		options: RemoveOrgMemberParamType,
	): Promise<ApiResponseType<RemoveOrgMemberResponseType>> {
		if (!options.org) throw new Error(MissingOrgParamMsg);
		if (!options.username) throw new Error(MissingUserNameParamMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { org, username } = options;
			const res = await this.delete(`/orgs/${org}/members/${username}`);
			if (res.statusCode === 403) throw new Error(PermissionDeniedMsg);
			let orgData: RemoveOrgMemberResponseType;
			if (res.statusCode === 204) {
				orgData = {
					success: true,
					message: RemoveOrgMemberSuccessMsg(username),
				};
			} else {
				orgData = {
					success: false,
					message: FailedToRemoveOrgMemberMsg(username),
				};
			}
			res.data = orgData;
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 移除组织成员失败: ${(error as Error).message}`);
		}
	}
}
