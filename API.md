# AI写作系统技能 API 文档

## 概述

本技能提供6个核心工具，支持完整的AI写作工作流。所有工具都遵循统一的接口规范。

## 工具接口规范

### 通用参数

所有工具都接受以下通用参数：

- `input`: 工具输入参数
- `utils`: 工具上下文，包含：
  - `utils.logger`: 日志记录器
  - `utils.fileSystem`: 文件系统操作
  - `utils.httpClient`: HTTP 客户端

## 工具详细说明

### 1. init-workspace

初始化工作区，加载对应的写作规则和风格指南。

#### 输入参数

```typescript
{
  workspace_type: 'tech' | 'blog' | 'paper' | 'promptlab',
  target_path?: string
}
```

#### 返回值

```typescript
{
  status: 'initialized',
  workspace_type: string,
  workspace_info: {
    name: string,
    description: string,
    rules_file: string,
    features: string[],
    target_audience: string,
    style: string,
    output: string
  },
  next_steps: string[],
  quick_start: {
    step1: string,
    step2: string,
    step3: string,
    step4: string,
    step5: string
  },
  principles: string[],
  quality_standards: {
    factual_accuracy: string,
    material_usage: string,
    ai_tone_expression: string,
    style_match: string
  }
}
```

#### 使用示例

```typescript
const workspace = await initWorkspaceTool.handler({
  workspace_type: 'tech',
  target_path: './my-writing-project'
});
```

---

### 2. create-brief

创建结构化写作Brief，标准化写作需求。

#### 输入参数

```typescript
{
  topic: string,
  target_audience: string,
  word_count?: number,
  output_format?: 'markdown' | 'html' | 'latex',
  key_points: string[],
  key_questions: string[],
  material_requirements?: string,
  special_requirements?: string,
  deadline?: string
}
```

#### 返回值

```typescript
{
  brief_id: string,
  brief_content: string,
  brief_path: string,
  next_steps: string[],
  quality_checklist: string[]
}
```

#### 使用示例

```typescript
const brief = await createBriefTool.handler({
  topic: 'HDR技术在移动设备上的应用与挑战',
  target_audience: '移动设备工程师',
  word_count: 3000,
  output_format: 'markdown',
  key_points: [
    'HDR技术原理',
    '移动设备上的实现难点',
    '功耗优化方案',
    '实际应用案例'
  ],
  key_questions: [
    'HDR如何平衡画质与功耗？',
    '硬件 vs 软件HDR，哪种方案更优？',
    '用户真实体验如何？'
  ]
});
```

---

### 3. run-workflow

执行标准化工作流。

#### 输入参数

```typescript
{
  workflow_type: 'new_article' | 'edit_article' | 'review_article',
  workspace_type: 'tech' | 'blog' | 'paper' | 'promptlab',
  brief_id: string,
  custom_steps?: string[]
}
```

#### 返回值

```typescript
{
  workflow_id: string,
  workflow_type: string,
  status: 'initialized' | 'running' | 'completed',
  current_step: number,
  total_steps: number,
  progress: number,
  results: {
    step_results: Array<{
      step: number,
      name: string,
      status: 'pending' | 'running' | 'completed' | 'failed',
      output?: any
    }>,
    final_output?: any
  }
}
```

#### 使用示例

```typescript
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'tech',
  brief_id: 'brief_1234567890'
});
```

---

### 4. manage-corpus

管理个人素材库。

#### 输入参数

```typescript
{
  action: 'view' | 'search' | 'add' | 'update' | 'delete',
  material_type?: '经历' | '观点' | '案例' | '风格',
  keywords?: string,
  material_data?: {
    title: string,
    content: string,
    tags: string[],
    category: string
  }
}
```

#### 返回值

```typescript
{
  action: string,
  results?: {
    materials: Array<{
      id: string,
      title: string,
      content: string,
      tags: string[],
      category: string,
      usage_count: number,
      created_at: string
    }>,
    total: number
  },
  statistics?: {
    total_materials: number,
    by_category: Record<string, number>,
    by_type: Record<string, number>
  }
}
```

#### 使用示例

```typescript
// 查看素材库
const corpus = await manageCorpusTool.handler({
  action: 'view',
  material_type: '案例'
});

// 搜索素材
const search = await manageCorpusTool.handler({
  action: 'search',
  keywords: 'HDR'
});
```

---

### 5. review-article

三遍审校机制，确保内容质量。

#### 输入参数

```typescript
{
  article_content: string,
  review_level: 'quick' | 'standard' | 'deep',
  target_style?: 'tech' | 'blog' | 'paper' | 'promptlab',
  custom_criteria?: string[]
}
```

#### 返回值

```typescript
{
  review_id: string,
  review_level: string,
  passes: Array<{
    pass_number: number,
    name: string,
    status: 'pending' | 'running' | 'completed',
    issues_found: number,
    suggestions: string[],
    revised_content?: string
  }>,
  final_report: {
    overall_score: number,
    ai_tone_percentage: number,
    factual_accuracy: number,
    style_match: number,
    recommendations: string[]
  }
}
```

#### 使用示例

```typescript
const review = await reviewArticleTool.handler({
  article_content: '文章内容...',
  review_level: 'standard',
  target_style: 'tech'
});
```

---

### 6. generate-report

生成执行报告和质量指标。

#### 输入参数

```typescript
{
  report_type: 'execution-log' | 'quality-metrics' | 'review-summary',
  article_topic?: string,
  workflow_id?: string,
  brief_id?: string,
  include_suggestions?: boolean
}
```

#### 返回值

```typescript
{
  report_id: string,
  report_type: string,
  report_content: string,
  report_path: string,
  summary: {
    execution_time: number,
    quality_metrics: {
      factual_accuracy: number,
      material_usage: number,
      ai_tone: number,
      style_match: number
    },
    completion_status: 'completed' | 'partial' | 'failed'
  }
}
```

#### 使用示例

```typescript
const report = await generateReportTool.handler({
  report_type: 'quality-metrics',
  article_topic: 'HDR技术评测',
  include_suggestions: true
});
```

## 错误处理

所有工具都可能抛出以下类型的错误：

- `ValidationError`: 输入参数验证失败
- `FileSystemError`: 文件系统操作失败
- `WorkflowError`: 工作流执行错误
- `TimeoutError`: 操作超时

## 最佳实践

1. **按顺序执行工具** - 遵循工作流的逻辑顺序
2. **处理异步操作** - 所有工具都是异步的，使用 `await`
3. **检查返回值** - 验证工具执行结果
4. **记录日志** - 使用 `utils.logger` 记录关键信息
5. **错误处理** - 始终包装在 try-catch 中

## 性能建议

- 批量操作时使用 `Promise.all()`
- 大文件处理时分块读取
- 审校操作可以并行执行多个检查点
- 合理设置超时时间

## 版本兼容性

- 最低 Claude SDK 版本：0.8.0
- Node.js 版本：>=18.0.0
- TypeScript 版本：>=5.3.0
