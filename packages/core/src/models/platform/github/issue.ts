import { isEmpty } from "radashi";

import {
	FailedtoLockIssueMsg,
	FailedtoRemoveIssueMsg,
	FailedtoUnlockIssueMsg,
	IssueCommentNotFoundMsg,
	IssueCommentRemoveSuccessMsg,
	IssueMovedMsg,
	IssueNotFoundMsg,
	IssueUnlockSuccessMsg,
	MissingIssueCommentBodyMsg,
	MissingIssueCommentNumberMsg,
	MissingIssueNumberMsg,
	MissingIssueTitleMsg,
	MissingRepoOwnerOrNameMsg,
	MissingSubIssueNumberMsg,
	PermissionDeniedMsg,
	RepoNotFoundMsg,
} from "@/common";
import { format_date } from '@candriajs/git-neko-kit-utils'
import { GitHubClient } from "@/models/platform/github/client";
import type {
	ApiResponseType,
	CloseIssueParamType,
	CloseIssueResponseType,
	CreateIssueResponseType,
	CreateSubIssueParamType,
	CreateSubIssueResponseType,
	CreteIssueCommentParamType,
	CreteIssueCommentResponseType,
	CreteIssueParamType,
	IssueCommentInfoParamType,
	IssueCommentInfoResponseType,
	IssueCommentsListParamType,
	IssueCommentsListResponseType,
	IssueInfoParamType,
	IssueInfoResponseType,
	IssueLabelType,
	IssueListResponseType,
	IssueUser,
	LockIssueParamType,
	LockIssueResponseType,
	OpenIssueParamType,
	OpenIssueResponseType,
	RemoveIssueCommentParamType,
	RemoveIssueCommentResponseType,
	RemoveSubIssueParamType,
	RemoveSubIssueResponseType,
	RepoCommentsListParamType,
	RepoCommentsListResponseType,
	RepoIssueListParamType,
	ReprioritizeSubIssueParamType,
	ReprioritizeSubIssueResponseType,
	SubIssueListParamType,
	SubIssueListResponseType,
	UnLockIssueParamType,
	UnLockIssueResponseType,
	UpdateIssueCommentParamType,
	UpdateIssueCommentResponseType,
	UpdateIssueParamType,
	UpdateIssueResponseType,
} from "@/types";

/**
 * GitHub Issue 处理类，提供Issue相关操作功能
 *
 * 提供完整的GitHub Issue管理，包括：
 * - 获取Issue列表
 * - 获取Issue详情
 * - 创建/更新/关闭/打开/锁定/解锁Issue
 * - 获取仓库评论列表
 * - 获取/创建/更新/删除Issue评论
 * - 管理子Issue
 *
 * @remarks 每个拉取请求都是一个议题，但并非每个议题都是拉取请求。
 */
export class Issue extends GitHubClient {
	constructor(base: GitHubClient) {
		super(base);
		this.userToken = base.userToken;
		this.api_url = base.api_url;
		this.base_url = base.base_url;
	}

