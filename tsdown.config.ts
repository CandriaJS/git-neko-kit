import { defineConfig, type Options } from 'tsdown'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


export const options: Options =({
  entry: ['src/index.ts', 'src/root.ts'],      // 入口文件
  format: ['cjs', 'esm'],       // ESM格式
  nodeProtocol: true, // 转换node:protocol
  unbundle: false,                 // 保持目录结构
  fixedExtension: true,             // 统一扩展名
  dts: true,                    // 生成类型声明文件
  clean: true,                  // 清理dist目录
  minify: true,                 // 压缩生产环境代码
  target: 'node22',             // 指定ECMAScript目标版本
  sourcemap: false,              // 生成sourcemap
  treeshake: true,              // 启用树摇优化
  platform: 'node',            // 指定为Node.js环境
  outputOptions: {
    exports: 'named',
  },
  outDir: 'dist',               // 指定输出目录 
  hooks(hooks) {
    hooks.hook('build:done', () => {
      copyFiles()
    })
  },
})

export const expOptions: Options = ({
  entry: ['src/exports/*.ts'],      // 入口文件
  format: ['cjs', 'esm'],       // ESM格式
  unbundle: false,                 // 保持目录结构
  nodeProtocol: true, // 转换node:protocol
  fixedExtension: true,             // 统一扩展名
  dts: true,                    // 生成类型声明文件
  clean: true,                  // 清理dist目录
  minify: true,                 // 压缩生产环境代码
  target: 'node22',             // 指定ECMAScript目标版本
  sourcemap: false,              // 生成sourcemap
  treeshake: true,              // 启用树摇优化
  platform: 'node',            // 指定为Node.js环境
  outDir: 'dist/exports',               // 指定输出目录 
  hooks(hooks) {
    hooks.hook('build:done', () => {
      copyExpFiles()
    })
  },
})

export default [defineConfig(options), defineConfig(expOptions)]

const copyFiles = () => {
  const file_name_path = fileURLToPath(import.meta.url)
  const file_path = dirname(file_name_path)

  const distDir = path.join(file_path, 'dist')

  // 删除 .d.cts 文件
  fs.readdirSync(distDir).forEach((file) => {
    if (file.endsWith('.d.cts')) {
      fs.rmSync(path.join(distDir, file))
    }
    if (file.endsWith('.js')) {
      const oldPath = path.join(distDir, file)
      const newPath = path.join(distDir, file.replace('.js', '.mjs'))
      fs.renameSync(oldPath, newPath)
    }
  })

  console.log('构建目录成功!')
}

const copyExpFiles = () => {
  const file_name_path = fileURLToPath(import.meta.url)
  const file_path = dirname(file_name_path)

  const distDir = path.join(file_path, 'dist', 'exports')

  fs.readdirSync(distDir).forEach((file) => {
    // 删除 .d.cts 文件
    if (file.endsWith('.d.cts')) {
      fs.rmSync(path.join(distDir, file))
    }
  })

  console.log('构建导出依赖目录成功!')
}