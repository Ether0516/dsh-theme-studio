# Dsh 外观插件

给 DeepSeek Harness 桌面版增加主题和字体选择。在 **设置 → 外观** 中切换配色，让整个应用使用你喜欢的风格。

**版本：0.1.0 · 已验证：Dsh 0.2.0-rc.2 / Windows x64 · MIT**

## 可以做什么

- 在六套主题之间切换，选择后立即生效。
- 自定义深色主题的强调色、背景色和文字颜色，也可以点击卡片上的色点选择强调色。
- 分别设置界面字体和代码字体。
- 字体菜单用每款字体显示名称，选择前即可看到字形。
- 保存选择，重新打开 Dsh 后继续使用。

### 内置主题

| 主题 | 说明 |
| --- | --- |
| dsh light | Dsh 原生浅色主题 |
| dsh dark | Dsh 原生深色主题 |
| Catppuccin Mocha | Catppuccin 的 Mocha 配色 |
| Dracula | Dracula 深色配色 |
| One Dark | Atom One Dark 配色 |
| Codex Graphite | 本项目制作的石墨色主题 |

### 字体

| 字体 | 来源 |
| --- | --- |
| 系统默认 | 使用 Dsh 默认字体 |
| Microsoft YaHei | 微软雅黑，使用 Windows 已安装的字体 |
| JetBrains Mono | 随插件附带，包含编程连字 |
| JetBrains Mono Nerd Font | 随插件附带，在 JetBrains Mono 基础上增加图标字符 |

两款 JetBrains 字体离线可用，无需安装到系统，包含常规、粗体、斜体和粗斜体。中文使用系统字体回退。

## 安装

先启动过一次 Dsh 桌面版，让它完成初始化，再通过 **应用 → 退出** 完全退出。

下载 `dsh-theme-studio-0.1.0.tgz` 后，在终端运行以下命令。把示例路径换成安装包的实际位置：

```text
dsh plugin --profile desktop add "C:\Downloads\dsh-theme-studio-0.1.0.tgz" --offline
```

重新打开 Dsh，在 **设置 → 外观** 中选择主题和字体。

也可以下载或克隆本仓库，安装完整插件目录，无需先构建。将路径换成实际下载位置：

```text
dsh plugin --profile desktop add "C:\Projects\dsh-theme-studio" --offline
```

需要使用 **Dsh 桌面版自带的 `dsh` 命令**。如果提示找不到命令，先在 Dsh 的应用菜单中管理／安装 dsh 命令，重新打开终端。详见 [Dsh 桌面版说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md)。

## 使用

点击主题卡片即可切换。自定义主题下可修改三项颜色，支持颜色选择器和 `#RRGGBB` 色值；**重置配色**只清除当前自定义颜色。

切换主题会使用新主题的默认配色，保留字体选择。选择 `dsh light` 或 `dsh dark` 时，使用 Dsh 原生颜色与圆角；**紧凑圆角**只对自定义主题生效。

外观入口位于设置中。要暂时停用插件，在 **插件** 页面关闭 `dsh-theme-studio` 的开关；再次启用会恢复保存的选择。

本插件不需要 DeepSeek API Key，也不会调用模型。

## 移除

完全退出 Dsh 后运行：

```text
dsh plugin --profile desktop remove dsh-theme-studio
```

再启动 Dsh 即可恢复原生外观。

## 常见问题

**切换字体后，中文变化不明显？**

JetBrains 字体主要改变英文、数字和代码字形，中文仍由系统字体显示。可以对比菜单中的英文名称和下方代码预览。

**能添加自己的主题或字体吗？**

可以。目前通过修改集中定义的文件、构建、重启添加，不必使用 AI。步骤见 [添加主题与字体](docs/adding-themes-and-fonts.md)。尚未提供界面导入功能。

**所有页面都会换色吗？**

覆盖 Dsh 的主要背景、侧边栏、输入框、菜单及使用公共变量的代码高亮。系统弹窗、第三方网页及写死颜色的其他插件可能保留原来的外观。

## 开发

需要 Node.js。进入本仓库目录后运行：

```text
npm run build
npm test
```

构建不联网，不需要额外的打包器。测试读取实际安装的 Dsh 主题运行时：Windows 默认查找当前用户的 Dsh 安装目录；其他位置可用 `DSH_APP_ASAR` 指定 `resources/app.asar`，或用 `DSH_THEME_RUNTIME` 指定对应版本的 `ui-theme/lib/client.js`。

`src` 是源码，`lib` 是随包提供的构建产物，`assets/fonts` 保存字体和许可证。通过官方主题服务、配置表单和界面插槽扩展应用，不修改 Dsh 安装包。

目前只验证了 Dsh 0.2.0-rc.2 / Windows x64。Dsh 升级后可能需要适配。

## 项目文档

- [添加主题与字体](docs/adding-themes-and-fonts.md)：扩展配色和字体的详细步骤。
- [参与贡献](CONTRIBUTING.md)：问题反馈、修改代码和提交贡献。
- [更新记录](CHANGELOG.md)：各版本的功能和变化。

## 致谢与许可证

插件代码使用 [MIT License](LICENSE)。附带字体使用 SIL Open Font License，许可证与来源记录见 `assets/fonts` 和 `lib/licenses`。

- [Catppuccin Palette](https://github.com/catppuccin/palette)
- [Dracula](https://draculatheme.com/contribute)
- [Atom One Dark](https://github.com/atom/one-dark-syntax)
- [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono)
- [Nerd Fonts](https://github.com/ryanoasis/nerd-fonts)

本项目是社区插件。Codex Graphite 是本项目制作的近似配色。
