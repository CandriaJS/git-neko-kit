import fs from "node:fs";
import path from "node:path";

import type { ContributionResult } from "@/types";

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
export function readJSONSync<T = any>(filePath: string = ""): T {
	try {
		const absPath = path.resolve(filePath).replace(/\\/g, "/");
		if (!fs.existsSync(absPath)) {
			return {} as T;
		}
		const data = fs.readFileSync(absPath, "utf8");
		return JSON.parse(data) as T;
	} catch (error) {
		console.error(`读取 JSON 文件失败: ${filePath}`, error as Error);
		return {} as T;
	}
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
async function listSplit<T>(items: T[], n: number): Promise<T[][]> {
	return Promise.resolve(
		Array.from({ length: Math.ceil(items.length / n) }, (_, i) =>
			items.slice(i * n, i * n + n),
		),
	);
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
export async function get_contribution_data(
	html: string,
): Promise<ContributionResult> {
	try {
		if (!html) {
			return { total: 0, contributions: [] };
		}
		const dateRegex = /data-date="(.*?)" id="contribution-day-component/g;
		const countRegex =
			/<tool-tip .*?class="sr-only position-absolute">(.*?) contribution/g;
		const dates = Array.from(html.matchAll(dateRegex), (m) => m[1]);
		const counts = Array.from(html.matchAll(countRegex), (m) =>
			String(m[1]).toLowerCase() === "no" ? 0 : parseInt(m[1]),
		);
		if (!dates.length || !counts.length) {
			return { total: 0, contributions: [] };
		}
		const sortedData = dates
			.map((date, index) => ({ date, count: counts[index] }))
			.sort((a, b) => a.date.localeCompare(b.date));

		const contributions = await listSplit(sortedData, 7);
		return {
			total: counts.reduce((sum, count) => sum + count, 0),
			contributions,
		};
	} catch (error) {
		throw new Error(`解析贡献数据失败: ${(error as Error).message}`);
	}
}
