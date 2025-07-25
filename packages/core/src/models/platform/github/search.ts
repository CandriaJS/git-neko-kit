import { isEmpty } from "radashi";

import { MIssingSearchQueryMsg } from "@/common";
import { GitHubClient } from "@/models/platform/github/client";
import type {
	ApiResponseType,
	SearchRepo,
	SearchReposParamType,
	SearchReposResponseType,
	SearchUser,
	SearchUsersParamType,
	SearchUsersResponseType,
} from "@/types";

/**
 * GitHub 搜索管理类
 *
 * 提供对GitHub Search的完整管理功能，包括：
 * - 搜索用户
 * - 搜索仓库
 *
 */
export class Search extends GitHubClient {
	constructor(base: GitHubClient) {
		super(base);
		this.userToken = base.userToken;
		this.base_url = base.base_url;
		this.api_url = base.api_url;
	}

	/**
	 * 搜索用户
	 *
	 * @param options 搜索参数
	 * - q 搜索关键字
	 * - order 排序顺序
	 * - per_page 每页数量
	 * - page 页码
	 * @returns 搜索结果
	 * @example
	 * ```ts
	 * const users = await search.search_users({ q: 'username', order: 'desc' })
	 * -> {
	 *   total_count: 1,
	 *   items: [
	 *     {
	 *       id: 1,
	 *       login: 'username',
	 *       name: 'username',
	 *       email: 'username@example.com',
	 *       avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
	 *       html_url: 'https://github.com/username'
	 *     }
	 *   ]
	 * }
	 * ```
	 */
	public async search_users(
		options: SearchUsersParamType,
	): Promise<ApiResponseType<SearchUsersResponseType>> {
		if (!options.q) throw new Error(MIssingSearchQueryMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const params: Record<string, string> = {};
			params.q = options.q;
			if (options.order) params.order = options.order;
			if (options.per_page) params.per_page = options.per_page.toString();
			if (options.page) params.page = options.page.toString();
			const res = await this.get("/search/users", params);
			if (res.data) {
				const searchData: SearchUsersResponseType = {
					total_count: res.data.total_count,
					items: res.data.items.map(
						(item: Record<string, any>): SearchUser => ({
							id: item.id,
							login: item.login,
							name: isEmpty(item.name) ? null : item.name,
							email: isEmpty(item.email) ? null : item.email,
							avatar_url: item.avatar_url,
							html_url: item.html_url,
						}),
					),
				};
				res.data = searchData;
			}
			return res;
		} catch (error) {
			throw new Error(`搜索用户失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 搜索仓库
	 *
	 * @param options 搜索参数
	 * - q 搜索关键字
	 * - order 排序顺序
	 * - per_page 每页数量
	 * - page 页码
	 * @returns 搜索结果
	 * @example
	 * ```ts
	 * const repos = await search.search_repos({ q: 'repo', order: 'desc' })
	 * -> {
	 *   total_count: 1,
	 *   items: [
	 *     {
	 *       id: 1,
	 *       owner: 'username',
	 *       name: 'repo',
	 *       full_name: 'username/repo',
	 *       description: 'repo description',
	 *       visibility: 'public',
	 *       public: true,
	 *       private: false,
	 *       archived: false,
	 *       language: 'JavaScript',
	 *       pushed_at: '2021-01-01T00:00:00Z'
	 *     }
	 *   ]
	 * }
	 * ```
	 */

	public async search_repos(
		options: SearchReposParamType,
	): Promise<ApiResponseType<SearchReposResponseType>> {
		if (!options.q) throw new Error(MIssingSearchQueryMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const params: Record<string, string> = {};
			params.q = options.q;
			if (options.order) params.order = options.order;
			if (options.per_page) params.per_page = options.per_page.toString();
			if (options.page) params.page = options.page.toString();
			const res = await this.get("/search/repositories", params);
			if (res.data) {
				const searchData: SearchReposResponseType = {
					total_count: res.data.total_count,
					items: res.data.items.map(
						(item: Record<string, any>): SearchRepo => ({
							id: item.id,
							owner: item.owner.login,
							name: item.name,
							full_name: item.full_name,
							description: isEmpty(item.description) ? null : item.description,
							visibility: item.public ? "public" : "private",
							public: item.public,
							private: item.private,
							archived: item.archived,
							language: isEmpty(item.language) ? null : item.language,
							pushed_at: item.pushed_at,
						}),
					),
				};
				res.data = searchData;
			}
			return res;
		} catch (error) {
			throw new Error(`搜索仓库失败: ${(error as Error).message}`);
		}
	}
}
