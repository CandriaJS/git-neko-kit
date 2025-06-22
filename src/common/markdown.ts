import { tasklist } from '@mdit/plugin-tasklist'
import MarkdownIt from 'markdown-it'
import { full as emoji } from 'markdown-it-emoji'
/**
 * 获取markdown渲染器
 * @description 这个是经过配置的markdown渲染器
 */
export async function get_markdown_render (): Promise<MarkdownIt> {
  const md = new MarkdownIt(
    {
      html: true,
      breaks: true
    }
  )
  md.use(emoji)
  md.use(tasklist)
  md.renderer.rules.bullet_list_open = () => '<ul style="list-style: none;">'
  return Promise.resolve(md)
}

/**
 * 渲染 markdown 内容为 HTML
 * @description 使用配置好的 markdown-it 实例渲染 markdown 内容
 * @param md - 要渲染的 markdown 字符串
 * @returns 渲染后的 HTML 字符串
 * @example
 * ```ts
 * const html = await render_markdown(`# 标题
 * - 无序列表项1
 * - 无序列表项2
 *   - 子列表项
 *
 * 1. 有序列表项1
 * 2. 有序列表项2
 * `);
 *
 * // 输出结果:
 * // <h1>标题</h1>
 * // <ul style="list-style: none;">
 * //   <li>无序列表项1</li>
 * //   <li>无序列表项2</li>
 * //   <ul style="list-style: none;">
 * //     <li>子列表项</li>
 * //   </ul>
 * // </ul>
 * // <ol style="list-style: none;">
 * //   <li>有序列表项1</li>
 * //   <li>有序列表项2</li>
 * // </ol>
 * ```
 */
export async function render_markdown (md: string): Promise<string> {
  const render = await get_markdown_render()
  return Promise.resolve(render.render(md))
}
