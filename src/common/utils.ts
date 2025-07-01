import fs from 'node:fs'
import path from 'node:path'

import { exec as execCmd, type ExecOptions, type ExecReturn, execSync as execSyncCmd } from '@candriajs/exec'
import convert, { type RGB } from 'color-convert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import GitUrlParse from 'git-url-parse'
import LanguageColors from 'language-colors'

import type {
  ContributionResult,
  GitRepoType
} from '@/types'

const localeCache = new Set<string>(['en'])

/**
 * 异步执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = await exec('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = await exec('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = await exec('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export async function exec<T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> {
  return await execCmd(cmd, options)
}

/**
 * 同步执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = execSync('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = execSync('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = execSync('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export function execSync<T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): ExecReturn<T> {
  return execSyncCmd(cmd, options)
}

/**
 * 异步判断文件是否存在
 * @param path - 文件路径
 * @returns 是否存在
 * @example
 * ```ts
 * console.log(await exists('package.json'))
 * -> true
 * console.log(await exists('not-exists.json'))
 * -> false
 * ```
 */
export async function exists (path: string): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * 同步读取 JSON 文件并转换为指定类型
 * @template T - 返回数据的类型
 * @param file - 文件名
 * @param root - 根目录
 * @returns JSON 数据
 * @example
 * ```ts
 * interface Config { name: string; version: string }
 * const pkg = readJSONSync<Config>('package.json')
 * -> {
 *   name: 'test',
 *   version: '1.0.0'
 *  }
 * ```
 */
export function readJSONSync<T = any> (filePath: string = ''): T {
  try {
    const absPath = path.resolve(filePath).replace(/\\/g, '/')
    if (!fs.existsSync(absPath)) {
      return {} as T
    }
    const data = fs.readFileSync(absPath, 'utf8')
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`读取 JSON 文件失败: ${filePath}`, error as Error)
    return {} as T
  }
}

/**
 * 异步读取 JSON 文件并转换为指定类型
 * @template T - 返回数据的类型
 * @param file - 文件名
 * @param root - 根目录
 * @returns JSON 数据
 * @example
 * ```ts
 * interface Config { name: string; version: string }
 * const pkg = await readJSON<Config>('package.json')
 * -> {
 *   name: 'test',
 *   version: '1.0.0'
 *  }
 * ```
 */
export async function readJSON<T = any> (filePath: string = ''): Promise<T> {
  try {
    const absPath = path.resolve(filePath).replace(/\\/g, '/')
    if (!await exists(absPath)) {
      return {} as T
    }
    const data = await fs.promises.readFile(absPath, 'utf8')
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`读取 JSON 文件失败: ${filePath}`, error as Error)
    return {} as T
  }
}

/**
 * 加载语言配置
 * @param options 配置对象
 * -  locale 语言，如：zh-cn, en
 * @returns 语言配置
 * @example
 * ```
 * const locale = await load_locale('zh-cn')
 * ```
 */
async function load_locale (locale: string = 'zh-cn'): Promise<void> {
  const normalizedLocale = String(locale).toLowerCase()
  if (localeCache.has(normalizedLocale)) {
    dayjs.locale(normalizedLocale)
    return
  }
  await import(`dayjs/locale/${normalizedLocale}.js`)
  dayjs.locale(locale)
}

/**
 * 格式化日期
 * @param dateString - 日期字符串
 * @param locale - 语言环境，默认为 'zh-cn'
 * @param format - 日期格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example
 * ```ts
 * console.log(await format_date('2025-04-16T10:00:00')
 * -> '2025-04-16 10:00:00'
 * ```
 */
export async function format_date (
  dateString: string,
  locale: string = 'zh-cn',
  format: string = 'YYYY-MM-DD HH:mm:ss'
): Promise<string> {
  await load_locale(locale)
  const date = dayjs(dateString).locale(locale)
  return date.format(format)
}

/**
 * 获取相对时间
 * @param dateString - 日期字符串
 * @param options - 可选参数对象
 * @param options.locale - 语言环境，默认为 'zh-cn'
 * @param options.useAbsoluteIfOver30Days - 是否在超过30天时返回绝对时间
 * @returns 相对时间或绝对时间
 * @example
 * ```ts
 * console.log(await get_relative_time('2023-04-01 12:00:00'))
 * -> "1 小时前"
 *
 * // 如果当前时间距离该日期已超过30天，则返回绝对时间
 * console.log(await get_relative_time('2023-01-01 12:00:00', { useAbsoluteIfOver30Days: true }))
 * -> "2025-07-01 13:00:00"
 * ```
 */
