import * as Diff2Html from 'diff2html'
import { ColorSchemeType } from 'diff2html/lib/types'

import { MissingDiffMsg } from './errorMsg'

/**
 * 渲染差异文本为HTML格式的可视化对比视图
 *
 * @param diff - 需要渲染的Git差异文本(diff格式字符串)
 * @param options - (可选) Diff2Html配置选项，用于自定义渲染行为
 * @returns 渲染后的HTML字符串
 *
 * @example
 * // 基本用法
 * const html = render_diff(diffText);
 *
 * @example
 * // 自定义配置
 * const html = render_diff(diffText, {
 *   outputFormat: 'line-by-line',
 *   colorScheme: ColorSchemeType.DARK
 * });
 */
export function render_diff (diff: string, options?: Diff2Html.Diff2HtmlConfig): string {
  if (!diff) throw new Error(MissingDiffMsg)
  const config: Diff2Html.Diff2HtmlConfig = {
    drawFileList: false,
    diffMaxChanges: 100,
    diffMaxLineLength: 300,
    matching: 'lines',
    colorScheme: ColorSchemeType.LIGHT,
    outputFormat: 'side-by-side',
    ...options
  }
  const outputHtml = Diff2Html.html(diff, config)
  return outputHtml
}
