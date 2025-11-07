---
name: ai-writing-assistant
description: 通用AI协同写作系统助手 - 基于三层架构的写作工作流框架，提供可控、可复用、可追踪的写作能力。支持所有领域和场景（技术写作、商业分析、学术研究、创意写作、营销内容等），通过降AI味引擎确保内容自然真实。助手工作方式是用代码描述skill的工作逻辑,代码本身不运行,也不要运行的环境.
---
# AI协同写作系统助手

## 核心能力

用代码描述skill的工作逻辑,代码本身不运行,也不要运行的环境.

### 三层架构设计

- **认知结构层** - 工作区与任务类型智能判断
- **操作流程层** - 标准化9步工作流执行
- **经验注入层** - 个人素材库与风格对齐

### 降AI味引擎

四遍审校机制确保内容自然度：

1. 内容与逻辑审校 - 事实准确、逻辑严密
2. 风格与语气审校 - 降AI腔、个性化表达
3. 细节与格式审校 - 术语统一、格式规范
4. **流畅度优化** - 段落过渡、句子长度、节奏控制 ⭐

**目标**：

- AI腔表达 < 2%
- 流畅度 ≥ 4.0/5
- 素材调用率 ≥ 80%

## 工具列表

1. **init-workspace** - 初始化工作区

   - 支持 4 种工作区类型：tech、blog、paper、promptlab
   - 自动加载对应写作规则和风格指南
2. **web-research** - 网络研究与资料收集

   - 自动搜索相关资料并分类整理
   - 支持技术文档、案例研究、基准测试等多类型
   - 自动保存到素材库
3. **generate-topics** - 生成多选题方向

   - 基于研究资料生成4个不同角度选题
   - 包含技术、应用、对比、趋势四种视角
   - 自动评分排序，便于选择
4. **create-brief** - 创建写作Brief

   - 结构化写作需求
   - 生成标准化Brief模板
   - 支持多种输出格式
5. **run-workflow** - 执行工作流

   - new_article: 9步完整流程（3-4小时）
   - edit_article: 4步快速修改（1-2小时）
   - review_article: 5步审校流程（1-1.5小时）
6. **manage-corpus** - 管理素材库

   - 查看/搜索个人素材库
   - 支持：经历、观点、案例、风格四类素材
   - 提升素材调用率（目标≥80%）
7. **review-article** - 四遍审校

   - 第一遍：内容与逻辑审校
   - 第二遍：风格与语气审校（降AI腔）
   - 第三遍：细节与格式审校
   - 第四遍：流畅度优化
8. **fluency-optimizer** - 流畅度优化 ⭐

   - 段落过渡检查与优化
   - 句子长度分析与拆分
   - 信息密度控制
   - 阅读节奏调整
9. **generate-report** - 生成报告

   - execution-log: 执行日志
   - quality-metrics: 质量指标（包含流畅度）
   - review-summary: 审校摘要

## 通用写作场景

本框架支持**任何领域**的写作需求：

### 🔬 技术类

- **科技写作**：技术评测、产品说明、API文档
- **技术博客**：开发经验、架构分享、问题解决
- **开源项目**：README、贡献指南、变更日志
- **会议演讲稿**：技术分享、产品发布、学术报告

### 📊 商业类

- **商业分析**：市场调研、竞品分析、行业报告
- **商业计划**：项目提案、投资报告、战略规划
- **营销内容**：产品宣传、广告文案、社交媒体
- **培训材料**：员工手册、操作指南、最佳实践

### 🎓 学术类

- **学术论文**：研究论文、综述文章、案例研究
- **学术报告**：开题报告、进展汇报、毕业设计
- **标准文档**：规范文档、操作手册、测试报告

### ✍️ 创意类

- **创意写作**：小说、诗歌、剧本
- **内容创作**：公众号文章、博客、专栏
- **个人思考**：日记、读书笔记、观点文章

### 📝 工作类

- **项目文档**：需求文档、设计方案、总结报告
- **沟通邮件**：项目汇报、问题反馈、方案提案
- **培训材料**：新手指南、知识库、FAQ

**使用方式**：所有场景都遵循相同的6步工作流（研究→选题→观点→创作→审校→报告），只是**具体内容和参数**不同。

## 质量标准

- 事实准确性：**100%**
- 素材调用率：**≥80%**
- AI腔表达：**<2%**
- 风格匹配度：**≥4.5/5**

## 快速开始

本框架适用于**任何写作任务**。以下提供多领域示例：

### 示例1：技术博客

