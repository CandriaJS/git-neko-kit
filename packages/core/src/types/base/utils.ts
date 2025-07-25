/**
 * 单日贡献数据
 */
export interface ContributionData {
  /** 日期字符串，格式为YYYY-MM-DD */
  date: string
  /** 当日的贡献次数 */
  count: number
}

/**
 * 贡献统计结果
 */
export interface ContributionResult {
  /** 总贡献次数 */
  total: number
  /**
   * 二维数组结构的贡献数据
   * 第一维通常表示周数，第二维表示每周的贡献数据
   */
  contributions: ContributionData[][]
}