	/**
	 * 获取议题详情
	 * 权限:
	 * - Issues: Read-only
	 * @param options 请求参数列表
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * @returns 包含Issue信息的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.get_issue_info({ owner: 'owner', repo:'repo', issue_number:1 })
	 * -> 议题信息对象
	 * ```
	 */
	public async get_issue_info(
		options: IssueInfoParamType,
	): Promise<ApiResponseType<IssueInfoResponseType>> {
		if (!options.owner || !options.repo)
			throw new Error(MissingRepoOwnerOrNameMsg);
		if (!options.issue_number) throw new Error(MissingIssueNumberMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number } = options;
			const res = await this.get(
				`/repos/${owner}/${repo}/issues/${Number(issue_number)}`,
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 301:
					throw new Error(IssueMovedMsg);
			}
			if (res.data) {
				const [
					createdAt,
					updatedAt,
					closedAt,
					milestoneCreatedAt,
					milestoneUpdatedAt,
					milestoneClosedAt,
					milestoneDueOn,
				] = await Promise.all([
					this.format ? format_date(res.data.created_at) : res.data.created_at,
					this.format ? format_date(res.data.updated_at) : res.data.updated_at,
					!isEmpty(res.data.closed_at)
						? this.format
							? await format_date(res.data.closed_at)
							: res.data.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.created_at)
							: res.data.milestone.created_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.updated_at)
							: res.data.milestone.updated_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.closed_at)
							: res.data.milestone.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.due_on)
							: res.data.milestone.due_on
						: null,
				]);
				const IssueData: IssueInfoResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					number: res.data.number,
					state: res.data.state,
					title: res.data.title,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					labels: !isEmpty(res.data.labels)
						? res.data.labels.map(
								(label: Record<string, any>): IssueLabelType => ({
									id: label.id,
									name: label.name,
									color: label.color,
								}),
							)
						: null,
					assignee: !isEmpty(res.data.assignee)
						? {
								id: res.data.assignee.id,
								login: res.data.assignee.login,
								name: isEmpty(res.data.assignee.name)
									? null
									: res.data.assignee.name,
								email: isEmpty(res.data.assignee.email)
									? null
									: res.data.assignee.email,
								html_url: res.data.assignee.html_url,
								avatar_url: res.data.assignee.avatar_url,
							}
						: null,
					assignees: !isEmpty(res.data.assignees)
						? res.data.assignees.map(
								(assignee: Record<string, any>): IssueUser => ({
									id: assignee.id,
									login: assignee.login,
									name: isEmpty(assignee.name) ? null : assignee.name,
									email: isEmpty(assignee.email) ? null : assignee.email,
									html_url: assignee.html_url,
									avatar_url: assignee.avatar_url,
								}),
							)
						: null,
					milestone: !isEmpty(res.data.milestone)
						? {
								id: res.data.milestone.id,
								url: res.data.milestone.url,
								number: res.data.milestone.number,
								state: res.data.milestone.state,
								title: res.data.milestone.title,
								description: res.data.milestone.description,
								open_issues: res.data.milestone.open_issues,
								closed_issues: res.data.milestone.closed_issues,
								created_at: milestoneCreatedAt,
								updated_at: milestoneUpdatedAt,
								closed_at: milestoneClosedAt,
								due_on: milestoneDueOn,
							}
						: null,
					created_at: createdAt,
					updated_at: updatedAt,
					closed_at: closedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 获取议题详情失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 获取仓库的议题列表
	 * 权限:
	 * - Issues:Read-only
	 * @param options 请求参数列表
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - milestones 里程碑ID列表
	 * - state  Issue状态，可选 'open' | 'closed' | 'all', 默认为'all'
	 * - labels 标签名称列表
	 * - assignee  指派人用户名
	 * - type  问题类型
	 * - creator  创建者用户名
	 * - mentioned  提及的用户名
	 * - sort  排序方式，可选 'created' | 'updated' | 'comments', 默认为'created'
	 * - direction  排序方向，可选 'asc' | 'desc', 默认为'desc'
	 * - since  筛选此时间之后的问题
	 * - per_page  每页数量，可选，默认为30
	 * - page  页码，可选，默认为1
	 * @returns 包含Issue列表的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.get_issue_list({ owner: 'owner', repo: 'repo' })
	 * -> 议题信息对象列表
	 * ```
	 */
	public async get_issues_list(
		options: RepoIssueListParamType,
	): Promise<ApiResponseType<IssueListResponseType>> {
		if (!options.owner || !options.repo)
			throw new Error(MissingRepoOwnerOrNameMsg);
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, ...queryOptions } = options;
			const params: Record<string, string> = {};
			if (queryOptions.milestone) {
				params.milestone = queryOptions.milestone.toString();
			}
			if (queryOptions.state) params.state = queryOptions.state;
			if (queryOptions.assignee) params.assignee = queryOptions.assignee;
			if (queryOptions.creator) params.creator = queryOptions.creator;
			if (queryOptions.labels) params.labels = queryOptions.labels;
			if (queryOptions.sort) params.sort = queryOptions.sort;
			if (queryOptions.direction) params.direction = queryOptions.direction;
			if (queryOptions.since) params.since = queryOptions.since;
			if (queryOptions.per_page) {
				params.per_page = queryOptions.per_page.toString();
			}
			if (queryOptions.page) params.page = queryOptions.page.toString();

			const apiPath = `/repos/${owner}/${repo}/issues`;
			const res = await this.get(apiPath, params);
			if (res.statusCode === 401) {
				throw new Error(PermissionDeniedMsg);
			}
			if (res.data) {
				const IssueData: IssueListResponseType = await Promise.all(
					res.data.map(
						async (
							issue: Record<string, any>,
						): Promise<IssueInfoResponseType> => ({
							id: issue.id,
							html_url: issue.html_url,
							number: issue.number,
							state: issue.state,
							title: issue.title,
							body: issue.body,
							user: {
								id: issue.user.id,
								login: issue.user.login,
								name: isEmpty(issue.user.name) ? null : issue.user.name,
								email: isEmpty(issue.user.email) ? null : issue.user.email,
								html_url: issue.user.html_url,
								avatar_url: issue.user.avatar_url,
							},
							labels: !isEmpty(issue.labels)
								? issue.labels.map(
										(label: Record<string, any>): IssueLabelType => ({
											id: label.id,
											name: label.name,
											color: label.color,
										}),
									)
								: null,
							assignee: !isEmpty(issue.assignee)
								? {
										id: issue.assignee.id,
										login: issue.assignee.login,
										name: isEmpty(issue.assignee.name)
											? null
											: issue.assignee.name,
										email: isEmpty(issue.assignee.email)
											? null
											: issue.assignee.email,
										html_url: issue.assignee.html_url,
										avatar_url: issue.assignee.avatar_url,
									}
								: null,
							assignees: !isEmpty(issue.assignees)
								? issue.assignees.map(
										(assignee: Record<string, any>): IssueUser => ({
											id: assignee.id,
											login: assignee.login,
											name: isEmpty(assignee.name) ? null : assignee.name,
											email: isEmpty(assignee.email) ? null : assignee.email,
											html_url: assignee.html_url,
											avatar_url: assignee.avatar_url,
										}),
									)
								: null,
							milestone: !isEmpty(issue.milestone)
								? {
										id: issue.milestone.id,
										url: issue.milestone.url,
										number: issue.milestone.number,
										state: issue.milestone.state,
										title: issue.milestone.title,
										description: issue.milestone.description,
										open_issues: issue.milestone.open_issues,
										closed_issues: issue.milestone.closed_issues,
										created_at: this.format
											? await format_date(issue.milestone.created_at)
											: issue.milestone.created_at,
										updated_at: this.format
											? await format_date(issue.milestone.updated_at)
											: issue.milestone.updated_at,
										closed_at: issue.milestone.closed_at
											? this.format
												? await format_date(issue.milestone.closed_at)
												: issue.milestone.closed_at
											: null,
										due_on: issue.milestone.due_on
											? this.format
												? await format_date(issue.milestone.due_on)
												: issue.milestone.due_on
											: null,
									}
								: null,
							created_at: this.format
								? await format_date(res.data.created_at)
								: res.data.created_at,
							updated_at: this.format
								? await format_date(res.data.updated_at)
								: res.data.updated_at,
							closed_at: res.data.closed_at
								? this.format
									? await format_date(res.data.closed_at)
									: res.data.closed_at
								: null,
						}),
					),
				);
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取仓库的议题列表失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 创建一个议题
	 * 权限:
	 * - Issues: Write
	 * @param options 发送Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - title 标题
	 * - body 内容
	 * - assignee 指派人
	 * - milestone 里程碑
	 * - labels 标签列表
	 * - type 问题类型
	 * @returns 包含Issue信息的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.create_issue({ owner: 'owner', repo:'repo', title:'title', body:'body' })
	 * -> 创建议题信息对象
	 * ```
	 */
	public async create_issue(
		options: CreteIssueParamType,
	): Promise<ApiResponseType<CreateIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.title) {
			throw new Error(MissingIssueTitleMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, ...IssueOptions } = options;
			const issueParams = {
				...IssueOptions,
				...(IssueOptions.labels && {
					labels: Array.isArray(IssueOptions.labels)
						? IssueOptions.labels
						: [IssueOptions.labels],
				}),
				...(IssueOptions.assignees && {
					assignees: Array.isArray(IssueOptions.assignees)
						? IssueOptions.assignees
						: [IssueOptions.assignees],
				}),
			};
			const res = await this.post(
				`/repos/${owner}/${repo}/issues`,
				issueParams,
			);
			switch (res.statusCode) {
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			if (res.data) {
				if (res.data) {
					const [
						createdAt,
						updatedAt,
						closedAt,
						milestoneCreatedAt,
						milestoneUpdatedAt,
						milestoneClosedAt,
						milestoneDueOn,
					] = await Promise.all([
						this.format
							? format_date(res.data.created_at)
							: res.data.created_at,
						this.format
							? format_date(res.data.updated_at)
							: res.data.updated_at,
						!isEmpty(res.data.closed_at)
							? this.format
								? await format_date(res.data.closed_at)
								: res.data.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.created_at)
								: res.data.milestone.created_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.updated_at)
								: res.data.milestone.updated_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.closed_at)
								: res.data.milestone.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.due_on)
								: res.data.milestone.due_on
							: null,
					]);
					const IssueData: CreateIssueResponseType = {
						id: res.data.id,
						html_url: res.data.html_url,
						number: res.data.number,
						state: res.data.state,
						title: res.data.title,
						body: res.data.body,
						user: {
							id: res.data.user.id,
							login: res.data.user.login,
							name: isEmpty(res.data.user.name) ? null : res.data.user.name,
							email: isEmpty(res.data.user.email) ? null : res.data.user.email,
							html_url: res.data.user.html_url,
							avatar_url: res.data.user.avatar_url,
						},
						labels: !isEmpty(res.data.labels)
							? res.data.labels.map(
									(label: Record<string, any>): IssueLabelType => ({
										id: label.id,
										name: label.name,
										color: label.color,
									}),
								)
							: null,
						assignee: !isEmpty(res.data.assignee)
							? {
									id: res.data.assignee.id,
									login: res.data.assignee.login,
									name: isEmpty(res.data.assignee.name)
										? null
										: res.data.assignee.name,
									email: isEmpty(res.data.assignee.email)
										? null
										: res.data.assignee.email,
									html_url: res.data.assignee.html_url,
									avatar_url: res.data.assignee.avatar_url,
								}
							: null,
						assignees: !isEmpty(res.data.assignees)
							? res.data.assignees.map(
									(assignee: Record<string, any>): IssueUser => ({
										id: assignee.id,
										login: assignee.login,
										name: isEmpty(assignee.name) ? null : assignee.name,
										email: isEmpty(assignee.email) ? null : assignee.email,
										html_url: assignee.html_url,
										avatar_url: assignee.avatar_url,
									}),
								)
							: null,
						milestone: !isEmpty(res.data.milestone)
							? {
									id: res.data.milestone.id,
									url: res.data.milestone.url,
									number: res.data.milestone.number,
									state: res.data.milestone.state,
									title: res.data.milestone.title,
									description: res.data.milestone.description,
									open_issues: res.data.milestone.open_issues,
									closed_issues: res.data.milestone.closed_issues,
									created_at: milestoneCreatedAt,
									updated_at: milestoneUpdatedAt,
									closed_at: milestoneClosedAt,
									due_on: milestoneDueOn,
								}
							: null,
						created_at: createdAt,
						updated_at: updatedAt,
						closed_at: closedAt,
					};
					res.data = IssueData;
				}
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub]创建议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 更新一个议题
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 更新Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * - title 标题
	 * - body 内容
	 * - assignee 指派人
	 * - milestone 里程碑
	 * - labels 标签列表
	 * - type 问题类型
	 * @returns 包含Issue信息的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.update_issue({ owner: 'owner', repo:'repo', issue_number:1, title:'title', body:'body' })
	 * -> 更新议题信息对象
	 * ```
	 */
	public async update_issue(
		options: UpdateIssueParamType,
	): Promise<ApiResponseType<UpdateIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, ...updateData } = options;
			const issueParams = {
				...updateData,
				...(updateData.labels && {
					labels: Array.isArray(updateData.labels)
						? updateData.labels
						: [updateData.labels],
				}),
				...(updateData.assignees && {
					assignees: Array.isArray(updateData.assignees)
						? updateData.assignees
						: [updateData.assignees],
				}),
			};
			const res = await this.patch(
				`/repos/${owner}/${repo}/issues/${Number(issue_number)}`,
				null,
				issueParams,
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			if (res.data) {
				if (res.data) {
					const [
						createdAt,
						updatedAt,
						closedAt,
						milestoneCreatedAt,
						milestoneUpdatedAt,
						milestoneClosedAt,
						milestoneDueOn,
					] = await Promise.all([
						this.format
							? format_date(res.data.created_at)
							: res.data.created_at,
						this.format
							? format_date(res.data.updated_at)
							: res.data.updated_at,
						!isEmpty(res.data.closed_at)
							? this.format
								? await format_date(res.data.closed_at)
								: res.data.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.created_at)
								: res.data.milestone.created_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.updated_at)
								: res.data.milestone.updated_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.closed_at)
								: res.data.milestone.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.due_on)
								: res.data.milestone.due_on
							: null,
					]);
					const IssueData: UpdateIssueResponseType = {
						id: res.data.id,
						html_url: res.data.html_url,
						number: res.data.number,
						state: res.data.state,
						title: res.data.title,
						body: res.data.body,
						user: {
							id: res.data.user.id,
							login: res.data.user.login,
							name: isEmpty(res.data.user.name) ? null : res.data.user.name,
							email: isEmpty(res.data.user.email) ? null : res.data.user.email,
							html_url: res.data.user.html_url,
							avatar_url: res.data.user.avatar_url,
						},
						labels: !isEmpty(res.data.labels)
							? res.data.labels.map(
									(label: Record<string, any>): IssueLabelType => ({
										id: label.id,
										name: label.name,
										color: label.color,
									}),
								)
							: null,
						assignee: !isEmpty(res.data.assignee)
							? {
									id: res.data.assignee.id,
									login: res.data.assignee.login,
									name: isEmpty(res.data.assignee.name)
										? null
										: res.data.assignee.name,
									email: isEmpty(res.data.assignee.email)
										? null
										: res.data.assignee,
									html_url: res.data.assignee.html_url,
									avatar_url: res.data.assignee.avatar_url,
								}
							: null,
						assignees: !isEmpty(res.data.assignees)
							? res.data.assignees.map(
									(assignee: Record<string, any>): IssueUser => ({
										id: assignee.id,
										login: assignee.login,
										name: isEmpty(assignee.name) ? null : assignee.name,
										email: isEmpty(assignee.email) ? null : assignee.email,
										html_url: assignee.html_url,
										avatar_url: assignee.avatar_url,
									}),
								)
							: null,
						milestone: !isEmpty(res.data.milestone)
							? {
									id: res.data.milestone.id,
									url: res.data.milestone.url,
									number: res.data.milestone.number,
									state: res.data.milestone.state,
									title: res.data.milestone.title,
									description: res.data.milestone.description,
									open_issues: res.data.milestone.open_issues,
									closed_issues: res.data.milestone.closed_issues,
									created_at: milestoneCreatedAt,
									updated_at: milestoneUpdatedAt,
									closed_at: milestoneClosedAt,
									due_on: milestoneDueOn,
								}
							: null,
						created_at: createdAt,
						updated_at: updatedAt,
						closed_at: closedAt,
					};
					res.data = IssueData;
				}
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 更新议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 重新打开一个议题
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 打开Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * @returns 包含Issue信息的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.open_issue({ owner: 'owner', repo:'repo', issue_number:1 })
	 * -> 打开议题信息对象
	 * ```
	 */
	public async open_issue(
		options: OpenIssueParamType,
	): Promise<ApiResponseType<OpenIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number } = options;
			const res = await this.patch(
				`/repos/${owner}/${repo}/issues/${issue_number}`,
				null,
				{
					state: "open",
				},
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			if (res.data) {
				if (res.data) {
					const [
						createdAt,
						updatedAt,
						closedAt,
						milestoneCreatedAt,
						milestoneUpdatedAt,
						milestoneClosedAt,
						milestoneDueOn,
					] = await Promise.all([
						this.format
							? format_date(res.data.created_at)
							: res.data.created_at,
						this.format
							? format_date(res.data.updated_at)
							: res.data.updated_at,
						!isEmpty(res.data.closed_at)
							? this.format
								? await format_date(res.data.closed_at)
								: res.data.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.created_at)
								: res.data.milestone.created_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.updated_at)
								: res.data.milestone.updated_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.closed_at)
								: res.data.milestone.closed_at
							: null,
						!isEmpty(res.data.milestone)
							? this.format
								? await format_date(res.data.milestone.due_on)
								: res.data.milestone.due_on
							: null,
					]);
					const IssueData: OpenIssueResponseType = {
						id: res.data.id,
						html_url: res.data.html_url,
						number: res.data.number,
						state: res.data.state,
						title: res.data.title,
						body: res.data.body,
						user: {
							id: res.data.user.id,
							login: res.data.user.login,
							name: isEmpty(res.data.user.name) ? null : res.data.user.name,
							email: isEmpty(res.data.user.email) ? null : res.data.user.email,
							html_url: res.data.user.html_url,
							avatar_url: res.data.user.avatar_url,
						},
						labels: !isEmpty(res.data.labels)
							? res.data.labels.map(
									(label: Record<string, any>): IssueLabelType => ({
										id: label.id,
										name: label.name,
										color: label.color,
									}),
								)
							: null,
						assignee: !isEmpty(res.data.assignee)
							? {
									id: res.data.assignee.id,
									login: res.data.assignee.login,
									name: isEmpty(res.data.assignee.name)
										? null
										: res.data.assignee.name,
									email: isEmpty(res.data.assignee.email)
										? null
										: res.data.assignee.email,
									html_url: res.data.assignee.html_url,
									avatar_url: res.data.assignee.avatar_url,
								}
							: null,
						assignees: !isEmpty(res.data.assignees)
							? res.data.assignees.map(
									(assignee: Record<string, any>): IssueUser => ({
										id: assignee.id,
										login: assignee.login,
										name: isEmpty(assignee.name) ? null : assignee.name,
										email: isEmpty(assignee.email) ? null : assignee.email,
										html_url: assignee.html_url,
										avatar_url: assignee.avatar_url,
									}),
								)
							: null,
						milestone: !isEmpty(res.data.milestone)
							? {
									id: res.data.milestone.id,
									url: res.data.milestone.url,
									number: res.data.milestone.number,
									state: res.data.milestone.state,
									title: res.data.milestone.title,
									description: res.data.milestone.description,
									open_issues: res.data.milestone.open_issues,
									closed_issues: res.data.milestone.closed_issues,
									created_at: milestoneCreatedAt,
									updated_at: milestoneUpdatedAt,
									closed_at: milestoneClosedAt,
									due_on: milestoneDueOn,
								}
							: null,
						created_at: createdAt,
						updated_at: updatedAt,
						closed_at: closedAt,
					};
					res.data = IssueData;
				}
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 打开议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 重新打开一个议题
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @deprecated 请使用 open_issue 方法代替
	 */
	public async reopen_issue(
		options: OpenIssueParamType,
	): Promise<ApiResponseType<OpenIssueResponseType>> {
		return this.open_issue(options);
	}

	/**
	 * 关闭一个议题
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 关闭Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * - state_reason 关闭原因
	 * @returns 包含Issue信息的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.close_issue({ owner: 'owner', repo:'repo', issue_number:1, state_reason:'completed' })
	 * -> 关闭议题信息对象
	 * ```
	 */
	public async close_issue(
		options: CloseIssueParamType,
	): Promise<ApiResponseType<CloseIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number } = options;
			const res = await this.patch(
				`/repos/${owner}/${repo}/issues/${issue_number}`,
				null,
				{
					state: "closed",
				},
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			if (res.data) {
				const [
					createdAt,
					updatedAt,
					closedAt,
					milestoneCreatedAt,
					milestoneUpdatedAt,
					milestoneClosedAt,
					milestoneDueOn,
				] = await Promise.all([
					this.format ? format_date(res.data.created_at) : res.data.created_at,
					this.format ? format_date(res.data.updated_at) : res.data.updated_at,
					!isEmpty(res.data.closed_at)
						? this.format
							? await format_date(res.data.closed_at)
							: res.data.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.created_at)
							: res.data.milestone.created_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.updated_at)
							: res.data.milestone.updated_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.closed_at)
							: res.data.milestone.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.due_on)
							: res.data.milestone.due_on
						: null,
				]);
				const IssueData: CloseIssueResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					number: res.data.number,
					state: res.data.state,
					title: res.data.title,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					labels: !isEmpty(res.data.labels)
						? res.data.labels.map(
								(label: Record<string, any>): IssueLabelType => ({
									id: label.id,
									name: label.name,
									color: label.color,
								}),
							)
						: null,
					assignee: !isEmpty(res.data.assignee)
						? {
								id: res.data.assignee.id,
								login: res.data.assignee.login,
								name: isEmpty(res.data.assignee.name)
									? null
									: res.data.assignee.name,
								email: isEmpty(res.data.assignee.email)
									? null
									: res.data.assignee.email,
								html_url: res.data.assignee.html_url,
								avatar_url: res.data.assignee.avatar_url,
							}
						: null,
					assignees: !isEmpty(res.data.assignees)
						? res.data.assignees.map(
								(assignee: Record<string, any>): IssueUser => ({
									id: assignee.id,
									login: assignee.login,
									name: isEmpty(assignee.name) ? null : assignee.name,
									email: isEmpty(assignee.email) ? null : assignee.email,
									html_url: assignee.html_url,
									avatar_url: assignee.avatar_url,
								}),
							)
						: null,
					milestone: !isEmpty(res.data.milestone)
						? {
								id: res.data.milestone.id,
								url: res.data.milestone.url,
								number: res.data.milestone.number,
								state: res.data.milestone.state,
								title: res.data.milestone.title,
								description: res.data.milestone.description,
								open_issues: res.data.milestone.open_issues,
								closed_issues: res.data.milestone.closed_issues,
								created_at: milestoneCreatedAt,
								updated_at: milestoneUpdatedAt,
								closed_at: milestoneClosedAt,
								due_on: milestoneDueOn,
							}
						: null,
					created_at: createdAt,
					updated_at: updatedAt,
					closed_at: closedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 关闭议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 锁定一个议题
	 * @github
	 * 仅GitHub平台可用
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 锁定Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * - lock_reason 锁定原因 可选 'off-topic' | 'too heated' | 'resolved' | 'spam'
	 * @returns 锁定状态信息
	 * @example
	 * ```ts
	 * const res = await issue.lock_issue({ owner: 'owner', repo:'repo', issue_number:1, lock_reason:'off-topic' })
	 * -> 锁定议题信息对象
	 * ```
	 */
	public async lock_issue(
		options: LockIssueParamType,
	): Promise<ApiResponseType<LockIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, lock_reason } = options;
			const res = await this.put(
				`/repos/${owner}/${repo}/issues/${Number(issue_number)}`,
				{
					locked: true,
					lock_reason,
				},
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			let issueData;
			if (res.statusCode === 204) {
				issueData = {
					success: true,
					message: IssueUnlockSuccessMsg,
				};
			} else {
				issueData = {
					success: false,
					message: FailedtoLockIssueMsg,
				};
			}
			res.data = issueData;
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 锁定议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 解锁一个议题
	 * @github
	 * 仅GitHub平台可用
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 解锁Issue的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * @returns 解锁状态信息
	 * @example
	 * ```ts
	 * const res = await issue.unlock_issue({ owner: 'owner', repo:'repo', issue_number})
	 * -> 解锁议题信息对象
	 * ```
	 */
	public async unlock_issue(
		options: UnLockIssueParamType,
	): Promise<ApiResponseType<UnLockIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number } = options;
			const res = await this.delete(
				`/repos/${owner}/${repo}/issues/${issue_number}/lock`,
			);
			switch (res.statusCode) {
				case 404:
					throw new Error(IssueNotFoundMsg);
				case 403:
					throw new Error(PermissionDeniedMsg);
				case 301:
					throw new Error(RepoNotFoundMsg);
			}
			let issueData;
			if (res.statusCode === 204) {
				issueData = {
					success: true,
					message: IssueUnlockSuccessMsg,
				};
			} else {
				issueData = {
					success: false,
					message: FailedtoUnlockIssueMsg,
				};
			}
			res.data = issueData;
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 解锁议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 获取一个仓库下议题的评论列表
	 * 权限:
	 * - Issues: Read-only
	 * - Pull requests: Read-only
	 * 需以上权限之一
	 * @param options 获取Issue评论列表的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - sort 排序方式 可选 'created' | 'updated'
	 * - direction 排序方向 可选 'asc' | 'desc'，当sort不存在时此参数会被忽略
	 * - since 评论时间
	 * - per_page 每页评论数量
	 * - page 页码
	 * @returns 包含Issue评论列表的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.get_issue_comments_list({ owner: 'owner', repo:'repo', issue_number:1 })
	 * -> 议题评论对象列表
	 * ```
	 */
	public async get_repo_comments_list(
		options: RepoCommentsListParamType,
	): Promise<ApiResponseType<RepoCommentsListResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, ...queryOptions } = options;

			const params: Record<string, string> = {};
			if (queryOptions.sort) params.sort = queryOptions.sort;
			if (queryOptions.direction && queryOptions.direction)
				params.direction = queryOptions.direction;
			if (queryOptions.since) params.since = queryOptions.since;
			if (queryOptions.per_page) {
				params.per_page = queryOptions.per_page.toString();
			}
			if (queryOptions.page) params.page = queryOptions.page.toString();

			const apiPath = `/repos/${owner}/${repo}/issues/comments/`;

			const res = await this.get(apiPath, params);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			if (res.data) {
				const IssueData: RepoCommentsListResponseType = await Promise.all(
					res.data.map(
						async (
							comment: Record<string, any>,
						): Promise<IssueCommentInfoResponseType> => ({
							id: comment.id,
							html_url: comment.html_url,
							body: comment.body,
							user: {
								id: comment.user.id,
								login: comment.user.login,
								name: isEmpty(comment.user.name) ? null : comment.user.name,
								email: isEmpty(comment.user.email) ? null : comment.user.email,
								html_url: comment.user.html_url,
								avatar_url: comment.user.avatar_url,
							},
							created_at: this.format
								? await format_date(comment.created_at)
								: comment.created_at,
							updated_at: this.format
								? await format_date(comment.updated_at)
								: comment.updated_at,
						}),
					),
				);
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取仓库评论列表失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 获取一个议题下的评论列表
	 * 权限:
	 * - Issues: Read-only
	 * - Pull requests: Read-only
	 * 需以上权限之一
	 * @param options 获取Issue评论列表的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * - since 评论时间
	 * - per_page 每页评论数量
	 * - page 页码
	 * @returns 包含Issue评论列表的响应对象
	 * @example
	 * ```ts
	 * const res = await issue.get_issue_comments_list({ owner: 'owner', repo:'repo', issue_number:1 })
	 * -> 议题评论对象列表
	 * ```
	 */
	public async get_issue_comments_list(
		options: IssueCommentsListParamType,
	): Promise<ApiResponseType<IssueCommentsListResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(MissingIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, ...queryOptions } = options;
			const params: Record<string, string> = {};

			if (queryOptions.since) params.since = queryOptions.since;
			if (queryOptions.per_page) {
				params.per_page = queryOptions.per_page.toString();
			}
			if (queryOptions.page) params.page = queryOptions.page.toString();

			const apiPath = `/repos/${owner}/${repo}/issues/${Number(
				issue_number,
			)}/comments`;
			const res = await this.get(apiPath, params);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			if (res.data) {
				const IssueData: IssueCommentsListResponseType = await Promise.all(
					res.data.map(
						async (
							comment: Record<string, any>,
						): Promise<IssueCommentInfoResponseType> => ({
							id: comment.id,
							html_url: comment.html_url,
							body: comment.body,
							user: {
								id: comment.user.id,
								login: comment.user.login,
								name: isEmpty(comment.user.name) ? null : comment.user.name,
								email: isEmpty(comment.user.email) ? null : comment.user.email,
								html_url: comment.user.html_url,
								avatar_url: comment.user.avatar_url,
							},
							created_at: this.format
								? await format_date(comment.created_at)
								: comment.created_at,
							updated_at: this.format
								? await format_date(comment.updated_at)
								: comment.updated_at,
						}),
					),
				);
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取议题评论列表失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 获取议题评论信息
	 * 权限:
	 * - Issues: Read-only
	 * - Pull requests: Read-only
	 * 需以上权限之一
	 * @param options 获取Issue评论信息的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - comment_id 评论ID
	 * @returns Issue评论信息
	 * @example
	 * ```ts
	 * const res = await issue.get_issue_comment({ owner: 'owner', repo:'repo', comment_id:1 })
	 * -> 议题评论对象
	 * ```
	 */
	public async get_issue_comment_info(
		options: IssueCommentInfoParamType,
	): Promise<ApiResponseType<IssueCommentInfoResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.comment_id) {
			throw new Error(MissingIssueCommentNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, comment_id } = options;
			const res = await this.get(
				`/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`,
			);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			if (res.data) {
				const [createdAt, updatedAt] = await Promise.all([
					this.format
						? await format_date(res.data.created_at)
						: res.data.created_at,
					this.format
						? await format_date(res.data.updated_at)
						: res.data.updated_at,
				]);
				const IssueData: IssueCommentInfoResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					created_at: createdAt,
					updated_at: updatedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取议题评论信息失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 创建一个议题评论
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 创建Issue评论的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number Issue编号
	 * - body 评论内容
	 * @returns 创建的Issue评论信息
	 * @example
	 * ```ts
	 * const issue = get_issue() // 获取issue实例
	 * const res = await issue.create_issue_comment({ owner: 'owner', repo:'repo', issue_number:1, body:'comment' })
	 * -> 创建议题评论对象
	 * ```
	 */
	public async create_issue_comment(
		options: CreteIssueCommentParamType,
	): Promise<ApiResponseType<CreteIssueCommentResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(IssueCommentNotFoundMsg);
		}
		if (!options.body) {
			throw new Error(MissingIssueCommentBodyMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, body } = options;
			const res = await this.post(
				`/repos/${owner}/${repo}/issues/${Number(issue_number)}/comments`,
				{
					body,
				},
			);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			if (res.data) {
				const [createdAt, updatedAt] = await Promise.all([
					this.format
						? await format_date(res.data.created_at)
						: res.data.created_at,
					this.format
						? await format_date(res.data.updated_at)
						: res.data.updated_at,
				]);
				const IssueData: CreteIssueCommentResponseType = {
					id: res.data.id,
					html_url: `${this.base_url}/${owner}/${repo}/issues/${issue_number}#${res.data.id}`,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					created_at: createdAt,
					updated_at: updatedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 创建议题评论失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 更新议题评论信息
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 更新Issue评论信息的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - comment_id 评论ID
	 * - body 评论内容
	 * @returns 更新后的Issue评论信息
	 * @example
	 * ```ts
	 * const res = await issue.update_issue_comment({ owner: 'owner', repo:'repo', comment_id:1, body:'body' })
	 * -> 更新议题评论对象
	 * ```
	 */
	public async update_issue_comment(
		options: UpdateIssueCommentParamType,
	): Promise<ApiResponseType<UpdateIssueCommentResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.comment_id) {
			throw new Error(MissingIssueCommentNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, comment_id, ...updateData } = options;
			const res = await this.patch(
				`/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`,
				null,
				updateData,
			);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			if (res.data) {
				const [createdAt, updatedAt] = await Promise.all([
					this.format
						? await format_date(res.data.created_at)
						: res.data.created_at,
					this.format
						? await format_date(res.data.updated_at)
						: res.data.updated_at,
				]);
				const IssueData: UpdateIssueCommentResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					created_at: createdAt,
					updated_at: updatedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 更新议题评论信息失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 删除议题评论信息
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @param options 删除Issue评论信息的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - comment_id 评论ID
	 * @returns 删除结果信息
	 * @example
	 * ```ts
	 * const res = awaitissue.remove_issue_comment()
	 * -> 删除议题评论对象
	 * ```
	 */
	public async remove_issue_comment(
		options: RemoveIssueCommentParamType,
	): Promise<ApiResponseType<RemoveIssueCommentResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.comment_id) {
			throw new Error(MissingIssueCommentNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, comment_id } = options;
			const res = await this.delete(
				`/repos/${owner}/${repo}/issues/comments/${Number(comment_id)}`,
			);
			if (res.statusCode === 404) {
				throw new Error(IssueCommentNotFoundMsg);
			}
			let IssueData: RemoveIssueCommentResponseType;
			if (res.statusCode === 204) {
				IssueData = {
					success: true,
					message: IssueCommentRemoveSuccessMsg,
				};
			} else {
				IssueData = {
					success: false,
					message: FailedtoRemoveIssueMsg,
				};
			}
			res.data = IssueData;
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 删除议题评论信息失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 删除议题评论信息
	 * 权限:
	 * - Issues: Write
	 * - Pull requests: Write
	 * 需以上权限之一
	 * @deprecated 请使用 remove_issue_comment 方法代替
	 */
	public async delete_issue_comment(
		options: RemoveIssueCommentParamType,
	): Promise<ApiResponseType<RemoveIssueCommentResponseType>> {
		return this.remove_issue_comment(options);
	}

	/**
	 * 获取子议题列表
	 * @github
	 * 仅GitHub 平台使用
	 * 权限:
	 * - Issues: Read-only
	 * - Pull requests: Read-only
	 * 需以上权限之一
	 * @param options 获取子议题列表的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number 议题编号
	 * @returns 子议题列表
	 * @example
	 * ```ts
	 * const res = await issue.get_sub_issue_list({ owner: 'owner', repo:'repo', issue_number:1 })
	 * -> 子议题信息对象列表
	 * ```
	 */
	public async get_sub_issue_list(
		options: SubIssueListParamType,
	): Promise<ApiResponseType<SubIssueListResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(IssueCommentNotFoundMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, ...queryOptions } = options;
			const params: Record<string, string> = {};

			if (queryOptions.per_page) {
				params.per_page = queryOptions.per_page.toString();
			}
			if (queryOptions.page) params.page = queryOptions.page.toString();

			const apiPath = `/repos/${owner}/${repo}/issues/${Number(
				issue_number,
			)}/sub_issues`;
			const res = await this.get(apiPath, params);
			if (res.statusCode === 404) {
				throw new Error(IssueNotFoundMsg);
			}
			if (res.data) {
				const IssueData: SubIssueListResponseType = await Promise.all(
					res.data.map(
						async (
							issue: Record<string, any>,
						): Promise<IssueInfoResponseType> => ({
							id: issue.id,
							html_url: issue.html_url,
							number: issue.number,
							state: issue.state,
							title: issue.title,
							body: issue.body,
							user: {
								id: issue.user.id,
								login: issue.user.login,
								name: isEmpty(res.data.user.name) ? null : res.data.user.name,
								email: isEmpty(res.data.user.email)
									? null
									: res.data.user.email,
								html_url: issue.user.html_url,
								avatar_url: issue.user.avatar_url,
							},
							labels: !isEmpty(issue.labels)
								? issue.labels.map(
										(label: Record<string, any>): IssueLabelType => ({
											id: label.id,
											name: label.name,
											color: label.color,
										}),
									)
								: null,
							assignee: !isEmpty(issue.assignee)
								? {
										id: issue.assignee.id,
										login: issue.assignee.login,
										name: isEmpty(res.data.assignee.name)
											? null
											: res.data.assignee.name,
										email: isEmpty(res.data.assignee.email)
											? null
											: res.data.assignee.email,
										html_url: issue.assignee.html_url,
										avatar_url: issue.assignee.avatar_url,
									}
								: null,
							assignees: !isEmpty(issue.assignees)
								? issue.assignees.map(
										(assignee: Record<string, any>): IssueUser => ({
											id: assignee.id,
											login: assignee.login,
											name: isEmpty(assignee.name) ? null : assignee.name,
											email: isEmpty(assignee.email) ? null : assignee.email,
											html_url: assignee.html_url,
											avatar_url: assignee.avatar_url,
										}),
									)
								: null,
							milestone: !isEmpty(issue.milestone)
								? {
										id: issue.milestone.id,
										url: issue.milestone.url,
										number: issue.milestone.number,
										state: issue.milestone.state,
										title: issue.milestone.title,
										description: issue.milestone.description,
										open_issues: issue.milestone.open_issues,
										closed_issues: issue.milestone.closed_issues,
										created_at: this.format
											? await format_date(issue.milestone.created_at)
											: issue.milestone.created_at,
										updated_at: this.format
											? await format_date(issue.milestone.updated_at)
											: issue.milestone.updated_at,
										closed_at: issue.milestone.closed_at
											? this.format
												? await format_date(issue.milestone.closed_at)
												: issue.milestone.closed_at
											: null,
										due_on: issue.milestone.due_on
											? this.format
												? await format_date(issue.milestone.due_on)
												: issue.milestone.due_on
											: null,
									}
								: null,
							created_at: this.format
								? await format_date(issue.created_at)
								: issue.created_at,
							updated_at: this.format
								? await format_date(issue.updated_at)
								: issue.updated_at,
							closed_at: !isEmpty(issue.closed_at)
								? this.format
									? await format_date(issue.closed_at)
									: issue.closed_at
								: null,
						}),
					),
				);
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 获取子议题列表失败: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * 创建子议题
	 * 添加一个子议题到指定的议题中
	 * @github
	 * 仅GitHub 平台使用
	 * 权限：
	 * - Issues：Write
	 * @param options 添加子议题的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number 父议题编号
	 * - sub_issue_id 子议题编号
	 * - replace_parent 是否替换父议题
	 * @returns 添加结果信息
	 * @example
	 * ```ts
	 * const res = await issue.add_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1, replace_parent:true })
	 * -> 创建子议题信息对象
	 * ```
	 */
	public async create_sub_issue(
		options: CreateSubIssueParamType,
	): Promise<ApiResponseType<CreateSubIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(IssueCommentNotFoundMsg);
		}
		if (!options.sub_issue_id) {
			throw new Error(MissingSubIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, sub_issue_id, replace_parent } =
				options;
			const res = await this.post(
				`/repos/${owner}/${repo}/issues/${issue_number}/sub_issues`,
				{
					sub_issue_id,
					replace_parent,
				},
			);
			if (res.statusCode === 404) {
				throw new Error(IssueNotFoundMsg);
			}
			if (res.data) {
				const [
					createdAt,
					updatedAt,
					closedAt,
					milestoneCreatedAt,
					milestoneUpdatedAt,
					milestoneClosedAt,
					milestoneDueOn,
				] = await Promise.all([
					this.format ? format_date(res.data.created_at) : res.data.created_at,
					this.format ? format_date(res.data.updated_at) : res.data.updated_at,
					!isEmpty(res.data.closed_at)
						? this.format
							? await format_date(res.data.closed_at)
							: res.data.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.created_at)
							: res.data.milestone.created_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.updated_at)
							: res.data.milestone.updated_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.closed_at)
							: res.data.milestone.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.due_on)
							: res.data.milestone.due_on
						: null,
				]);
				const IssueData: CreateSubIssueResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					number: res.data.number,
					state: res.data.state,
					title: res.data.title,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					labels: !isEmpty(res.data.labels)
						? res.data.labels.map(
								(label: Record<string, any>): IssueLabelType => ({
									id: label.id,
									name: label.name,
									color: label.color,
								}),
							)
						: null,
					assignee: !isEmpty(res.data.assignee)
						? {
								id: res.data.assignee.id,
								login: res.data.assignee.login,
								name: isEmpty(res.data.assignee.name)
									? null
									: res.data.assignee.name,
								email: isEmpty(res.data.assignee.email)
									? null
									: res.data.assignee.email,
								html_url: res.data.assignee.html_url,
								avatar_url: res.data.assignee.avatar_url,
							}
						: null,
					assignees: !isEmpty(res.data.assignees)
						? res.data.assignees.map(
								(assignee: Record<string, any>): IssueUser => ({
									id: assignee.id,
									login: assignee.login,
									name: isEmpty(assignee.name) ? null : assignee.name,
									email: isEmpty(assignee.email) ? null : assignee.email,
									html_url: assignee.html_url,
									avatar_url: assignee.avatar_url,
								}),
							)
						: null,
					milestone: !isEmpty(res.data.milestone)
						? {
								id: res.data.milestone.id,
								url: res.data.milestone.url,
								number: res.data.milestone.number,
								state: res.data.milestone.state,
								title: res.data.milestone.title,
								description: res.data.milestone.description,
								open_issues: res.data.milestone.open_issues,
								closed_issues: res.data.milestone.closed_issues,
								created_at: milestoneCreatedAt,
								updated_at: milestoneUpdatedAt,
								closed_at: milestoneClosedAt,
								due_on: milestoneDueOn,
							}
						: null,
					created_at: createdAt,
					updated_at: updatedAt,
					closed_at: closedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 添加子议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 添加子议题
	 * 添加一个子议题到指定的议题中
	 * @github
	 * 仅GitHub 平台使用
	 * @deprecated 已弃用，请使用`create_sub_issue`方法
	 */
	public async add_sub_issue(
		options: CreateSubIssueParamType,
	): Promise<ApiResponseType<CreateSubIssueResponseType>> {
		return await this.create_sub_issue(options);
	}

	/**
	 * 删除子议题
	 * @github
	 * 仅GitHub 平台使用
	 * 权限：
	 * - Issues：Write
	 * @param options 删除子议题的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number 父议题编号
	 * - sub_issue_id 子议题编号
	 * @returns 删除结果信息
	 * @example
	 * ```ts
	 * const res = await issue.remove_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1 })
	 * -> 删除子议题信息对象
	 * ```
	 */
	public async remove_sub_issue(
		options: RemoveSubIssueParamType,
	): Promise<ApiResponseType<RemoveSubIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(IssueCommentNotFoundMsg);
		}
		if (!options.sub_issue_id) {
			throw new Error(MissingSubIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, sub_issue_id } = options;
			const res = await this.delete(
				`/repos/${owner}/${repo}/issues/${issue_number}/sub_issue`,
				null,
				{
					sub_issue_id,
				},
			);
			if (res.statusCode === 404) {
				throw new Error(IssueNotFoundMsg);
			}
			if (res.data) {
				const [
					createdAt,
					updatedAt,
					closedAt,
					milestoneCreatedAt,
					milestoneUpdatedAt,
					milestoneClosedAt,
					milestoneDueOn,
				] = await Promise.all([
					this.format ? format_date(res.data.created_at) : res.data.created_at,
					this.format ? format_date(res.data.updated_at) : res.data.updated_at,
					!isEmpty(res.data.closed_at)
						? this.format
							? await format_date(res.data.closed_at)
							: res.data.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.created_at)
							: res.data.milestone.created_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.updated_at)
							: res.data.milestone.updated_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.closed_at)
							: res.data.milestone.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.due_on)
							: res.data.milestone.due_on
						: null,
				]);
				const IssueData: RemoveSubIssueResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					number: res.data.number,
					state: res.data.state,
					title: res.data.title,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					labels: !isEmpty(res.data.labels)
						? res.data.labels.map(
								(label: Record<string, any>): IssueLabelType => ({
									id: label.id,
									name: label.name,
									color: label.color,
								}),
							)
						: null,
					assignee: !isEmpty(res.data.assignee)
						? {
								id: res.data.assignee.id,
								login: res.data.assignee.login,
								name: isEmpty(res.data.assignee.name)
									? null
									: res.data.assignee.name,
								email: isEmpty(res.data.assignee.email)
									? null
									: res.data.assignee.email,
								html_url: res.data.assignee.html_url,
								avatar_url: res.data.assignee.avatar_url,
							}
						: null,
					assignees: !isEmpty(res.data.assignees)
						? res.data.assignees.map(
								(assignee: Record<string, any>): IssueUser => ({
									id: assignee.id,
									login: assignee.login,
									name: isEmpty(assignee.name) ? null : assignee.name,
									email: isEmpty(assignee.email) ? null : assignee.email,
									html_url: assignee.html_url,
									avatar_url: assignee.avatar_url,
								}),
							)
						: null,
					milestone: !isEmpty(res.data.milestone)
						? {
								id: res.data.milestone.id,
								url: res.data.milestone.url,
								number: res.data.milestone.number,
								state: res.data.milestone.state,
								title: res.data.milestone.title,
								description: res.data.milestone.description,
								open_issues: res.data.milestone.open_issues,
								closed_issues: res.data.milestone.closed_issues,
								created_at: milestoneCreatedAt,
								updated_at: milestoneUpdatedAt,
								closed_at: milestoneClosedAt,
								due_on: milestoneDueOn,
							}
						: null,
					created_at: createdAt,
					updated_at: updatedAt,
					closed_at: closedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(`[GitHub] 删除子议题失败: ${(error as Error).message}`);
		}
	}

	/**
	 * 删除子议题
	 * 删除一个子议题
	 * 权限：
	 * - Issues：Write
	 * @deprecated 请使用 remove_sub_issue 方法代替
	 */
	public async delete_sub_issue(
		options: RemoveSubIssueParamType,
	): Promise<ApiResponseType<RemoveSubIssueResponseType>> {
		return this.remove_sub_issue(options);
	}

	/**
	 * 重新排序子议题
	 * 重新确定子议题优先级
	 * @github
	 * 仅GitHub 平台使用
	 * 权限：
	 * - Issues：Write
	 * @param options 重新排序子议题的参数对象
	 * - owner 仓库拥有者
	 * - repo 仓库名称
	 * - issue_number 父议题编号
	 * - sub_issue_id 子议题编号
	 * - before_id 指定要在哪个子议题之前插入，传入目标子议题的编号
	 * - after_id 指定要在哪个子议题之后插入，传入目标子议题的编号
	 * @example
	 * ```ts
	 * const res = await issue.reprioritize_sub_issue({ owner: 'owner', repo:'repo', issue_number:1, sub_issue_id:1, before_id:1 })
	 * -> 排序子议题信息对象
	 * ```
	 */
	public async reprioritize_sub_issue(
		options: ReprioritizeSubIssueParamType,
	): Promise<ApiResponseType<ReprioritizeSubIssueResponseType>> {
		if (!options.owner || !options.repo) {
			throw new Error(MissingRepoOwnerOrNameMsg);
		}
		if (!options.issue_number) {
			throw new Error(IssueCommentNotFoundMsg);
		}
		if (!options.sub_issue_id) {
			throw new Error(MissingSubIssueNumberMsg);
		}
		try {
			this.setRequestConfig({
				token: this.userToken,
			});
			const { owner, repo, issue_number, sub_issue_id, ...queryOptions } =
				options;
			const params: Record<string, string> = {};

			if (queryOptions.before_id && !queryOptions.after_id) {
				params.before_id = queryOptions.before_id.toString();
			}
			if (queryOptions.after_id && !queryOptions.before_id) {
				params.after_id = queryOptions.after_id.toString();
			}
			const url = `/repos/${owner}/${repo}/issues/${issue_number}/sub_issues/priority`;
			const res = await this.patch(url, params, {
				sub_issue_id: String(sub_issue_id),
			});
			if (res.statusCode === 404) {
				throw new Error(IssueNotFoundMsg);
			}
			if (res.data) {
				const [
					createdAt,
					updatedAt,
					closedAt,
					milestoneCreatedAt,
					milestoneUpdatedAt,
					milestoneClosedAt,
					milestoneDueOn,
				] = await Promise.all([
					this.format ? format_date(res.data.created_at) : res.data.created_at,
					this.format ? format_date(res.data.updated_at) : res.data.updated_at,
					!isEmpty(res.data.closed_at)
						? this.format
							? await format_date(res.data.closed_at)
							: res.data.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.created_at)
							: res.data.milestone.created_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.updated_at)
							: res.data.milestone.updated_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.closed_at)
							: res.data.milestone.closed_at
						: null,
					!isEmpty(res.data.milestone)
						? this.format
							? await format_date(res.data.milestone.due_on)
							: res.data.milestone.due_on
						: null,
				]);
				const IssueData: ReprioritizeSubIssueResponseType = {
					id: res.data.id,
					html_url: res.data.html_url,
					number: res.data.number,
					state: res.data.state,
					title: res.data.title,
					body: res.data.body,
					user: {
						id: res.data.user.id,
						login: res.data.user.login,
						name: isEmpty(res.data.user.name) ? null : res.data.user.name,
						email: isEmpty(res.data.user.email) ? null : res.data.user.email,
						html_url: res.data.user.html_url,
						avatar_url: res.data.user.avatar_url,
					},
					labels: !isEmpty(res.data.labels)
						? res.data.labels.map(
								(label: Record<string, any>): IssueLabelType => ({
									id: label.id,
									name: label.name,
									color: label.color,
								}),
							)
						: null,
					assignee: !isEmpty(res.data.assignee)
						? {
								id: res.data.assignee.id,
								login: res.data.assignee.login,
								name: isEmpty(res.data.assignee.name)
									? null
									: res.data.assignee.name,
								email: isEmpty(res.data.assignee.email)
									? null
									: res.data.assignee.email,
								html_url: res.data.assignee.html_url,
								avatar_url: res.data.assignee.avatar_url,
							}
						: null,
					assignees: !isEmpty(res.data.assignees)
						? res.data.assignees.map(
								(assignee: Record<string, any>): IssueUser => ({
									id: assignee.id,
									login: assignee.login,
									name: isEmpty(assignee.name) ? null : assignee.name,
									email: isEmpty(assignee.email) ? null : assignee.email,
									html_url: assignee.html_url,
									avatar_url: assignee.avatar_url,
								}),
							)
						: null,
					milestone: !isEmpty(res.data.milestone)
						? {
								id: res.data.milestone.id,
								url: res.data.milestone.url,
								number: res.data.milestone.number,
								state: res.data.milestone.state,
								title: res.data.milestone.title,
								description: res.data.milestone.description,
								open_issues: res.data.milestone.open_issues,
								closed_issues: res.data.milestone.closed_issues,
								created_at: milestoneCreatedAt,
								updated_at: milestoneUpdatedAt,
								closed_at: milestoneClosedAt,
								due_on: milestoneDueOn,
							}
						: null,
					created_at: createdAt,
					updated_at: updatedAt,
					closed_at: closedAt,
				};
				res.data = IssueData;
			}
			return res;
		} catch (error) {
			throw new Error(
				`[GitHub] 重新排序子议题失败: ${(error as Error).message}`,
			);
		}
	}
}
