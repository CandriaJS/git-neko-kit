import path from "node:path";

import { isEmpty, isObject, isString } from "radashi";

import { exists, readJSON } from "@/tools";
import { LocalRepoPathNotFoundMsg, MissingLocalRepoPathMsg } from "@/msg";
import { get_remote_repo_default_branch, parse_git_url } from "@/git";
import { exec } from "@/exec";
import type {
	NpmPackageInfoListOptionsType,
	NpmPackageInfoListType,
	NpmPackageInfoType,
	PkgInfoType,
} from "@/types";

/**
 * 获取仓库URL
 * @param repository
 * @returns
 */
function getRepoUrl(repository: PkgInfoType["repository"]): string | undefined {
	if (isString(repository)) {
		return repository;
	}
	if (isObject(repository)) {
		return repository.url;
	}
	return undefined;
}

/**
 * 创建包信息
 * @param packageJson 包信息
 * @param packagePath 包路径
 * @param repoUrl 包仓库地址
 */
async function createPackageInfo(
	packageJson: any,
	packagePath: string,
	repoUrl: string,
): Promise<NpmPackageInfoType> {
	const parsed = parse_git_url(repoUrl);
	return {
		name: packageJson.name,
		path: packagePath,
		html_url: parsed.html_url,
		owner: parsed.owner,
		repo: parsed.repo,
		default_branch: await get_remote_repo_default_branch(repoUrl),
	};
}

/**
 * 获取本地 NPM 包信息
 * @description 获取本地 NPM 包信息
 * @param packageName - 包名
 * @returns 包信息
 * @example
 * ```ts
 * console.log(get_local_npm_package_info('npm'))
 * -> {
 *   name: 'npm',
 *   path: 'C:\\Users\\username\\AppData\\Roaming\\npm\\node_modules\\npm',
 *   html_url: 'https://github.com/npm/cli',
 *   owner: 'npm',
 *   repo: 'cli'
 * }
 * ```
 */
export async function get_local_npm_package_info(
	packageName: string,
): Promise<NpmPackageInfoType | null> {
	try {
		if (!packageName) return null;
		const packagePath = path.join(process.cwd(), "node_modules", packageName);

		try {
			const { stdout } = await exec(`npm view ${packageName} --json`);
			if (stdout && !isEmpty(stdout)) {
				const packageJson = JSON.parse(stdout);
				const repoUrl = getRepoUrl(packageJson.repository)?.replace(
					/^git\+/,
					"",
				);
				if (repoUrl) {
					return await createPackageInfo(packageJson, packagePath, repoUrl);
				}
			}
		} catch {}

		if (!(await exists(packagePath))) return null;

		const packageJsonPath = path.join(packagePath, "package.json");
		if (!(await exists(packageJsonPath))) return null;

		const packageJson: PkgInfoType = await readJSON(packageJsonPath);
		if (isEmpty(packageJson)) {
			return null;
		}

		const repoUrl = getRepoUrl(packageJson.repository)?.replace(/^git\+/, "");
		if (!repoUrl) {
			return null;
		}

		return await createPackageInfo(packageJson, packagePath, repoUrl);
	} catch {
		return null;
	}
}

/**
 * 获取本地 NPM 包信息列表
 * @description 获取目录下已安装的生产依赖列表，过滤后递归获取包信息
 * @param dirpath - 项目目录路径
 * @param options - 过滤选项
 * - packageName 忽略的包名
 * - prefix 包名前缀
 * @returns 包信息列表
 * @example
 * ```ts
 * const packages = await get_local_npm_packages_list(dirpath)
 * -> {
 *   total: 1,
 *   items: [
 *     {
 *       name: 'test',
 *       path: 'D:\\test',
 *       html_url: 'https://github.com/test/test',
 *       owner: 'test',
 *       repo: 'test'
 *     }
 *   ]
 * }
 * ```
 */
export async function get_local_npm_packages_list(
	dirpath: string,
	options?: NpmPackageInfoListOptionsType,
): Promise<NpmPackageInfoListType> {
	const { packageName = [], prefix = "" } = options ?? {};
	if (!path) throw new Error(MissingLocalRepoPathMsg);
	if (!(await exists(dirpath)))
		throw new Error(LocalRepoPathNotFoundMsg(dirpath));
	const nodeModulesPath = path.join(dirpath, "node_modules");
	if (!(await exists(nodeModulesPath))) return { total: 0, items: [] };

	let prodDependencies: string[] = [];

	try {
		const { stdout } = await exec("npm list --prod --depth=0 --json", {
			cwd: dirpath,
		});

		if (stdout && !isEmpty(stdout)) {
			const npmList = JSON.parse(stdout);
			if (npmList.dependencies) {
				prodDependencies = Object.keys(npmList.dependencies);
			}
		}
	} catch (error) {
		const pkgJsonPath = path.join(dirpath, "package.json");
		if (!(await exists(pkgJsonPath))) return { total: 0, items: [] };
		const pkgJson: PkgInfoType = await readJSON(pkgJsonPath);
		if (isEmpty(pkgJson)) return { total: 0, items: [] };
		prodDependencies = Object.keys(pkgJson.dependencies ?? {});
	}

	const filteredDeps = prodDependencies
		.filter((pkg) => !packageName.includes(pkg))
		.filter((pkg) => !prefix || pkg.startsWith(prefix));

	const packagePromises = filteredDeps.map((pkg) =>
		get_local_npm_package_info(pkg),
	);
	const packageInfos = (await Promise.all(packagePromises)).filter(
		(info): info is NpmPackageInfoType => info !== null,
	);

	return {
		total: packageInfos.length,
		items: packageInfos,
	};
}
