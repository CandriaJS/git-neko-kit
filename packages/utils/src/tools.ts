/**
 * 此文件不公开导出
 */
import fs from "node:fs";
import path from "node:path";
import convert, { type RGB } from "color-convert";


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
export async function exists(path: string): Promise<boolean> {
	try {
		await fs.promises.access(path, fs.constants.F_OK);
		return true;
	} catch {
		return false;
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
export async function readJSON<T = any>(filePath: string = ""): Promise<T> {
	try {
		const absPath = path.resolve(filePath).replace(/\\/g, "/");
		if (!(await exists(absPath))) {
			return {} as T;
		}
		const data = await fs.promises.readFile(absPath, "utf8");
		return JSON.parse(data) as T;
	} catch (error) {
		console.error(`读取 JSON 文件失败: ${filePath}`, error as Error);
		return {} as T;
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
export function RgbToHex(rgb: RGB): string {
	if (!Array.isArray(rgb)) {
		throw new Error("RGB值必须是数组类型");
	}
	if (rgb.length !== 3) {
		throw new Error("RGB数组必须包含且仅包含3个值");
	}

	if (!rgb.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
		throw new Error("RGB值必须都是0-255之间的整数");
	}

	return `#${convert.rgb.hex(rgb)}`;
}