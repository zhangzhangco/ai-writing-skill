#!/bin/bash

# ai-writing-skill 一键安装脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/zhangzhangco/ai-writing-skill/main/install.sh | bash
# 强制覆盖: curl -fsSL https://raw.githubusercontent.com/zhangzhangco/ai-writing-skill/main/install.sh | FORCE_OVERWRITE=1 bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_header() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "  AI Writing Skill 安装程序"
    echo "=================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 检查强制覆盖变量
FORCE_OVERWRITE=false
if [[ "$FORCE_OVERWRITE" == "1" ]] || [[ "$FORCE_OVERWRITE" == "true" ]]; then
    FORCE_OVERWRITE=true
fi

print_header

# 检查 Git
print_info "检查系统环境..."
if ! command -v git &> /dev/null; then
    print_error "Git 未安装！"
    echo "请先安装 Git："
    echo "  - macOS: brew install git"
    echo "  - Ubuntu/Debian: sudo apt-get install git"
    echo "  - CentOS/RHEL: sudo yum install git"
    exit 1
fi
print_success "Git 已安装"

# 定义目录
SKILLS_DIR="$HOME/.claude/skills"
REPO_URL="https://github.com/zhangzhangco/ai-writing-skill.git"
SKILL_DIR="$SKILLS_DIR/ai-writing-skill"

# 创建目录
print_info "创建 Skills 目录..."
mkdir -p "$SKILLS_DIR"
print_success "目录已创建: $SKILLS_DIR"

# 检查目录是否为空
if [ -d "$SKILL_DIR" ]; then
    if [ "$FORCE_OVERWRITE" = true ]; then
        print_info "🔄 强制覆盖模式，删除旧版本..."
        rm -rf "$SKILL_DIR"
        print_success "旧版本已删除"
    else
        print_info "检测到已存在的 Skill 目录"
        print_info "跳过安装"
        print_info ""
        print_info "如需覆盖安装，请使用以下命令："
        echo -e "  ${YELLOW}curl -fsSL https://raw.githubusercontent.com/zhangzhangco/ai-writing-skill/main/install.sh | FORCE_OVERWRITE=1 bash${NC}"
        exit 0
    fi
fi

# 克隆仓库
print_info "从 GitHub 克隆仓库..."
cd "$SKILLS_DIR"
git clone "$REPO_URL" "ai-writing-skill"

if [ $? -eq 0 ]; then
    print_success "仓库克隆成功"
else
    print_error "仓库克隆失败！"
    echo "请检查网络连接或手动安装"
    exit 1
fi

# 设置权限
print_info "设置文件权限..."
chmod -R 755 "$SKILL_DIR"
print_success "权限设置完成"

# 验证安装
print_info "验证安装文件..."
REQUIRED_FILES=(
    "index.ts"
    "manifest.json"
    "tools"
)

ALL_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "$SKILL_DIR/$file" ]; then
        print_error "缺少必要文件: $file"
        ALL_EXIST=false
    fi
done

if [ "$ALL_EXIST" = true ]; then
    print_success "所有必要文件验证通过"
else
    print_error "安装验证失败！"
    exit 1
fi

# 显示完成信息
echo
echo -e "${GREEN}=================================="
echo -e "  🎉 安装完成！"
echo -e "==================================${NC}"
echo
print_info "Skill 位置: $SKILL_DIR"
echo
print_info "下一步操作："
echo "  1. 打开 Claude Code"
echo "  2. 在对话中输入: /reload-skills"
echo "  3. 开始使用 Skill！"
echo
print_info "验证安装："
echo "  1. 运行: /skills"
echo "  2. 确认看到 'ai-writing-assistant'"
echo "  3. 尝试: /manage-corpus view"
echo
print_info "详细文档："
echo "  - 使用指南: $SKILL_DIR/USAGE.md"
echo "  - API文档: $SKILL_DIR/API.md"
echo "  - GitHub: https://github.com/zhangzhangco/ai-writing-skill"
echo
echo -e "${YELLOW}=================================="
echo -e "  ⚡ 重要提示"
echo -e "==================================${NC}"
echo -e "${YELLOW}Skill 支持热加载！${NC}"
echo "在 Claude Code 中执行 /reload-skills 即可立即生效，无需重启！"
echo
if [ "$FORCE_OVERWRITE" = true ]; then
    echo -e "${GREEN}✅ 强制覆盖安装完成！${NC}"
fi
