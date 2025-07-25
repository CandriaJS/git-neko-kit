import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

const localeCache = new Set<string>(["en"]);

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
async function load_locale(locale: string = "zh-cn"): Promise<void> {
	const normalizedLocale = String(locale).toLowerCase();
	if (localeCache.has(normalizedLocale)) {
		dayjs.locale(normalizedLocale);
		return;
	}
	await import(`dayjs/locale/${normalizedLocale}.js`);
	dayjs.locale(locale);
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
export async function format_date(
	dateString: string,
	locale: string = "zh-cn",
	format: string = "YYYY-MM-DD HH:mm:ss",
): Promise<string> {
	await load_locale(locale);
	const date = dayjs(dateString).locale(locale);
	return date.format(format);
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
export async function get_relative_time(
	dateString: string,
	options?: {
		locale?: string;
		useAbsoluteIfOver30Days?: boolean;
	},
): Promise<string> {
	const { locale = "zh-cn", useAbsoluteIfOver30Days = false } = options ?? {};
	await load_locale(locale);
	dayjs.extend(relativeTime);
	const date = dayjs(dateString).locale(locale);
	const now = dayjs();
	const diffInDays = now.diff(date, "day");

	if (useAbsoluteIfOver30Days && diffInDays > 30) {
		return date.format("YYYY-MM-DD HH:mm:ss");
	}

	return date.fromNow();
}