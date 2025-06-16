/** 通用参数验证 */
export const MissingAppClientMsg = '喵呜~ 当前客户端类型不是App类型, 不支持此操作哦'
export const MissingAppClientCredentialsMsg = '喵呜~ 应用客户端配置不完整'
export const MissingRequestPathMsg = '喵呜~ 请求路径不能为空'
export const MissingClientIDMsg = '喵呜~ 应用客户端ID不能为空'
export const MissingClientSecretMsg = '喵呜~ 应用客户端ID不能为空'
export const MissingPrivateKeyMsg = '喵呜~ 应用密钥不能为空'
export const MissingAppSlugMsg = '喵呜~ 应用标识符不能为空'
export const MissingAccessCodeMsg = '喵呜~ 授权码不能为空'
export const MissingAccessTokenMsg = '喵呜~ 访问令牌不能为空'
export const MissingRefreshTokenMsg = '喵呜~ 刷新令牌不能为空'
export const MissingTitleMsg = '喵呜~ 请提供标题'
export const MissingIssueOrTitleMsg = '喵呜~ 请提供Issue编号或标题'
export const InvalidParamMsg = '喵呜~ 参数好像不太对呢'
export const InvalidProxyAddressMsg = '喵呜~ 代理地址格式不正确哦'
export const MissingUrlParamMsg = '喵呜~ 仓库URL不能为空'
export const MissingLocalRepoPathMsg = '喵呜~ 本地仓库路径不能为空'
export const MissingRemoteRepoUrlMsg = '喵呜~ 远程仓库URL不能为空'
export const MissingProxyUrlMsg = '喵呜~ 代理URL不能为空'
export const GitTypeNotSupportedMsg = '喵呜~ 这个 Git 类型不支持哦'
export const UrlProtocoleNotSupportedMsg = '喵呜~ 这个 URL 协议不支持哦'
export const MissingRepoUrlMsg = (url: string) => `喵呜~ 仓库URL ${url} 不存在哦`
export const LocalRepoPathNotFoundMsg = (path: string) => `喵呜~ 本地仓库路径 ${path} 不存在哦`
export const GitClientNotInstalledMsg = '喵呜~ Git 客户端未安装或未正确配置'

/** 授权相关 */
export const InvalidAccessTokenMsg = '喵呜~ 这个令牌似乎不是有效的'
export const InvalidRefreshTokenMsg = '喵呜~ 这个刷新令牌似乎不是有效的'
export const ExpiredAccessTokenMsg = '喵呜~ 访问令牌已过期'
export const FailedToRefreshAccessTokenMsg = '喵呜~ 访问令牌刷新失败'
export const FailedToFetchAccessTokenMsg = '喵呜~ 获取访问令牌失败'
export const PermissionDeniedMsg = '喵呜~ 访问被拒绝啦，可能是令牌过期了或权限不足'
export const InvalidPullRequestMergeMethodMsg = '喵呜~ 拉取请求合并方式不允许'

/** 应用程序相关 */
export const MissingAppInstallIdMsg = '喵呜~ 应用安装ID不能为空'
export const FailedRevokeAppAccrssTokenMsg = '喵呜~ 撤销访问令牌失败'

/** 仓库相关 */
export const MissingRepoOwnerOrNameMsg = '喵呜~ 仓库拥有者或仓库名称不能为空'
export const MissingRepoIdentifierMsg = '喵呜~ 请提供仓库信息(仓库拥有者/仓库名或完整URL)'
export const RepoNotFoundMsg = '喵呜~ 这个仓库不存在哦'
export const RepoMovedMsg = '喵呜~ 这个仓库已被移动'
export const RepoOrPermissionDeniedMsg = '喵呜~ 这个仓库不存在或访问被拒绝啦，可能是令牌过期了或权限不足'
export const BranchNotFoundMsg = '喵呜~ 这个分支不存在哦'
export const CommitNotFoundMsg = '喵呜~ 这个提交不存在哦'
export const CommitOrRepoNotFoundMsg = '喵呜~ 这个提交或仓库不存在哦'
export const FailedToRemoveCollaboratorMsg = (username: string) => `喵呜~ 移除协作者失败${username}哦`

/** 用户相关 */
export const UserNotFoundMsg = '喵呜~ 这个用户不存在哦'
export const MissingUserIdParamMsg = '喵呜~ 用户ID不能为空'
export const MissingUserNameParamMsg = '喵呜~ 用户名不能为空'

