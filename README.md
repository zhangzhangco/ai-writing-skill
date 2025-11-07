# AI协同写作系统助手

专为Claude设计的通用AI写作辅助技能，基于三层架构的写作工作流框架，支持**所有领域**（技术、商业、学术、创意、工作等）。

## 🚀 快速安装

### 一键安装（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/zhangzhangco/ai-writing-skill/main/install.sh | bash
```

安装后，在 Claude Code 中执行：
```
/reload-skills
```

Skill 将立即生效！

## 🌟 核心特性

### 三层架构设计
- **认知结构层** - 工作区与任务类型智能判断
- **操作流程层** - 标准化工作流执行
- **经验注入层** - 个人素材库与风格对齐

### 降AI味引擎
四遍审校机制确保内容自然真实：
1. **内容与逻辑审校** - 事实准确、逻辑严密
2. **风格与语气审校** - 降AI腔、个性化表达
3. **细节与格式审校** - 术语统一、格式规范
4. **流畅度优化** - 段落过渡、句子长度、节奏控制 ⭐

### 质量控制
- 事实准确性：**100%**
- 素材调用率：**≥80%**
- AI腔表达：**<2%**
- 风格匹配度：**≥4.5/5**
- 流畅度：**≥4.0/5** ⭐

## 🛠️ 工具列表

1. **init-workspace** - 初始化工作区（tech/blog/paper/promptlab）
2. **web-research** - 网络研究与资料收集
3. **generate-topics** - 生成多选题方向
4. **create-brief** - 创建写作Brief
5. **run-workflow** - 执行工作流
6. **manage-corpus** - 管理个人素材库
7. **review-article** - 四遍审校
8. **fluency-optimizer** - 流畅度优化 ⭐
9. **generate-report** - 生成报告

## 🚀 快速开始

### 标准流程（6步）

```typescript
// 1. 初始化工作区
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'tech'  // tech/blog/paper/promptlab
});

// 2. 网络研究
const research = await webResearchTool.handler({
  research_topic: '你的主题',
  research_queries: ['关键词1', '关键词2', '关键词3'],
  source_types: ['technical_docs', 'case_studies'],
  save_to_corpus: true
});

// 3. 生成选题
const topics = await generateTopicsTool.handler({
  main_topic: '主话题',
  target_audience: '目标读者',
  output_count: 4
});

// 4. 搜索个人素材（必须！）
const materials = await manageCorpusTool.handler({
  action: 'search',
  keywords: '相关关键词',
  material_type: '观点'  // 经历/观点/案例/风格
});

// 5. 创建Brief
const brief = await createBriefTool.handler({
  topic: '选题标题',
  target_audience: '目标读者',
  word_count: 3000
});

// 6. 执行工作流（必须传入素材！）
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'tech',
  brief_id: brief.brief_id,
  personal_materials: materials.results.materials,  // 必需！
  materials_usage_rate: 0.85  // 必须 ≥ 0.8
});
```

## 📖 通用写作场景

本框架支持**任何领域**的写作需求：

### 🔬 技术类
- 技术评测、产品说明、API文档
- 技术博客、架构分享、问题解决
- 开源项目文档、会议演讲稿

### 📊 商业类
- 市场调研、竞品分析、行业报告
- 商业计划、项目提案、投资报告
- 营销内容、培训材料

### 🎓 学术类
- 研究论文、综述文章、案例研究
- 学术报告、开题报告、毕业设计
- 标准文档、操作手册、测试报告

### ✍️ 创意类
- 创意写作、公众号文章、博客
- 个人思考、读书笔记、观点文章

### 📝 工作类
- 项目文档、需求文档、设计方案
- 沟通邮件、总结报告、培训材料

## 📚 详细文档

- [使用指南](./USAGE.md) - 完整使用说明
- [API文档](./API.md) - 工具参数详解
- [6步完整流程指南](./6步完整流程指南.md) - 工作流详细说明
- [素材导入指南](./素材导入指南.md) - 如何添加个人素材
- [流畅度优化指南](./流畅度优化指南.md) - 提升文章流畅度

## 🎯 核心原则

- **真实比完美更重要** - 保持内容的真实性
- **数据胜过观点** - 用具体数据支撑
- **思考过程比结论更珍贵** - 记录思考轨迹
- **素材库是核心资产** - 持续积累个人经验

## ⚠️ 重要说明

**本Skill强制要求使用个人素材库**：
- 必须先使用 `manage-corpus` 搜索个人素材
- 素材调用率必须 ≥ 80%
- 无个人素材的文章将缺乏真实感，容易产生AI腔

## 📦 安装验证

安装完成后，验证 skill 是否正常工作：

```
1. /skills
   # 查看技能列表，确认看到 "ai-writing-assistant"

2. /manage-corpus view
   # 测试素材库管理工具

3. /init-workspace tech
   # 测试工作区初始化
```

## 📚 详细文档

- [部署指南](./DEPLOYMENT.md) - 完整安装和部署说明
- [使用指南](./USAGE.md) - 完整使用说明
- [API文档](./API.md) - 工具参数详解
- [6步完整流程指南](./6步完整流程指南.md) - 工作流详细说明
- [素材导入指南](./素材导入指南.md) - 如何添加个人素材
- [流畅度优化指南](./流畅度优化指南.md) - 提升文章流畅度

## 📄 许可证

MIT

---

**让AI写作更自然，让内容更有温度！** ✨
