import { exec as execCmd, type ExecOptions, type ExecReturn, execSync as execSyncCmd } from '@candriajs/exec'
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