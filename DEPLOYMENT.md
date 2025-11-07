# 部署指南

本文档说明如何部署和安装 ai-writing-skill。

---

## 🚀 快速安装

### 一键安装（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/zhangzhangco/ai-writing-skill/main/install.sh | bash
```

或手动执行安装脚本：

```bash
git clone https://github.com/zhangzhangco/ai-writing-skill.git
cd ai-writing-skill
chmod +x install.sh
./install.sh
```

### 安装脚本功能

- 自动检测并创建 `~/.claude/skills/` 目录（如果不存在）
- 从 GitHub 仓库克隆 skill 文件
- 设置正确的文件权限
- 显示安装成功信息

### 热加载

Claude Code 支持 **Skill 热加载**，安装后无需重启 Claude。

在 Claude Code 中执行：
```
/reload-skills
```

Skill 将立即生效！

---

## 📁 目录结构

安装后，skill 将位于：
```
~/.claude/skills/ai-writing-skill/
├── index.ts                 # 技能入口点
├── manifest.json            # 技能清单
├── tools/                   # 工具实现
│   ├── init-workspace.ts
│   ├── web-research.ts
│   ├── generate-topics.ts
│   ├── create-brief.ts
│   ├── run-workflow.ts
│   ├── manage-corpus.ts
│   ├── review-article.ts
│   ├── fluency-optimizer.ts
│   └── generate-report.ts
├── README.md                # 项目说明
├── USAGE.md                 # 使用指南
├── API.md                   # API文档
├── examples/                # 示例文件
└── corpus/                  # 个人素材库目录
```

---

## 🔄 更新 skill

### 方法1：重新运行安装脚本

```bash
cd ~/.claude/skills/ai-writing-skill
git pull origin main
/reload-skills
```

### 方法2：手动更新

```bash
cd ~/.claude/skills
rm -rf ai-writing-skill
git clone https://github.com/zhangzhangco/ai-writing-skill.git
/reload-skills
```

---

## 🛠️ 手动部署

如果一键脚本失败，可以手动部署：

### 1. 创建目录

```bash
mkdir -p ~/.claude/skills
cd ~/.claude/skills
```

### 2. 克隆仓库

```bash
git clone https://github.com/zhangzhangco/ai-writing-skill.git
```

### 3. 验证文件

```bash
ls -la ~/.claude/skills/ai-writing-skill/
```

确保看到以下文件：
- `index.ts`
- `manifest.json`
- `tools/` 目录
- 文档文件

### 4. 热加载

在 Claude Code 中执行：
```
/reload-skills
```

---

## 🐛 故障排除

### 1. 克隆失败

**问题**：git clone 失败

**解决方案**：
- 检查网络连接
- 确认 Git 已安装：`git --version`
- 手动下载 zip 文件解压

### 2. skill 不生效

**问题**：运行 `/reload-skills` 后 skill 不可用

**解决方案**：
1. 确认 skill 位于正确路径：`~/.claude/skills/ai-writing-skill/`
2. 检查 `index.ts` 和 `manifest.json` 是否存在
3. 重启 Claude Code

### 3. 权限问题

**问题**：权限被拒绝

**解决方案**：
```bash
chmod -R 755 ~/.claude/skills/ai-writing-skill
```

### 4. 找不到 skill

**问题**：skill 列表中不显示

**解决方案**：
- 确认目录名是 `ai-writing-skill`（不是其他名称）
- 确认在 `~/.claude/skills/` 目录下
- 运行 `/reload-skills` 重新加载

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Issues](https://github.com/zhangzhangco/ai-writing-skill/issues)
2. 阅读 [USAGE.md](./USAGE.md) 了解详细用法
3. 查看 [API.md](./API.md) 了解工具参数

---

## ✅ 验证安装

安装完成后，在 Claude Code 中测试：

```
1. 运行 /skills 查看技能列表
2. 确认看到 "ai-writing-assistant"
3. 尝试使用任一工具，例如：
   - /init-workspace tech
   - /manage-corpus view
```

如果看到工具响应，说明安装成功！

---

## 📋 系统要求

- Claude Code (最新版本)
- Git (用于克隆仓库)
- 网络连接 (用于下载)

---

**祝您使用愉快！** 🎉