export async function get_relative_time (
  dateString: string,
  options?: {
    locale?: string,
    useAbsoluteIfOver30Days?: boolean
  }
): Promise<string> {
  const { locale = 'zh-cn', useAbsoluteIfOver30Days = false } = options ?? {}
  await load_locale(locale)
  dayjs.extend(relativeTime)
  const date = dayjs(dateString).locale(locale)
  const now = dayjs()
  const diffInDays = now.diff(date, 'day')

  if (useAbsoluteIfOver30Days && diffInDays > 30) {
    return date.format('YYYY-MM-DD HH:mm:ss')
  }

  return date.fromNow()
}

/**
 * 解析 Git 仓库地址
 * @description 解析 Git 仓库地址，返回仓库拥有者、仓库名称、仓库类型等信息, 如果是代理地址，则只支持http协议
 * @param url - Git 仓库地址
 * @returns Git 仓库信息
 * @example
 * ```ts
 * console.log(parse_git_url('https://github.com/user/repo.git'))
 * -> { owner: 'user', repo: 'repo', html_url: 'https://github.com/user/repo.git' }
 * console.log(parse_git_url('https://ghproxy.com/github.com/user/repo.git'))
 * -> { owner: 'user', repo: 'repo', html_url: 'https://github.com/user/repo.git' }
 * console.log(parse_git_url('https://ghproxy.com/https://github.com/user/repo.git'))
 * -> { owner: 'user', repo: 'repo', html_url: 'https://github.com/user/repo.git' }
 * ```
 */
export function parse_git_url (url: string): GitRepoType {
  const proxyRegex = /^https?:\/\/[^/]+\/(?:https?:\/\/)?([^/]+\/[^/]+\/[^/]+)/
  const proxyMatch = url.match(proxyRegex)

  if (proxyMatch) {
    const path = proxyMatch[1]
    url = path.startsWith('https') ? path : `https://${path}`
  }

  const info = GitUrlParse(url)
  return {
    html_url: info.toString('https').replace(/\.git$/, ''),
    owner: info.owner,
    repo: info.name
  }
}

/**
 * 将 RGB 颜色值转换为十六进制颜色代码
 * @param rgb - RGB颜色值数组，必须是包含3个0-255之间整数的数组
 * @returns 十六进制颜色代码
 * @example
 * ```ts
 * console.log(RgbToHex([255, 128, 0]))
 * -> '#ff8000'
 * ```
 */
export function RgbToHex (rgb: RGB): string {
  if (!Array.isArray(rgb)) {
    throw new Error('RGB值必须是数组类型')
  }
  if (rgb.length !== 3) {
    throw new Error('RGB数组必须包含且仅包含3个值')
  }

  if (!rgb.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) {
    throw new Error('RGB值必须都是0-255之间的整数')
  }

  return `#${convert.rgb.hex(rgb)}`
}

/**
 * 根据语言名称获取对应的颜色值
 * @param language - 语言名称
 * @returns 颜色值的十六进制字符串
 * @example
 * ```ts
 * console.log(get_langage_color('JavaScript'))
 * -> '#f1e05a'
 * ```
 */
export function get_langage_color (language: string): string {
  language = String(language).toLowerCase()
  return RgbToHex(LanguageColors[language].color) ?? '#ededed'
}
/**
 * 将数组按指定大小分割成二维数组
 * @param items - 要分割的数组
 * @param n - 每个子数组的大小
 * @returns 分割后的二维数组
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * const result = await listSplit(arr, 3)
 * -> [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 * ```
 */
async function listSplit<T> (items: T[], n: number): Promise<T[][]> {
  return Promise.resolve(Array.from({ length: Math.ceil(items.length / n) }, (_, i) =>
    items.slice(i * n, i * n + n)
  )
  )
}

/**
 * 从HTML中解析贡献数据
 * @param html - 包含贡献数据的HTML字符串
 * @returns 解析后的贡献数据，包括总贡献数和按周分组的贡献数据
 * @throws 如果解析过程中发生错误，将抛出异常
 * @example
 * ```ts
 * const result = await get_contribution_data(html)
 * -> { total: 5, contributions: [[{ date: '2023-04-16', count: 5 }]] }
 * ```
 */
export async function get_contribution_data (html: string): Promise<ContributionResult> {
  try {
    if (!html) {
      return { total: 0, contributions: [] }
    }
    const dateRegex = /data-date="(.*?)" id="contribution-day-component/g
    const countRegex = /<tool-tip .*?class="sr-only position-absolute">(.*?) contribution/g
    const dates = Array.from(html.matchAll(dateRegex), m => m[1])
    const counts = Array.from(html.matchAll(countRegex), m =>
      String(m[1]).toLowerCase() === 'no' ? 0 : parseInt(m[1])
    )
    if (!dates.length || !counts.length) {
      return { total: 0, contributions: [] }
    }
    const sortedData = dates
      .map((date, index) => ({ date, count: counts[index] }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const contributions = await listSplit(sortedData, 7)
    return {
      total: counts.reduce((sum, count) => sum + count, 0),
      contributions
    }
  } catch (error) {
    throw new Error(`解析贡献数据失败: ${(error as Error).message}`)
  }
}
