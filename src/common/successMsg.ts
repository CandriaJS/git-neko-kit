/** 应用程序相关 */
export const RevokeAccessTokenSuccessMsg = '喵呜~ 访问令牌撤销成功'

/** 授权相关 */
export const RefreshAccessTokenSuccessMsg = '喵呜~ 访问令牌刷新成功'
export const AccessTokenSuccessMsg = '喵呜~ 访问令牌获取成功'
export const AccessTokenValidMsg = '喵呜~ 访问令牌有效'
export const WebHookSignatureValidMsg = '喵呜~ WebHook 签名成功'

/** 仓库相关 */
export const RepoOperationSuccessMsg = '喵呜~ 仓库操作成功'
export const RemoveCollaboratorSuccessMsg = (username: string) => `喵呜~ 移除协作者成功${username}哦`
export const RunRepoWorkflowSuccessMsg = (workflowId: string | number) => `喵呜~ 工作流运行成功${workflowId}哦`
export const EnableRepoWorkflowSuccessMsg = (workflowId: string | number) => `喵呜~ 工作流启用成功${workflowId}哦`
export const DisableRepoWorkflowSuccessMsg = (workflowId: string | number) => `喵呜~ 工作流禁用成功${workflowId}哦`
export const ReRunRepoWorkflowSuccessMsg = (job_id: number) => `喵呜~ 工作流任务重新运行成功${job_id}哦`

/** 议题与PR相关 */
export const IssueLockSuccessMsg = '喵呜~ 议题锁定成功'
export const IssueUnlockSuccessMsg = '喵呜~ 议题解锁成功'
export const IssueCommentCreateSuccessMsg = '喵呜~ 议题评论创建成功'
export const IssueCommentRemoveSuccessMsg = '喵呜~ 议题评论删除成功'
export const PullRequestCommentUpdateSuccessMsg = '喵呜~ 拉取请求评论更新成功'
export const PullRequestCommentRemoveSuccessMsg = '喵呜~ 拉取请求评论删除成功'

/** 标签与发布相关 */
export const DeleteReleaseSuccessMsg = '喵呜~ 发行版本删除成功'
export const ReleaseOperationSuccessMsg = '喵呜~ 发布操作成功'

/** WebHook相关  */
export const WebHookSignatureSuccessMsg = '喵呜~ WebHook签名验证成功'
