/** Github 授权令牌接口返回类型 */
export interface GithubOauthTokenResponseType {
  /** 用户访问令牌， 格式为 ghu_ 开头 */
  access_token: string;
  /** access_token 过期前的秒数，默认值为 28800（8小时） */
  expires_in: number | null;
  /** 刷新令牌，格式为 ghr_ 开头，可能为 null */
  refresh_token: `ghr_${string}` | null;
  /** refresh_token 过期前的秒数，默认值为 15897600（6个月） */
  refresh_token_expires_in: number | null;
  /** 令牌范围，默认是空字符串 */
  scope: string;
  /** 令牌类型，始终为 'bearer' */
  token_type: 'bearer';
}

/** Github 刷新令牌接口返回类型 */
export interface GithubOauthRefreshTokenResponseType {
  /** 是否成功刷新 */
  success: boolean;
  /** 刷新令牌信息 */
  info: string;
  /** 用户访问令牌，格式为 ghu_ 开头 */
  access_token: string;
  /** access_token 过期前的秒数，默认值为 28800（8小时） */
  expires_in: number | null;
  /** 刷新令牌，格式为 ghr_ 开头，可能为 null */
  refresh_token: `ghr_${string}` | null;
  /** refresh_token 过期前的秒数，默认值为 15897600（6个月），可能为 null */
  refresh_token_expires_in: number | null;
  /** 令牌范围，默认是空字符串 */
  scope: string;
  /** 令牌类型，始终为 'bearer' */
  token_type: 'bearer';
}

/** 检查Token状态返回类型 */
export interface GithubOauthCheckTokenResponseType {
  /** 令牌是否有效 */
  success: boolean;
  /** 状态信息 */
  info: string;
}
