# AI写作系统Skill - 使用指南

## 快速开始

### 工具1：初始化工作区
```typescript
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'tech'  // tech | blog | paper | promptlab
});
```

### 工具2：创建Brief
```typescript
const brief = await createBriefTool.handler({
  topic: '文章主题',
  target_audience: '目标读者',
  word_count: 2000,
  key_points: ['要点1', '要点2'],
  key_questions: ['问题1', '问题2']
});
```

### 工具3：执行工作流
```typescript
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',  // new_article | edit_article | review_article
  workspace_type: 'tech',
  brief_id: brief.brief_id
});
```

### 工具4：管理素材库
```typescript
// 查看素材库
const corpus = await manageCorpusTool.handler({
  action: 'view',
  material_type: '案例'  // 经历 | 观点 | 案例 | 风格
});

// 搜索素材
const search = await manageCorpusTool.handler({
  action: 'search',
  keywords: 'HDR'
});
```

### 工具5：三遍审校
```typescript
const review = await reviewArticleTool.handler({
  article_content: '文章内容...',
  review_level: 'standard'  // quick | standard | deep
});
```

### 工具6：生成报告
```typescript
const report = await generateReportTool.handler({
  report_type: 'quality-metrics',  // execution-log | quality-metrics | review-summary
  article_topic: '文章主题'
});
```

## 工作流选择

### new_article
- 适用：完整新文章
- 步骤：9步完整流程
- 用时：3-4小时
- 质量：最高

### edit_article
- 适用：已有文章修改
- 步骤：4步快速流程
- 用时：1-2小时
- 质量：良好

### review_article
- 适用：降AI味、风格优化
- 步骤：5步审校流程
- 用时：1-1.5小时
- 质量：显著提升

## 工作区说明

| 工作区 | 适用 | 特点 |
|--------|------|------|
| tech | 技术评测 | 数据支撑、专业严谨 |
| blog | 公众号 | 故事化、可读性强 |
| paper | 学术论文 | 逻辑严密、引用规范 |
| promptlab | 提示词 | 方法论、实验性 |

## 质量标准

- 事实准确性：100%
- 素材调用：≥80%
- AI腔表达：<2%
- 风格匹配：≥4.5/5

## 最佳实践

1. 严格执行9步流程
2. 优先调用个人素材库
3. 三遍审校不能跳过
4. 每次使用后记录经验

## 注意事项

- 选题讨论环节不能跳过
- 素材库是降AI味关键
- 审校第二遍是核心
- 真实比完美更重要
