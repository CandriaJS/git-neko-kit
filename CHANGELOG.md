# 变更日志

## [1.2.0](https://github.com/CandriaJS/git-neko-kit/compare/v1.1.1...v1.2.0) (2025-07-06)


### ✨ 新功能

* **common:** 添加差异渲染函数 ([26064ac](https://github.com/CandriaJS/git-neko-kit/commit/26064ac1e2c1784785e06d6448b3e41c4f18646a))


### ♻️ 代码重构

* **deps:** 用 radash 替代 lodash ([aa365e4](https://github.com/CandriaJS/git-neko-kit/commit/aa365e4b913d35d18ea8846d10979e264671f0d8))


### 📦️ 构建系统

* 重构构建配置并迁移至 tsdown ([#77](https://github.com/CandriaJS/git-neko-kit/issues/77)) ([0996820](https://github.com/CandriaJS/git-neko-kit/commit/09968208aafa3fb2b80b1527cb8d2a850f63da3e))

## [1.1.1](https://github.com/CandriaJS/git-neko-kit/compare/v1.1.0...v1.1.1) (2025-07-02)


### 🐛 错误修复

* **markdown:** 修复 Markdown 渲染中的链接格式问题 ([fd19135](https://github.com/CandriaJS/git-neko-kit/commit/fd19135c650c171dfdd66997b8cbbfdeb82e492d))
* **models:** 修复 PR 查询时的空值异常 ([f4c7f8e](https://github.com/CandriaJS/git-neko-kit/commit/f4c7f8e5190c78c8011b7dddd0610c2ff41912fe))


### ⚡️ 性能优化

* **utils:** 优化 get_relative_time 函数功能 ([c59a79e](https://github.com/CandriaJS/git-neko-kit/commit/c59a79e0d1be64bec0dfe33c43289d6953b30486))


### 📝 文档更新

* **common:** 更新 markdown.ts 文件中的示例输出 ([c42c42a](https://github.com/CandriaJS/git-neko-kit/commit/c42c42a2806b0708fb8b001d224d96c73a128b43))


### ♻️ 代码重构

* **platform:** 优化代理配置 ([2775a6d](https://github.com/CandriaJS/git-neko-kit/commit/2775a6d48112aa56ef458b55cbf00fe3308e28ee))

## [1.1.0](https://github.com/CandriaJS/git-neko-kit/compare/v1.0.0...v1.1.0) (2025-06-22)


### ✨ 新功能

* **common:** 添加 markdown 渲染功能 ([4b71cf2](https://github.com/CandriaJS/git-neko-kit/commit/4b71cf24675bcb78ec565204be1903d5349f92bc))


### 🐛 错误修复

* **github:** 优化 Issue 类中对 milestone 数据的处理 ([9c8d5dd](https://github.com/CandriaJS/git-neko-kit/commit/9c8d5dd5100091be49e349215c09b87943d9b5b2))
* 修复议题ID类型 ([e4456c0](https://github.com/CandriaJS/git-neko-kit/commit/e4456c08ee101702cb61904ac4a582c68dc4075f))

## [1.0.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.9.0...v1.0.0) (2025-06-19)


### ⚠ BREAKING CHANGES

* **git, npm:** 添加仓库默认分支信息

### ✨ 新功能

* **common:** 添加获取本地 NPM 包信息的功能 ([22a3565](https://github.com/CandriaJS/git-neko-kit/commit/22a356509333d30b3bbffe17af9b577a165c9baf))
* **git, npm:** 添加仓库默认分支信息 ([c2c53b1](https://github.com/CandriaJS/git-neko-kit/commit/c2c53b179ec5e858ba68d3f8ab0f8b4c32e2b8ac))

## [0.9.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.7...v0.9.0) (2025-06-19)


### ✨ 新功能

* **github:** 添加仓库工作流操作功能 ([7b4a1d2](https://github.com/CandriaJS/git-neko-kit/commit/7b4a1d2511856b7317031c6376911acd94cd1b0f))
* **git:** 添加获取本地 Git 仓库信息列表功能 ([5fa4ca2](https://github.com/CandriaJS/git-neko-kit/commit/5fa4ca2a9cd92885366677b884bd9d3d5069eec2))
* **models:** 添加 GitHub 搜索功能 ([9790882](https://github.com/CandriaJS/git-neko-kit/commit/97908822aeaef810b3c8874453d18fe70aa147c6))
* **package:** 添加 exec 模块导出 ([2df83b8](https://github.com/CandriaJS/git-neko-kit/commit/2df83b8ef336715d49e0b455a3d88968a22d60ca))
* **platform/github:** 添加 workflow 功能 ([e495e65](https://github.com/CandriaJS/git-neko-kit/commit/e495e655d6e91d1ca31270a33efb7808b2d54c94))


### ♻️ 代码重构

* **github:** 重构 GitHub Issue 日期格式化处理 ([9fec27b](https://github.com/CandriaJS/git-neko-kit/commit/9fec27bbd0c3c9322de46684c091fdd4986567f1))
* **github:** 重构 GitHub 日期格式化处理 ([c73036b](https://github.com/CandriaJS/git-neko-kit/commit/c73036b5d692f354998212e5705002fad5ddff73))
* **github:** 重构 GitHubClient 类的初始化和请求逻辑 ([d702460](https://github.com/CandriaJS/git-neko-kit/commit/d7024604412c24c3572084a029a2aaef30877309))
* **proxy:** 重构代理配置相关代码 ([5fe94cf](https://github.com/CandriaJS/git-neko-kit/commit/5fe94cf6ff0f7f54504b1238e0a904de12522ed7))

## [0.8.7](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.6...v0.8.7) (2025-06-16)


### 🐛 错误修复

* **common:** 修复获取本地仓库默认分支函数 ([f65ab00](https://github.com/CandriaJS/git-neko-kit/commit/f65ab0098ae1ea1a98aa9d49588d94b42794daaf))
* **pull-request:** 优化 PR 状态显示并处理时间字段 ([4c8acf0](https://github.com/CandriaJS/git-neko-kit/commit/4c8acf00412e29a65e5b085f26da1dc1f7e41840))


### ♻️ 代码重构

* **github:** 优化 GitHub 客户端并更新相关模型 ([588caa0](https://github.com/CandriaJS/git-neko-kit/commit/588caa0a26b1b517799668988642fc9ede61b1a4))
* **github:** 优化类型定义和代码结构 ([eca5f32](https://github.com/CandriaJS/git-neko-kit/commit/eca5f32f256701411b80c668e6a8ae7f755e9b1f))
* **github:** 移除议题状态原因字段 ([fca4e16](https://github.com/CandriaJS/git-neko-kit/commit/fca4e16539f57c65caec4a7f532895203f95c1b9))
* **github:** 重构 GitHub API 响应处理 ([6f6281c](https://github.com/CandriaJS/git-neko-kit/commit/6f6281c881294a752b658386c8c300dbaa28651e))
* **types:** 重构平台类型定义 ([293362f](https://github.com/CandriaJS/git-neko-kit/commit/293362fa16182575b71265ad231a9c85ead45062))
* **types:** 重构平台类型定义 ([e8f8de0](https://github.com/CandriaJS/git-neko-kit/commit/e8f8de0ffd784ac598720d9b36648e49d8fb2ca3))

## [0.8.6](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.5...v0.8.6) (2025-06-15)


### ♻️ 代码重构

* **github:** 重构 GitHub 应用相关类型定义 ([5d58185](https://github.com/CandriaJS/git-neko-kit/commit/5d5818590bc0bf3846c896809efccf58a4a6d4e2))

## [0.8.5](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.4...v0.8.5) (2025-06-15)


### ♻️ 代码重构

* **models:** 重构 GitHub 平台相关代码 ([8b754e6](https://github.com/CandriaJS/git-neko-kit/commit/8b754e6428961971fa980321456ec3e8b1eb4a5b))

## [0.8.4](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.3...v0.8.4) (2025-06-14)


### ♻️ 代码重构

* **github:** 重构议题和仓库相关模型 ([1ca1cb1](https://github.com/CandriaJS/git-neko-kit/commit/1ca1cb1e250e53fd42132162246b68943f7a8e85))

## [0.8.3](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.2...v0.8.3) (2025-06-14)


### ⚡️ 性能优化

* **common:** 优化日期格式化功能并缓存语言设置 ([8361aea](https://github.com/CandriaJS/git-neko-kit/commit/8361aea63e75025ac3ad59f6b5640b3a11090813))

## [0.8.2](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.1...v0.8.2) (2025-06-13)


### 🐛 错误修复

* **models:** 修复 GitHub 提交信息格式问题 ([f446de0](https://github.com/CandriaJS/git-neko-kit/commit/f446de07c3f3a625fe75744b0701e5d6f1df2423))

## [0.8.1](https://github.com/CandriaJS/git-neko-kit/compare/v0.8.0...v0.8.1) (2025-06-13)


### ♻️ 代码重构

* **common:** 重构 exec 函数并添加日志功能 ([269e424](https://github.com/CandriaJS/git-neko-kit/commit/269e4249a1a511fee58b6b393ddec5db09647892))

## [0.8.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.7...v0.8.0) (2025-06-13)


### ✨ 新功能

* **github:** 支持个人令牌和 App 令牌两种登录方式 ([#64](https://github.com/CandriaJS/git-neko-kit/issues/64)) ([8170ff0](https://github.com/CandriaJS/git-neko-kit/commit/8170ff003564f8c67cdf55d186c1cf13ac4c5708))
* **github:** 添加组织成员功能 ([b122f5c](https://github.com/CandriaJS/git-neko-kit/commit/b122f5cfdee66cb90e746bc6014e4dbea06d0261))
* **models:** 添加 GitHub pull_request 管理类 ([ebb71bd](https://github.com/CandriaJS/git-neko-kit/commit/ebb71bd366c57b123bd0127b7eaf6b9102692125))


### 🐛 错误修复

* 类型修复 ([dcc59aa](https://github.com/CandriaJS/git-neko-kit/commit/dcc59aa779689a9c556c97cbe7ae197e9bcb92d0))
* 类型修复 ([7d0f0d7](https://github.com/CandriaJS/git-neko-kit/commit/7d0f0d73c865d7096280aad1ca9d768b1536714c))


### ⚡️ 性能优化

* **github:** 优化获取仓库默认分支功能并添加远程仓库支持 ([78f2443](https://github.com/CandriaJS/git-neko-kit/commit/78f2443bb1adac8a5de262eca38d882cd9f5ff2b))
* **repo:** 添加创建用户仓库功能 ([7eb8ab0](https://github.com/CandriaJS/git-neko-kit/commit/7eb8ab0858df0e3ef398bbc769fbc7759bdc0c38))
* 优化完善拉取请求类 ([#60](https://github.com/CandriaJS/git-neko-kit/issues/60)) ([6404cdd](https://github.com/CandriaJS/git-neko-kit/commit/6404cddb8c769b939b15fad2090068cc7e1f5a6e))


### ♻️ 代码重构

* **errorMsg:** 重构错误信息模块并优化错误消息 ([#63](https://github.com/CandriaJS/git-neko-kit/issues/63)) ([46c0081](https://github.com/CandriaJS/git-neko-kit/commit/46c00815e59abe4a8d953c67e0852411438514a1))
* **github:** 优化 Commit 类中的代码结构 ([11caec2](https://github.com/CandriaJS/git-neko-kit/commit/11caec2e57979ff36e8f057e6d836c88926230f0))
* **github:** 移除日期格式化相关代码 ([#61](https://github.com/CandriaJS/git-neko-kit/issues/61)) ([aec0eb8](https://github.com/CandriaJS/git-neko-kit/commit/aec0eb8962f029eba615a05e9f5cd5392c30cc77))
* **github:** 重构组织相关接口和类型定义 ([1de887f](https://github.com/CandriaJS/git-neko-kit/commit/1de887f72a2a429245c27d54f279c3d046f69b4f))
* **models:** 优化 GitHub 应用客户端验证逻辑 ([74ef31a](https://github.com/CandriaJS/git-neko-kit/commit/74ef31a1820981a77687a4fdd91de03f267258bc))
* **models:** 优化请求类和 GitHub 客户端的配置处理 ([7315b31](https://github.com/CandriaJS/git-neko-kit/commit/7315b315d30f77e11f487dafb7baf5c8e5b5b055))
* **models:** 重命名 API 基础 URL 函数 ([4fa4850](https://github.com/CandriaJS/git-neko-kit/commit/4fa4850c9af352cd3383041495b462b06191cb92))
* **models:** 重构 GitHub 相关模块 ([df30562](https://github.com/CandriaJS/git-neko-kit/commit/df305626abb9e58f1e8af8980ac76f4ebf191178))
* **types:** 重构客户端类型定义 ([a8bce2a](https://github.com/CandriaJS/git-neko-kit/commit/a8bce2a3ffa1eb25bc2bd285cbab60a71a0b190b))


### 📦️ 构建系统

* 添加 dayjs、lodash 和 simple-git 的类型导出 ([2da49d6](https://github.com/CandriaJS/git-neko-kit/commit/2da49d6cf4cd96913a3dd406023ef416aecbc8a2))


### 🎡 持续集成

* **deploy:** 优化 Cloudflare Pages 部署 ([e91d32a](https://github.com/CandriaJS/git-neko-kit/commit/e91d32a30b2f640d6f53f4422a56d9121bc7fc2b))
* **deploy:** 优化 GitHub Actions 部署流程 ([586a348](https://github.com/CandriaJS/git-neko-kit/commit/586a348e5150b048c432b7bc0dfd0fd35064e467))
* 修复 PR 合并时的版本选择错误 ([7394f75](https://github.com/CandriaJS/git-neko-kit/commit/7394f75c7c3abc1c338e836255edf516ff49d88c))

## [0.7.7](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.6...v0.7.7) (2025-05-27)


### 🐛 错误修复

* **models:** 优化 GitHub 用户 token 验证逻辑 ([66d4607](https://github.com/CandriaJS/git-neko-kit/commit/66d46074fba0484d2be62d5ff901fd770c5b4505))
* **user:** 修复获取用户贡献数据异常处理 ([3f66038](https://github.com/CandriaJS/git-neko-kit/commit/3f6603858704a44ef2a6df2cf3de62f878ec6a46))


### ⚡️ 性能优化

* **GitHub:** 增加用户公开仓库数量字段 ([c4eb33e](https://github.com/CandriaJS/git-neko-kit/commit/c4eb33e7fd928741b60630168b9e665f89172923))


### ♻️ 代码重构

* **platform/github:** 移除用户信息中的 company 字段 ([950acd8](https://github.com/CandriaJS/git-neko-kit/commit/950acd83860c9904aba101c9d206688697d42188))

## [0.7.6](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.5...v0.7.6) (2025-05-27)


### 🐛 错误修复

* 通过访问令牌获取用户信息时出现异常错误 ([caff0a7](https://github.com/CandriaJS/git-neko-kit/commit/caff0a79c01841003d11795d00d80abfbcae68c8))

## [0.7.5](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.4...v0.7.5) (2025-05-27)


### ♻️ 代码重构

* **github:** 优化 WebHook 签名验证逻辑 ([156ff2e](https://github.com/CandriaJS/git-neko-kit/commit/156ff2e294efb7d8183f5e84d54db0b60ed51a59))


### 🎡 持续集成

* **release:** 修正同步镜像源的依赖项 ([166a906](https://github.com/CandriaJS/git-neko-kit/commit/166a90660a490d4961a373b9bfb0b9e34c8f0d8c))

## [0.7.4](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.3...v0.7.4) (2025-05-27)


### 🐛 错误修复

* **github:** 优化 commit 信息获取及格式化 ([f998620](https://github.com/CandriaJS/git-neko-kit/commit/f998620ae78fd7107f380b3522361a2aeebe4163))


### ⚡️ 性能优化

* **github:** 添加获取提交列表功能 ([fd4bd30](https://github.com/CandriaJS/git-neko-kit/commit/fd4bd30f862123590e79abc70cc9049631dce88c))

## [0.7.3](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.2...v0.7.3) (2025-05-26)


### ♻️ 代码重构

* 优化项目结构和打包配置 ([3cb1da6](https://github.com/CandriaJS/git-neko-kit/commit/3cb1da6d1afc6949ec65d6dfb64a516e18018de1))

## [0.7.2](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.1...v0.7.2) (2025-05-26)


### 🐛 错误修复

* 类型修复 ([7e57f99](https://github.com/CandriaJS/git-neko-kit/commit/7e57f99a5b1a08f2df1c5b0421f7607abe8cb01e))

## [0.7.1](https://github.com/CandriaJS/git-neko-kit/compare/v0.7.0...v0.7.1) (2025-05-26)


### 🐛 错误修复

* 类型修复 ([3004a7a](https://github.com/CandriaJS/git-neko-kit/commit/3004a7a3dccadc8c51bd1e7e448dafbafd15aafc))

## [0.7.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.6.1...v0.7.0) (2025-05-26)


### ✨ 新功能

* **proxy:** 增加反向代理支持并优化代理配置 ([f96714a](https://github.com/CandriaJS/git-neko-kit/commit/f96714a1354a3c54d2fcecd72e3ca8ffbdb25d68))


### ♻️ 代码重构

* **github:** 优化 Commit 类中 author 和 committer 的处理逻辑 ([2e840a8](https://github.com/CandriaJS/git-neko-kit/commit/2e840a89bdbe23df96fb3ba9b6e1d57ecc3e59ea))
* **github:** 优化仓库信息获取接口 ([1e72738](https://github.com/CandriaJS/git-neko-kit/commit/1e72738b1de14c00d01757aaea0b7a1d35b1945b))
* **github:** 重构 GitHub 相关代码 ([8c1b883](https://github.com/CandriaJS/git-neko-kit/commit/8c1b8835e14d879acab0c358ca9f717e84077bdd))
* **github:** 重构仓库信息接口 ([9a7a884](https://github.com/CandriaJS/git-neko-kit/commit/9a7a8842e1f8f281fc7940e013e136ab5acc1669))

## [0.6.1](https://github.com/CandriaJS/git-neko-kit/compare/v0.6.0...v0.6.1) (2025-05-25)


### 🐛 错误修复

* 类型错误 ([45ab2e5](https://github.com/CandriaJS/git-neko-kit/commit/45ab2e529d8cd8bf0c89974de4c197d112de137a))


### ♻️ 代码重构

* **src:** 重构代码导出方式并优化代码格式 ([1fa44b4](https://github.com/CandriaJS/git-neko-kit/commit/1fa44b4808c98922c3be87496b8f5de2365601bc))


### 📦️ 构建系统

* **deps:** 调整项目依赖项 ([814999c](https://github.com/CandriaJS/git-neko-kit/commit/814999c7677cfdab994c9aa17da1f5c5af9d2101))

## [0.6.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.5.2...v0.6.0) (2025-05-24)


### ✨ 新功能

* **platform/github:** 添加 Release 操作类并更新相关类型定义 ([b08e3b4](https://github.com/CandriaJS/git-neko-kit/commit/b08e3b47ccde814eafb2023f7e73a2fbfff2dbb3))
* **src:** 重构并添加新功能 ([b2ebd4e](https://github.com/CandriaJS/git-neko-kit/commit/b2ebd4e611b80d9ba3a458c5eacb7b28bb65c638))


### 📝 文档更新

* 更新 issue 模板中的文档链接和标题格式 ([247d980](https://github.com/CandriaJS/git-neko-kit/commit/247d980cfac5574e978982ffd0cda272696d16ad))


### ♻️ 代码重构

* **src:** 重构 GitHub 客户端并优化导出 ([98a3d54](https://github.com/CandriaJS/git-neko-kit/commit/98a3d546073dc0c60db677faaeefad5d4f71b213))
* 统一并标准化所有平台的返回结构 ([#45](https://github.com/CandriaJS/git-neko-kit/issues/45)) ([6014e34](https://github.com/CandriaJS/git-neko-kit/commit/6014e342d3a7cb52c46980c639ddd3c2e8a2a21b))


### 📦️ 构建系统

* **tsup:** 重构项目构建配置 ([dcc1a77](https://github.com/CandriaJS/git-neko-kit/commit/dcc1a77ef9720e84c3cac80370d64ed29edec84d))


### 🎡 持续集成

* 使用 GitHub App 令牌处理过期和新创建的问题 ([d11e6d6](https://github.com/CandriaJS/git-neko-kit/commit/d11e6d6a7218d2e934baab1c78a2389bce369328))

## [0.5.2](https://github.com/CandriaJS/git-neko-kit/compare/v0.5.1...v0.5.2) (2025-05-12)


### ♻️ 代码重构

* 更新项目仓库地址和作者信息 ([edb704e](https://github.com/CandriaJS/git-neko-kit/commit/edb704e97cf0caa1a5be64a76f301a34ca54eab1))

## [0.5.1](https://github.com/CandriaJS/git-neko-kit/compare/v0.5.0...v0.5.1) (2025-05-12)


### 📦️ 构建系统

* **release:** 移除设置 pnpm 和包名步骤 ([96cd660](https://github.com/CandriaJS/git-neko-kit/commit/96cd660864253cad1af2af27fa000a4f7ef9c5a9))

## [0.5.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.4.4...v0.5.0) (2025-05-12)


### ✨ 新功能

* **issue:** 添加 Issue 更新、关闭、打开、锁定和解锁功能 ([0444bf0](https://github.com/CandriaJS/git-neko-kit/commit/0444bf0bc82a8a1eed714617d4cb048c2564c46d))
* **issue:** 添加 Issue 评论相关方法并优化错误提示 ([5ad66ff](https://github.com/CandriaJS/git-neko-kit/commit/5ad66ffc237b55f5b9baca41922c2b52757da6e7))
* **issue:** 添加子议题相关功能并优化议题评论接口 ([76eecc8](https://github.com/CandriaJS/git-neko-kit/commit/76eecc87620db8114e1b697d799586ea49c7f7ba))
* **issue:** 添加获取 Issue 评论相关功能 ([d781d98](https://github.com/CandriaJS/git-neko-kit/commit/d781d98e4362839f167426b74561d79f7a43adfa))


### 🐛 错误修复

* **org:** 修复组织信息获取功能 ([6ac03a5](https://github.com/CandriaJS/git-neko-kit/commit/6ac03a5e31a9982db9b6b75acd130c646a92df52))


### 📝 文档更新

* **models:** 更新排序子议题接口文档 ([ee2445f](https://github.com/CandriaJS/git-neko-kit/commit/ee2445fe0f41819413e903bff9e9f81192e15299))
* 优化函数描述 ([0c27d48](https://github.com/CandriaJS/git-neko-kit/commit/0c27d48c9cd15bd62e3fba41ec4a886fee8bac73))
* 完善 GitHub API 权限说明和代码示例 ([a969aa6](https://github.com/CandriaJS/git-neko-kit/commit/a969aa6d996270d86811e24874ed7202f244f53f))


### ♻️ 代码重构

* **github:** 修正议题列表参数类型定义 ([7b1c51d](https://github.com/CandriaJS/git-neko-kit/commit/7b1c51d413c7ee32c586bd30912544cda8d60bce))
* **models:** 移除 GitHub App 模块的注册功能 ([2bc9fdc](https://github.com/CandriaJS/git-neko-kit/commit/2bc9fdc727155dff8b5c73e0b0d09a8798b3f0d4))


### 🎡 持续集成

* **release:** 更新发布流程并修改包名 ([d4ae445](https://github.com/CandriaJS/git-neko-kit/commit/d4ae4455fee5e31229513c05f77c323ab4bba492))
* 更新发布流程和包名 ([8d10522](https://github.com/CandriaJS/git-neko-kit/commit/8d1052200cd6bd0aecdde6a4601000bbeb04f050))

## [0.4.4](https://github.com/CandriaJS/git-neko-kit/compare/v0.4.3...v0.4.4) (2025-05-06)


### 🎡 持续集成

* **release:** 修复发布到 GitHub 包Registry的 token 密钥对 ([f3fef38](https://github.com/CandriaJS/git-neko-kit/commit/f3fef38ab42c6c7bbbd8e1a21bdb38dd6ae6cc8c))

## [0.4.3](https://github.com/CandriaJS/git-neko-kit/compare/v0.4.2...v0.4.3) (2025-05-06)


### 🎡 持续集成

* 调整 GitHub Actions 权限设置 ([af03fe9](https://github.com/CandriaJS/git-neko-kit/commit/af03fe993fbbd4067685d06e297224d960d181bd))

## [0.4.2](https://github.com/CandriaJS/git-neko-kit/compare/v0.4.1...v0.4.2) (2025-05-06)


### 🎡 持续集成

* **release:** 更新 GitHub Actions 工作流 ([a1599bf](https://github.com/CandriaJS/git-neko-kit/commit/a1599bfb44ef5c6633d9d2c888d3086eece03bc2))

## [0.4.1](https://github.com/CandriaJS/git-neko-kit/compare/v0.4.0...v0.4.1) (2025-05-06)


### 🎡 持续集成

* **release:** 优化发布流程并集成 pnpm ([2f5229f](https://github.com/CandriaJS/git-neko-kit/commit/2f5229f688d31e4a370028e2c58cdc1f80fe451d))

## [0.4.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.3.0...v0.4.0) (2025-05-06)


### ✨ 新功能

* **collaborator:** 添加获取协作者列表功能 ([9152618](https://github.com/CandriaJS/git-neko-kit/commit/91526183d05b11c909db270d5373f47a4104583f))
* **github:** 添加 GitHub Issue 相关操作支持 ([36449c7](https://github.com/CandriaJS/git-neko-kit/commit/36449c7ffe31eb26ffcad1960379bee472f3f73d))
* **github:** 添加删除协作者功能并优化请求方法 ([aac526d](https://github.com/CandriaJS/git-neko-kit/commit/aac526d184c03110a821891f44761f4e1edbe248))
* **github:** 添加获取Issue详情的功能 ([02aea42](https://github.com/CandriaJS/git-neko-kit/commit/02aea42e9f2086c9f0fa7448c8d03bd172d38924))
* **github:** 添加获取仓库默认分支功能 ([2ecdab3](https://github.com/CandriaJS/git-neko-kit/commit/2ecdab38ca2289e11d8047333d4e0200a8e3d637))
* **github:** 添加通过仓库获取应用安装信息的功能 ([d95a1e0](https://github.com/CandriaJS/git-neko-kit/commit/d95a1e02f2581757a4a809ec7308b4031eb1634b))
* **github:** 添加速率限制错误处理 ([e37e89a](https://github.com/CandriaJS/git-neko-kit/commit/e37e89a58ab24e28e10a80aad837a4f46c173e09))
* **github:** 添加邀请协作者接口及相应类型定义 ([036290f](https://github.com/CandriaJS/git-neko-kit/commit/036290fa90e516c46b514ca5238c4e1eb88c4a73))
* **github:** 重构 GitHub API 并添加格式化功能 ([0f8bd31](https://github.com/CandriaJS/git-neko-kit/commit/0f8bd31c5c78d9d03f234593a69f03f068b96fd5))
* **issue:** 添加发送Issue功能并优化Issue列表获取 ([6d0a3c5](https://github.com/CandriaJS/git-neko-kit/commit/6d0a3c5646f38bc18d321dd661e3482ce9768900))
* **platform/github:** 新增协作者管理功能 ([be3069e](https://github.com/CandriaJS/git-neko-kit/commit/be3069e5405818f30b7ee7b621487b3540445903))
* **platform/github:** 添加 Issue 功能模块并优化类型导入 ([f121c71](https://github.com/CandriaJS/git-neko-kit/commit/f121c71dfa4f609855817465a061b5bebc790e91))
* **request:** 添加 DELETE 请求方法 ([9950ae0](https://github.com/CandriaJS/git-neko-kit/commit/9950ae033aeb791b25af872f05f2903f251a9d9c))
* **request:** 添加 PUT 请求方法 ([4c0f88c](https://github.com/CandriaJS/git-neko-kit/commit/4c0f88c4f03eafdd07fcc91ce4c544675e0c7f8e))


### 🐛 错误修复

* **auth:** 修复一处类型错误 ([9b5aef2](https://github.com/CandriaJS/git-neko-kit/commit/9b5aef251b5edf29f60bcecbe68263cfca1dc025))
* **models:** 修复添加协作者时的权限验证问题 ([a238008](https://github.com/CandriaJS/git-neko-kit/commit/a238008d923bd9fc73ffa54114d5af7375660227))
* **models:** 修复添加协作者时的错误处理 ([b8866ef](https://github.com/CandriaJS/git-neko-kit/commit/b8866ef41c5e2b2387e610766397cf75f4f38c9c))
* **platform:** 在 get 请求中添加用户 token 配置 ([a32eb28](https://github.com/CandriaJS/git-neko-kit/commit/a32eb2848b8953b4e3067eaf8954bf1c8ac65605))
* **platform:** 在 get 请求中添加用户 token 配置 ([b37645a](https://github.com/CandriaJS/git-neko-kit/commit/b37645a621e468dba4b4b6a9a04ded3737628c7d))
* 修复类型错误，都怪狐狐 ([4d290d6](https://github.com/CandriaJS/git-neko-kit/commit/4d290d61e05e489aa2876a7f75b74aba844147ad))


### ⚡️ 性能优化

* **models:** 优化 GitHub 协作者邀请功能 ([8709168](https://github.com/CandriaJS/git-neko-kit/commit/8709168d1364c8cc505b8a169550039571f01487))


### ♻️ 代码重构

* **collaborator:** 优化协作者列表接口返回类型定义 ([383638d](https://github.com/CandriaJS/git-neko-kit/commit/383638d89957bafd9b534ff9d938961aab1d8a87))
* **common:** 优化 GitHub 代理 URL 的解析逻辑 ([9d73cee](https://github.com/CandriaJS/git-neko-kit/commit/9d73cee415ee79b98f6290b2bebbc8e587763d25))
* **common:** 重构 parse_git_url 函数 ([512cf91](https://github.com/CandriaJS/git-neko-kit/commit/512cf911753e586911fda1b27585a649f4731d8b))
* **github:** 优化 GitHub API 调用和错误处理 ([c9510a0](https://github.com/CandriaJS/git-neko-kit/commit/c9510a00a8a495cf793b70292a80fa6019eb9f38))
* **github:** 优化仓库信息获取逻辑 ([56ea0eb](https://github.com/CandriaJS/git-neko-kit/commit/56ea0eb6330159337d5579753206cee32926877e))
* **github:** 优化用户仓库列表获取方式 ([79e40ef](https://github.com/CandriaJS/git-neko-kit/commit/79e40ef74f6a6cdbd1eb2d62623e3c1cc80d1e1f))
* **github:** 优化通过访问令牌获取用户信息的方法 ([8eca6cb](https://github.com/CandriaJS/git-neko-kit/commit/8eca6cbf86931f78510ac8129ab7dd2f919c256e))
* **github:** 更新协作者权限类型定义并添加默认值说明 ([46c7c1a](https://github.com/CandriaJS/git-neko-kit/commit/46c7c1adad9921fad3dce3b55ad35f5bbe20569c))
* **github:** 移除 APP_ID 字段并使用 Client_ID 生成 JWT ([691629b](https://github.com/CandriaJS/git-neko-kit/commit/691629b08e5225f8d203298c24562769e22061bb))
* **github:** 移除 Collaborator 类并整合到 Repo 类 ([4be3449](https://github.com/CandriaJS/git-neko-kit/commit/4be3449fc5168a015337a4d92bb4b6c3e795bde4))
* **github:** 重构仓库列表接口参数 ([240565e](https://github.com/CandriaJS/git-neko-kit/commit/240565e35ace5d571c5ffadeabc397f1de68cb3e))
* **github:** 重构议题创建功能 ([bebe6f7](https://github.com/CandriaJS/git-neko-kit/commit/bebe6f7c54f7abce8577ea585d71ba7660e3d171))
* **models:** 优化 GitHub 相关模型的文档注释 ([e90fc87](https://github.com/CandriaJS/git-neko-kit/commit/e90fc87a169e9b4b00baed9690179fdb3acc8882))
* **models:** 移除 GitHub 请求中的重复代码 ([1c5e2bd](https://github.com/CandriaJS/git-neko-kit/commit/1c5e2bdd0a32b9d10349e19a00cc5b3a74aeab6d))
* **src/common/utils.ts:** 优化代码注释和函数定义 ([96e7ee2](https://github.com/CandriaJS/git-neko-kit/commit/96e7ee2fc504bda6525de1c795c6b479683b30b4))
* **src:** 优化 GitHub 用户模型方法 ([ffa7fc5](https://github.com/CandriaJS/git-neko-kit/commit/ffa7fc5f80e0e4280e4ff3626b5a0bb4f3a03a8b))
* **src:** 优化代理配置设置逻辑 ([92fb30b](https://github.com/CandriaJS/git-neko-kit/commit/92fb30bbe0ee28a999ddd70ec364f77faeea6617))


### 📦️ 构建系统

* **deps:** 更新 ESLint 至 9.25.0 版本 ([5d2245c](https://github.com/CandriaJS/git-neko-kit/commit/5d2245cdde8cd5769a82a48fd18a3e0d30d84da1))


### 🎡 持续集成

* **release:** 更新发布流程并移除 CHANGELOG.md ([dcc8ea9](https://github.com/CandriaJS/git-neko-kit/commit/dcc8ea9cecfed8078c7ff133708f2f694cf074a7))
* 优化预览版发布工作流 ([d35d192](https://github.com/CandriaJS/git-neko-kit/commit/d35d192c0caba806e1961a747f568854c607f980))

## [0.3.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.2.0...v0.3.0) (2025-04-18)


### ✨ 新功能

* **auth:** 完善 Token 验证和错误处理 ([111d3e9](https://github.com/CandriaJS/git-neko-kit/commit/111d3e9ccaefbd2a1f876d53754c1b2c610484e8))
* **commit:** 格式化提交信息中的日期 ([56d2b6b](https://github.com/CandriaJS/git-neko-kit/commit/56d2b6b35c389e3728b93cb0da9888dd065f1851))
* **common:** 优化日期处理功能并添加相对时间功能 ([8c92b2b](https://github.com/CandriaJS/git-neko-kit/commit/8c92b2b2aeb3f03b78548297cfbc82f555524d49))
* **github/user:** 添加通过用户id获取用户信息方法 ([ab78d8b](https://github.com/CandriaJS/git-neko-kit/commit/ab78d8b18d350d765b4f024707c8254771e35794))
* **github:** 完善错误处理和消息提示 ([f94ed08](https://github.com/CandriaJS/git-neko-kit/commit/f94ed08e0455da236c06cc3cec382796666fd1a0))
* **github:** 添加 WebHook 签名验证功能 ([2a6a928](https://github.com/CandriaJS/git-neko-kit/commit/2a6a928e8b27b0129f22dd9c777f3eb7930a6634))
* **github:** 添加获取仓库可见性的功能 ([f422f7b](https://github.com/CandriaJS/git-neko-kit/commit/f422f7bfd9f94807aa1cfb7aacb6f0d35445e739))
* **github:** 添加获取用户仓库列表功能 ([4efe253](https://github.com/CandriaJS/git-neko-kit/commit/4efe253d6f256d9edf9fd46a951145ce2e4569b2))
* **models/github:** 添加 webhook 模型并更新配置 ([784bc8a](https://github.com/CandriaJS/git-neko-kit/commit/784bc8a30b16f9f70fdf0a84fc3e77a5d9b7325f))
* **models:** 添加生成用户唯一标识符的功能并优化导出 ([da934a9](https://github.com/CandriaJS/git-neko-kit/commit/da934a9cb87fdb42c5a74b15aef38715b78c4486))
* **src:** 导出日期格式化和相对时间函数 ([f83081d](https://github.com/CandriaJS/git-neko-kit/commit/f83081da28df9b911e30af0f9500508fdfb2d99d))
* **user:** 添加快速获取用户信息的方法 ([97dd3df](https://github.com/CandriaJS/git-neko-kit/commit/97dd3df2af3bd080613650d12198b97c7417deca))


### 🐛 错误修复

* **dayjs:** 修复 dayjs 本地化文件导入路径 ([dd2d05c](https://github.com/CandriaJS/git-neko-kit/commit/dd2d05c56e539ba8679b96599a3c042c2bbe8c99))
* **github:** 为获取 commit 信息设置正确的 token ([f7f2b8d](https://github.com/CandriaJS/git-neko-kit/commit/f7f2b8dfc2006fa8cfc2cdccd20e813c32b6597c))
* **github:** 为获取 commit 信息设置正确的 token ([42aff21](https://github.com/CandriaJS/git-neko-kit/commit/42aff21e7739fbf747518caba60e5dbb26ea4736))
* **github:** 优化用户仓库获取逻辑 ([472d591](https://github.com/CandriaJS/git-neko-kit/commit/472d591c8ccbfe92bd293976e0bdb8c6ead163d8))
* **github:** 修复获取仓库列表的参数处理 ([93d16f5](https://github.com/CandriaJS/git-neko-kit/commit/93d16f5a689a9be1d95da358138db7a7ff3542cd))
* **github:** 增加对 422 错误的处理 ([f57f284](https://github.com/CandriaJS/git-neko-kit/commit/f57f2848a1bfe12d4cc99fa1a28089efcfe73427))
* **models:** 修复错误消息 ([e5899f0](https://github.com/CandriaJS/git-neko-kit/commit/e5899f0feeef98449e5fafecc544194fe797e6c9))
* **platform/github:** 修复初始化实例APP_ID的类型 ([c33ee56](https://github.com/CandriaJS/git-neko-kit/commit/c33ee56a374c2464b11014cbace073ecf9c3814c))
* **repo:** 修复获取组织仓库列表逻辑 ([aa2cd03](https://github.com/CandriaJS/git-neko-kit/commit/aa2cd038920b65a2993782fc4c6fa053e971cbfd))
* **user:** 修复获取用户信息的异常输出 ([f422579](https://github.com/CandriaJS/git-neko-kit/commit/f4225791e2cb44abc49271e7770bddbaacf7bb4b))


### 📝 文档更新

* **README:** 更新 GitHub SDK 使用示例 ([3665148](https://github.com/CandriaJS/git-neko-kit/commit/3665148e02c557dd8a140ad201cbdfcb3cb7d405))
* 初始化 VuePress 文档构建流程 ([45ff8a3](https://github.com/CandriaJS/git-neko-kit/commit/45ff8a3e08d4c10e396cb46dcac3116a5ac93835))


### ♻️ 代码重构

* **common:** 优化代码格式和错误处理 ([507d7fa](https://github.com/CandriaJS/git-neko-kit/commit/507d7fa484ca664aee68c43645ee21555f9e3540))
* **common:** 优化语言包加载逻辑并统一代理设置 ([f185851](https://github.com/CandriaJS/git-neko-kit/commit/f185851dd7bb1d6837ea7be31244c5dd76f0f846))
* **common:** 新增错误消息模块并优化错误处理 ([1323b13](https://github.com/CandriaJS/git-neko-kit/commit/1323b13088e7159d8395731c1c54e8d7cbd66703))
* **date:** 重构日期格式化方法 ([3b0f68f](https://github.com/CandriaJS/git-neko-kit/commit/3b0f68f811883cea6af917f311317dfacb5e24cf))
* **github:** 优化 GitHub 授权链接创建方法 ([a446f5e](https://github.com/CandriaJS/git-neko-kit/commit/a446f5ec8ce7ee8e530a4ef442b2a97139a21db0))
* **github:** 优化 token 状态检查逻辑 ([b8d8fd7](https://github.com/CandriaJS/git-neko-kit/commit/b8d8fd738be72b7f3918ead4234c629d864469b5))
* **github:** 优化仓库相关接口的参数处理和错误提示 ([b7592f6](https://github.com/CandriaJS/git-neko-kit/commit/b7592f690fa1819a2812e2c9e9c34d522fb3586f))
* **github:** 优化提交信息获取功能 ([0b33dae](https://github.com/CandriaJS/git-neko-kit/commit/0b33daea44ab04bb5602002b0d6da07dcaa652f6))
* **github:** 简化 get_repo_visibility 接口返回类型 ([ee077ee](https://github.com/CandriaJS/git-neko-kit/commit/ee077eeb12f78d8012a71876e87083f0a1bf9b49))
* **github:** 重构 Base 类以优化模块导入和实例化 ([de77e08](https://github.com/CandriaJS/git-neko-kit/commit/de77e081dbaa7aa20e6d8b4b906e8c0b0097f465))
* **github:** 重构 GitHub API 基础类 ([2f8ca1d](https://github.com/CandriaJS/git-neko-kit/commit/2f8ca1d33089dafbfbfc78f15fba8733935a75a7))
* **github:** 重构 GitHub API 方法命名 ([10f4b63](https://github.com/CandriaJS/git-neko-kit/commit/10f4b63aff906eae0f6b4586952ae02a63e341ae))
* **github:** 重构 GitHub 平台相关代码 ([8b54dd8](https://github.com/CandriaJS/git-neko-kit/commit/8b54dd8aeca72c060d74af6278e883954c0280f5))
* **github:** 重构 GitHub 相关类的构造函数并优化 webhook 功能 ([7aed3ae](https://github.com/CandriaJS/git-neko-kit/commit/7aed3ae1e31af28bbdae257f3122a426bbe3f145))
* **github:** 重构 WebHook 签名验证逻辑 ([a5f3d73](https://github.com/CandriaJS/git-neko-kit/commit/a5f3d7356b56832b102b83bb82a21afc636a384f))
* **github:** 重构获取用户仓库列表逻辑 ([4a177cd](https://github.com/CandriaJS/git-neko-kit/commit/4a177cd8035796a862cec5ff89abe5ebea34ebf2))
* **models:** 优化 GitHub App 和 Auth 类 ([ce19c01](https://github.com/CandriaJS/git-neko-kit/commit/ce19c01b1ff719a7a55d4a6de9532dc5d637cb2f))
* **models:** 优化代理配置逻辑 ([01f036f](https://github.com/CandriaJS/git-neko-kit/commit/01f036f04209737a726b53924aec99415dab4635))
* **models:** 将 GitHub 相关模型移至 platform 目录 ([8856493](https://github.com/CandriaJS/git-neko-kit/commit/8856493ef4a296465334294d56cdcc4789d710b2))
* **models:** 将生成安装链接和配置链接的方法移至 App 类 ([a70695b](https://github.com/CandriaJS/git-neko-kit/commit/a70695b1be49d823482521a792df31ad00f30e0f))
* **utils:** 为 get_relative_time 函数添加默认语言参数 ([0d4a000](https://github.com/CandriaJS/git-neko-kit/commit/0d4a000816aeafab376d3958eb73a012dfaea7f1))
* 优化代码结构和类型定义 ([95b5202](https://github.com/CandriaJS/git-neko-kit/commit/95b52024564c43664e65779708986120f549274d))


### 🎡 持续集成

* **deploy:** 将部署目标从 GitHub Pages 更改为 Cloudflare Pages ([9d93129](https://github.com/CandriaJS/git-neko-kit/commit/9d93129c6a84c1a6ba4de29b5f701b0959c85238))
* 更新 GitHub Actions 中私钥引用 ([0543e6a](https://github.com/CandriaJS/git-neko-kit/commit/0543e6a5c7a5683d6a705861345b5884e57a3f88))
* 更新 GitHub Actions 中私钥引用 ([73c15d2](https://github.com/CandriaJS/git-neko-kit/commit/73c15d24eff242ef3fc9953b3d8a7a505aa5354a))

## [0.2.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.1.0...v0.2.0) (2025-04-10)


### ✨ 新功能

* **github:** 实现通过访问令牌获取用户信息的方法 ([d2f56a6](https://github.com/CandriaJS/git-neko-kit/commit/d2f56a6a522f4aea63d5dc5c24eae00cdf48cbf9))
* **github:** 添加获取提交信息功能 ([c024133](https://github.com/CandriaJS/git-neko-kit/commit/c0241338267297c86f002448d69d443f7600da9d))
* **user:** 添加 GitHub 用户操作类和相关类型定义 ([166ed9a](https://github.com/CandriaJS/git-neko-kit/commit/166ed9ac0e1137da472a7996a1e22db97d75ccc3))
* **user:** 添加获取用户贡献日历数据功能 ([7b14d94](https://github.com/CandriaJS/git-neko-kit/commit/7b14d9401847beba4d811064c572f825262df000))


### 🐛 错误修复

* **github:** 优化 token 设置逻辑 ([a83c511](https://github.com/CandriaJS/git-neko-kit/commit/a83c51106f1e309e9073fdc740575985cc5917a1))
* **github:** 修复用户贡献信息获取功能 ([0c0959d](https://github.com/CandriaJS/git-neko-kit/commit/0c0959dbe299a8d849551aa5db17c28c4866d106))
* **src:** 优化用户信息获取异常处理 ([f7c9844](https://github.com/CandriaJS/git-neko-kit/commit/f7c9844fe56a580ca048bf4812d48725f0c01b96))


### ♻️ 代码重构

* **github:** 修改用户贡献获取方法的名称 ([94e22ff](https://github.com/CandriaJS/git-neko-kit/commit/94e22ff104a4cc92c925df9e28a2ed8ca61f9064))
* **github:** 重构 GitHub 类的初始化逻辑 ([6f14421](https://github.com/CandriaJS/git-neko-kit/commit/6f144212bc5e36c96eff4b5678a8e6a3d86cc461))
* **models:** 重构 GitHub 相关模型 ([8207e8d](https://github.com/CandriaJS/git-neko-kit/commit/8207e8d7ee14d8e9d48997cfd86a09d9cae606d6))
* **src/models/github/user.ts:** 添加获取用户贡献数据的方法 ([904d0ab](https://github.com/CandriaJS/git-neko-kit/commit/904d0abdcd3af421930505d81c54caf70732669d))
* **types:** 重构 GitHub API 类型定义 ([4a3f332](https://github.com/CandriaJS/git-neko-kit/commit/4a3f332613ba5ded40c3043b228bc0766a18f207))


### 🎡 持续集成

* 使用 GitHub App 令牌进行身份验证 ([601d61b](https://github.com/CandriaJS/git-neko-kit/commit/601d61b7ee65ef2f41eeda4860084dcf720dcf6f))

## [0.1.0](https://github.com/CandriaJS/git-neko-kit/compare/v0.0.3...v0.1.0) (2025-04-08)


### ✨ 新功能

* **base:** 添加代理配置功能 ([b5572e9](https://github.com/CandriaJS/git-neko-kit/commit/b5572e966786519825534ded8685315007d251c7))
* **common:** 添加日期格式化函数并优化仓库信息展示 ([2c2c535](https://github.com/CandriaJS/git-neko-kit/commit/2c2c535fc2c4e91dd0b3a0827d35964ea8426720))
* **github-auth:** 添加 token 状态检查功能并增强 refresh_token 安全性 ([eed19bb](https://github.com/CandriaJS/git-neko-kit/commit/eed19bb3587dc7a18aad08b90616d5dc10627f1b))
* **github:** 添加创建组织仓库功能 ([ced06d8](https://github.com/CandriaJS/git-neko-kit/commit/ced06d8105b35f371ae50d8630b5ac61eff11e3e))
* **github:** 添加获取组织仓库列表功能并更新相关类型定义 ([0d147cb](https://github.com/CandriaJS/git-neko-kit/commit/0d147cb79da34a92a92b152f6a53a7222e945e17))
* **models:** 优化请求处理和身份验证机制 ([2bd84a5](https://github.com/CandriaJS/git-neko-kit/commit/2bd84a5584347488645214d3f3befab83f028032))
* **proxy:** 增加通用代理配置并优化代理设置 ([329fa0c](https://github.com/CandriaJS/git-neko-kit/commit/329fa0c868fb5e7bd75a2e957016aff9136a5d5c))


### 🐛 错误修复

* **github:** 修复 GitHub token_status 接口调用方式 ([886034a](https://github.com/CandriaJS/git-neko-kit/commit/886034afb95490d6b8827dace048394c4938d62a))
* **github:** 添加 token 格式校验 ([782d7d7](https://github.com/CandriaJS/git-neko-kit/commit/782d7d704980cbada13cf8ab8fdf9c88b547f6ef))
* **github:** 适配仓库地址反向代理 ([1dd5112](https://github.com/CandriaJS/git-neko-kit/commit/1dd51126d07f2a8a92b04cdfd64064aa198cde51))
* **models:** 修复 GitHub 事件处理中的 URL 问题 ([902fee8](https://github.com/CandriaJS/git-neko-kit/commit/902fee812712ef95b0b93c1e98d67425c2f33486))


### 📝 文档更新

* **README:** 更新 API 封装进度文档 ([b56f028](https://github.com/CandriaJS/git-neko-kit/commit/b56f028f8da17dcba192315f44d58164819ef6ca))
* 优化代码结构并添加文档生成配置 ([b39ebcd](https://github.com/CandriaJS/git-neko-kit/commit/b39ebcdc60fdb59c6f034ec893aa7dcdbd1bd879))


### ♻️ 代码重构

* **common:** 优化 readJSON 函数并添加类型支持 ([c5debfb](https://github.com/CandriaJS/git-neko-kit/commit/c5debfbac16607ffd5db61821dfc3ddff37b2e73))
* **github:** 更新创建组织仓库接口参数 ([3ca69c2](https://github.com/CandriaJS/git-neko-kit/commit/3ca69c2cff33c3c7fc756d3450adfe3663a81e48))
* **github:** 重构 GitHub 相关代码 ([0abf39d](https://github.com/CandriaJS/git-neko-kit/commit/0abf39d846b6ee3014a5d54e71b054e74275740a))
* **github:** 重构 GitHub 相关代码并优化错误处理 ([52780b8](https://github.com/CandriaJS/git-neko-kit/commit/52780b8f3fed2570533cd5b7221a915fdfca654c))
* **github:** 重构 GitHub 相关类型定义 ([198d47f](https://github.com/CandriaJS/git-neko-kit/commit/198d47f0f831c9e5c7fa115478e86aedf5225f4a))
* **github:** 重构 GitHub 类 ([a539484](https://github.com/CandriaJS/git-neko-kit/commit/a539484c84c52f6b65ba337cd2bff8ea1a286093))
* **github:** 重构 GitHub 类的 token 使用方式 ([b8f4f8d](https://github.com/CandriaJS/git-neko-kit/commit/b8f4f8d11ddfcba7143417af20187f5524472325))
* **github:** 重构反代地址解析逻辑 ([3712bef](https://github.com/CandriaJS/git-neko-kit/commit/3712befbf23d80cf64fb9600a7d45570e0a62f2e))
* **models:** 优化 create_org_repo 方法返回类型定义 ([bc90dd3](https://github.com/CandriaJS/git-neko-kit/commit/bc90dd31c56236b6ee7c7c7eb9d7686407df4421))
* **src:** 优化 readJSON 函数的类型定义 ([744cf1f](https://github.com/CandriaJS/git-neko-kit/commit/744cf1f15b2acee5f4b2849a57718df2909600a7))


### 📦️ 构建系统

* **tsup:** 调整目标 ECMAScript 版本为 Node.js 22 ([9e6dba4](https://github.com/CandriaJS/git-neko-kit/commit/9e6dba4eccc2bb35766fb09af7064b04b2be792d))

## [0.0.3](https://github.com/CandriaJS/git-neko-kit/compare/v0.0.2...v0.0.3) (2025-03-31)


### 🎡 持续集成

* 调整 release 工作流中的输出定义位置 ([0f9ffcb](https://github.com/CandriaJS/git-neko-kit/commit/0f9ffcb03393613ae12fadbab2d4e9dd2012ae74))

## [0.0.2](https://github.com/CandriaJS/git-neko-kit/compare/v0.0.1...v0.0.2) (2025-03-31)


### ♻️ 代码重构

* **github:** 重构 Github App 授权流程 ([f6d47ab](https://github.com/CandriaJS/git-neko-kit/commit/f6d47ab4b8bf073fbf2975b058f9038ba2b675cb))
* 重构项目并优化代码 ([6689ab1](https://github.com/CandriaJS/git-neko-kit/commit/6689ab1e962f8623c16a1cfb4006008bc0220f12))


### 🎡 持续集成

* **release-beta:** 优化构建文件传输方式 ([f64fa0a](https://github.com/CandriaJS/git-neko-kit/commit/f64fa0a20bfdaa84fa8dd832d6de82f598023741))
* **release:** 更新环境变量引用并简化工作流 ([45c7b92](https://github.com/CandriaJS/git-neko-kit/commit/45c7b92d04ea2c5e007fc48b2e19350c0833d5cd))
* **workflow:** 优化构建和发布流程 ([a2304c1](https://github.com/CandriaJS/git-neko-kit/commit/a2304c1af2a0aa2001926cdaeb0f03d035ad181c))
* 移除 release 工作流中的代码提交步骤 ([566b3fb](https://github.com/CandriaJS/git-neko-kit/commit/566b3fb8fda9a50853b6c316f9172c91b3da174e))


## [0.0.1] (2025-03-26)

### ✨ 新功能

* 初始化 GitToolkit 项目 ([68a33bc](https://github.com/CandriaJS/git-neko-kit/commit/68a33bc46a87a06a0adc7ac73c6ee473bee1f97b))

### 🔄 持续集成

* **release:** 更新发布流程和包配置 ([344a1e0](https://github.com/CandriaJS/git-neko-kit/commit/344a1e0b25555c627f34825a5119aa5e9c8b404a))
