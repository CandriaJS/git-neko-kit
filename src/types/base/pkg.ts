export interface PkgInfoType {
  /** 包名 */
  name: string;
  /** 包版本 */
  version: string;
  /** 描述 */
  description?: string;
  /** 主入口文件 */
  main?: string;
  /** 关键字 */
  keywords?: string[];
  dependencies?: Record<string, string>
  /** 作者信息 */
  author?: string | {
    name: string;
    email?: string;
    url?: string;
  };
  /** 许可证 */
  license?: string;
  /** 仓库信息 */
  repository?: string | {
    type: string;
    url: string;
  };
  /** 问题追踪 */
  bugs?: {
    url?: string;
    email?: string;
  };
  /** 主页 */
  homepage?: string;
}