/** 组织相关 */
export const OrgNotSupportedMsg = '喵呜~ 组织账号暂不支持'
export const OrgNotFoundMsg = '喵呜~ 这个组织不存在哦'
export const MissingOrgParamMsg = '喵呜~ 组织名不能为空'
export const OrgOrRepoNotFoundMsg = '喵呜~ 这个组织或仓库不存在哦'
export const OrgOrUserNotFoundMsg = '喵呜~ 这个组织或用户不存在哦'

/** 议题与拉取请求相关 */
export const IssueNotFoundMsg = '喵呜~ 这个议题不存在哦'
export const IssueMovedMsg = '喵呜~ 这个议题已被移动'
export const IssueCommentNotFoundMsg = '喵呜~ 这个议题评论不存在哦'
export const MissingLinkedIssueMsg = '喵呜~ 这个关联议题不能为空哦'
export const MissingLinkedIssueIdentifierMsg = '喵呜~ 这个关联议题编号或标题不能为空哦'
export const MissingIssueNumberMsg = '喵呜~ 这个议题编号不能为空哦'
export const MissingIssueBodyMsg = '喵呜~ 这个议题内容不能为空哦'
export const MissingIssueTitleMsg = '喵呜~ 议题标题不能为空哦'
export const MissingIssueCommentNumberMsg = '喵呜~ 这个议题评论编号不能为空哦'
export const MissingIssueCommentBodyMsg = '喵呜~ 这个议题评论内容不能为空哦'
export const MissingIssueMsg = '喵呜~ 请提供Issue编号'
export const MissingSubIssueNumberMsg = '喵呜~ 这个子议题编号不能为空哦'
export const FailedtoLockIssueMsg = '喵呜~ 锁定议题失败'
export const FailedtoUnlockIssueMsg = '喵呜~ 解锁议题失败'
export const FailedtoCloseIssueMsg = '喵呜~ 关闭议题失败'
export const FailedtoRemoveIssueMsg = '喵呜~ 删除议题失败'
export const MissingPullRequestCommentBodyMsg = '喵呜~ 这个拉取请求评论内容不能为空哦'
export const MissingPullRequestCommentNumberMsg = '喵呜~ 这个拉取请求评论编号不能为空哦'
export const MissingPullRequestNumberMsg = '喵呜~ 这个拉取请求编号不能为空哦'
export const MissingHeadBranchMsg = '喵呜~ 请提供源分支'
export const MissingBaseBranchMsg = '喵呜~ 请提供目标分支'
export const MissingPullRequestShaMsg = '喵呜~ 请提供拉取请求的SHA值'
export const PullRequestMergeMethodNotSupportedMsg = '喵呜~ 拉取请求的合并方式不支持'
export const PullRequestOrRepoNotFoundMsg = '喵呜~ 拉取请求编号或仓库不存在'
export const PullRequestCommentOrRepoNotFoundMsg = '喵呜~ 拉取请求评论编号或仓库不存在'
export const ConflictPullRequestShaValueMsg = '喵呜~ 这个SHA值与头部分支的SHA值不匹配'
export const PullRequestCommentUpdateFailedMsg = '喵呜~ 拉取请求评论更新失败'
export const PullRequestCommentRemoveFailedMsg = '喵呜~ 拉取请求评论删除失败'

/** 标签与发布相关 */
export const TagNotFoundMsg = '喵呜~ 这个标签不存在哦'
export const ReleaseNotFoundMsg = '喵呜~ 这个发布不存在哦'
export const ReleaseOrRepoNotFoundMsg = '喵呜~ 这个发布或仓库不存在哦'
export const FailedToDeleteReleaseMsg = '喵呜~ 这个发行版本删除失败哦'
export const MissingReleaseIdMsg = '喵呜~ 发行版本编号不能为空哦'

/** WebHook 相关 */
export const InvalidWebHookSignatureFormatMsg = '喵呜~ WebHook 签名格式不正确'
export const WebHookSignatureVerificationFailedMsg = '喵呜~ WebHook 签名验证失败'
export const MissingWebHookSecretMsg = '喵呜~ WebHook 签名密钥不能为空哦'
export const MissingWebHookPayloadMsg = '喵呜~ WebHook 请求体不能为空哦'
export const MissingWebHookSignatureMsg = '喵呜~ WebHook 签名头不能为空哦'

/** 其他 */
export const RateLimitExceededMsg = '喵呜~ 访问速率受限啦 请等待1小时后再试 或 使用访问令牌提升限额'
