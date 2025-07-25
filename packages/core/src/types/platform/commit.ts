import type {
  RepoParamType,
  ShaParamType
} from '@/types/platform/base'
import type { UserInfoResponseType } from '@/types/platform/user'

export interface CommitInfoCommonParamType {
  /** 提交SHA */
  sha?: ShaParamType['sha'];
}

/** Git提交用户信息 */
export interface GitUser extends Omit<UserInfoResponseType, 'bio' | 'blog' | 'followers' | 'following' | 'public_repos'> {
  /** 日期字符串 */
  date: string;
}

export interface Commit {
  /** 提交的URL */
  url: string;
  /** 提交作者信息 */
  author: GitUser;
  /** 提交者信息 */
  committer: GitUser;
  /** 提交信息 */
  message: string;
  /**
   * 提交标题
   * 仅在开启格式化消息时返回
   * @example "feat: add new feature"
   */
  title?: string;
  /** 提交正文
   * 仅在开启格式化消息时返回
   * @example "-  add new feature"
   */
  body?: string | null;
  /** 提交树信息 */
  tree: {
    /** 树对象的SHA */
    sha: string;
    /** 树对象的URL */
    url: string;
  };
}

export interface DiffEntry {
  /** 文件SHA */
  sha: string;
  /** 文件名 */
  filename: string;
  /** 文件状态 */
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  /** 新增行数 */
  additions: number;
  /** 删除行数 */
  deletions: number;
  /** 总变更行数 */
  changes: number;
  /** 文件blob URL */
  blob_url: string;
  /** 文件原始URL */
  raw_url: string;
}

export interface CommitStats {
  /** 新增行数 */
  additions: number;
  /** 删除行数 */
  deletions: number;
  /** 总变更行数 */
  total: number;
}

export interface ParentCommit {
  /** 父提交SHA */
  sha: string;
  /** 父提交URL */
  url: string;
}

/** 提交参数类型 */
export type CommitInfoParamType = RepoParamType & CommitInfoCommonParamType
/** 提交信息响应类型 */
export interface CommitInfoResponseType {
  /** HTML URL */
  html_url: string;
  /** 提交SHA */
  sha: string;
  /** 评论URL */
  comments_url: string;
  /** 提交信息 */
  commit: Commit;
  /** 父提交列表 */
  parents: ParentCommit[];
  /** 提交统计信息 */
  stats: CommitStats;
  /** 变更文件列表 */
  files: DiffEntry[];
}

/** 提交列表参数类型  */
export type CommitListParamType = RepoParamType & {
  /** SHA 或分支名称，用于指定从哪里开始列出提交 */
  sha?: ShaParamType['sha'];
  /** 仅返回包含此文件路径的提交 */
  path?: string;
  /** GitHub 用户名或电子邮件地址，用于按提交作者筛选 */
  author?: string;
  /** ISO 8601 格式的时间戳 (YYYY-MM-DDTHH:MM:SSZ)，仅显示此时间之后更新的结果 */
  since?: string;
  /** ISO 8601 格式的时间戳 (YYYY-MM-DDTHH:MM:SSZ)，仅返回此时间之前的提交 */
  until?: string;
  /** 每页的结果数（最多 100），默认: 30 */
  per_page?: number;
  /** 要获取的结果页码，默认: 1 */
  page?: number;
}
/** 提交列表响应类型 */
export type CommitListResponseType = CommitInfoResponseType[]