```typescript
// 1. 初始化工作区
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'tech'
});

// 2. 网络研究
const research = await webResearchTool.handler({
  research_topic: '微前端架构在大型项目中的应用',
  research_queries: [
    '微前端架构 最佳实践',
    'Single-SPA qiankun 方案对比',
    '微前端 项目实施 经验'
  ],
  source_types: ['technical_docs', 'case_studies'],
  save_to_corpus: true
});

// 3. 生成选题并选择
const topics = await generateTopicsTool.handler({
  main_topic: '微前端架构',
  target_audience: '前端工程师',
  output_count: 4
});

// 4. 搜索个人素材库（关键步骤！）
const personalMaterials = await manageCorpusTool.handler({
  action: 'search',
  keywords: '微前端 qiankun 实战经验',
  material_type: '观点'
});

// 5. 创建Brief
const brief = await createBriefTool.handler({
  topic: '已选择的选题',
  target_audience: '前端工程师',
  word_count: 3000
});

// 6. 执行工作流（必须传入素材！）
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'tech',
  brief_id: brief.brief_id,
  personal_materials: personalMaterials.results.materials,  // 必需！
  materials_usage_rate: 0.85  // 必需 ≥ 0.8
});
```

### 示例2：商业分析

```typescript
// 1. 初始化工作区
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'blog'
});

// 2. 网络研究
const research = await webResearchTool.handler({
  research_topic: 'AI在SaaS行业的应用现状与趋势',
  research_queries: [
    'AI SaaS 市场分析 2024',
    'ChatGPT Claude 竞品分析',
    'AI SaaS 商业化 成功案例'
  ],
  source_types: ['news', 'case_studies', 'research_papers'],
  save_to_corpus: true
});

// 3. 生成选题
const topics = await generateTopicsTool.handler({
  main_topic: 'AI SaaS',
  target_audience: 'SaaS从业者',
  style_preference: 'analytical',
  output_count: 4
});

// 4. 搜索个人素材
const personalMaterials = await manageCorpusTool.handler({
  action: 'search',
  keywords: 'AI SaaS 商业化 创业经验',
  material_type: '观点'
});

// 5. 创建Brief
const brief = await createBriefTool.handler({
  topic: '选题：AI SaaS的三个发展阶段',
  target_audience: 'SaaS从业者',
  word_count: 4000
});

// 6. 执行（必须传入素材）
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'blog',
  brief_id: brief.brief_id,
  personal_materials: personalMaterials.results.materials,
  materials_usage_rate: 0.85
});
```

### 示例3：学术研究

```typescript
// 1. 初始化
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'paper'
});

// 2. 研究
const research = await webResearchTool.handler({
  research_topic: '大语言模型在教育领域的应用',
  research_queries: [
    'LLM 教育应用 研究综述',
    'ChatGPT 教育 效果评估',
    '个性化学习 AI 方案'
  ],
  source_types: ['research_papers', 'technical_docs'],
  save_to_corpus: true
});

// 3. 生成选题
const topics = await generateTopicsTool.handler({
  main_topic: 'LLM教育应用',
  target_audience: '教育研究者',
  style_preference: 'deep',
  output_count: 4
});

// 4. 搜索个人素材
const personalMaterials = await manageCorpusTool.handler({
  action: 'search',
  keywords: 'LLM 教育 个性化学习 研究',
  material_type: '案例'
});

// 5. 创建Brief
const brief = await createBriefTool.handler({
  topic: '选题：LLM驱动的个性化学习系统设计',
  target_audience: '教育研究者',
  word_count: 8000
});

// 6. 执行（必须传入素材）
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'paper',
  brief_id: brief.brief_id,
  personal_materials: personalMaterials.results.materials,
  materials_usage_rate: 0.85
});
```

## 最佳实践

1. **严格执行6步流程** - 每步都不能跳过
2. **素材库调用率≥80%** - 降AI味的关键指标
3. **必须使用个人素材** - 无素材则拒绝执行
4. **四遍审校必做** - 确保质量达标（含流畅度）
5. **流畅度≥4.0/5** - 提升阅读体验
6. **持续更新素材库** - 积累个人经验
7. **真实胜过完美** - 保持内容的真实性

## ⚠️ 强制要求

**run-workflow 工具现在强制要求**：

- ✅ 必须提供 `personal_materials` 参数
- ✅ 素材调用率必须≥80%
- ✅ 不满足条件将拒绝执行

**正确的使用顺序**：

```typescript
1. web-research (研究资料)
2. generate-topics (生成选题)
3. manage-corpus (搜索素材) ⭐ 关键！
4. create-brief (创建Brief)
5. run-workflow (执行，传入素材)
6. review-article (四遍审校)
7. fluency-optimizer (流畅度优化) ⭐ 新增
8. generate-report (报告)
```

**错误的做法**（会导致执行失败）：

```typescript
❌ 跳过 manage-corpus
❌ 不传入 personal_materials
❌ 素材调用率<80%
```

## 注意事项

- 选题讨论环节不能跳过
- 素材库是降AI味的核心，**强制使用**
- 审校第二遍是最关键的
- 质量比速度更重要
- **无个人素材的文章将缺乏真实感**

## 核心原则

- 真实比完美更重要
- 数据胜过观点
- 思考过程比结论更珍贵
- 素材库是核心资产
