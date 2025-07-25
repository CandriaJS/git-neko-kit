import { v4 as uuidv4 } from "uuid";
import { RgbToHex } from '@/tools';
import LanguageColors from "language-colors";
/**
 * 生成一个用户唯一的标识符
 * @returns 生成的唯一标识符
 * @example
 * ```ts
 * const stateId = await create_state_id()
 * -> '34523452345234523452345234523452'
 * ```
 */
export async function create_state_id(): Promise<string> {
	return Promise.resolve(uuidv4().replace(/-/g, ""));
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
export function get_langage_color(language: string): string {
	language = String(language).toLowerCase();
	return RgbToHex(LanguageColors[language].color) ?? "#ededed";
}