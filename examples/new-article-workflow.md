# 新文章写作完整工作流示例

本示例展示如何使用 ai-writing-skill 完成一篇完整的科技文章写作。

## 示例主题

**文章主题**：HDR技术在移动设备上的应用与挑战

**目标读者**：移动设备工程师

**预期字数**：3000字

## 完整工作流

### 步骤 1：初始化工作区

```typescript
import { aiWritingSkill } from '../index';

const { tools } = aiWritingSkill;

// 初始化科技写作工作区
const workspace = await tools['init-workspace'].handler({
  workspace_type: 'tech'
});

console.log('工作区已初始化:', workspace.workspace_info);
```

**输出示例**：
```
工作区已初始化: {
  name: '科技写作工作区',
  description: '适用于技术评测、项目说明、科普文章',
  target_audience: '技术工程师、研发人员、产品经理',
  style: '工程师视角，理性分析',
  features: [
    '强调数据支撑',
    '实操案例优先',
    '专业但易懂',
    '技术细节准确'
  ]
}
```

### 步骤 2：创建写作Brief

```typescript
const brief = await tools['create-brief'].handler({
  topic: 'HDR技术在移动设备上的应用与挑战',
  target_audience: '移动设备工程师',
  word_count: 3000,
  key_points: [
    'HDR技术原理与标准',
    '移动设备实现的技术挑战',
    '功耗优化解决方案',
    '实际应用案例分析',
    '未来发展趋势'
  ],
  key_questions: [
    'HDR如何平衡画质与功耗？',
    '硬件HDR vs 软件HDR，哪种方案更优？',
    '用户真实体验如何？有哪些痛点？',
    '产业链如何协同推进HDR普及？'
  ],
  material_requirements: '需要HDR技术标准文档、主流移动设备HDR实现方案、功耗测试数据、实际拍摄样张',
  special_requirements: '需要包含对比图表，引用权威技术标准（如HDR10+、Dolby Vision）',
  deadline: '2024-12-31'
});

console.log('Brief已创建:', brief.brief_id);
```

**输出示例**：
```
Brief已创建: brief_1703577600000
Brief文件: ./ai-writing/5_briefs/brief_1703577600000.md
```

### 步骤 3：执行新文章工作流

```typescript
const workflow = await tools['run-workflow'].handler({
  workflow_type: 'new_article',
  workspace_type: 'tech',
  brief_id: brief.brief_id
});

console.log('工作流已启动:', workflow.workflow_id);
console.log('预计步骤:', workflow.total_steps);
```

**工作流包含的9个步骤**：
1. 选题讨论与验证
2. 素材收集与筛选
3. 大纲结构设计
4. 初稿撰写（分块）
5. 初稿整合与优化
6. **第一遍审校**（内容与逻辑）
7. **第二遍审校**（风格与语气）
8. **第三遍审校**（细节与格式）
9. 最终输出与报告

### 步骤 4：管理个人素材库

```typescript
// 搜索相关素材
const existingMaterials = await tools['manage-corpus'].handler({
  action: 'search',
  keywords: 'HDR'
});

console.log('找到相关素材:', existingMaterials.results.materials.length);

// 添加新素材
await tools['manage-corpus'].handler({
  action: 'add',
  material_data: {
    title: 'iPhone 15 Pro HDR实现方案',
    content: '通过A17 Pro芯片的图像信号处理器...',
    tags: ['HDR', 'iPhone', '硬件实现'],
    category: '案例'
  }
});
```

### 步骤 5：三遍审校

```typescript
// 假设文章内容已生成
const articleContent = `
# HDR技术在移动设备上的应用与挑战

[文章内容...]

`;

const review = await tools['review-article'].handler({
  article_content: articleContent,
  review_level: 'standard',
  target_style: 'tech'
});

console.log('审校完成');
console.log('AI腔比例:', review.final_report.ai_tone_percentage);
console.log('整体评分:', review.final_report.overall_score);
```

**审校结果示例**：
```
审校完成
AI腔比例: 1.5%
整体评分: 4.6/5

第一遍审校 - 内容与逻辑：
- 找出3个逻辑跳跃点
- 建议补充2个数据支撑
- 整体结构合理

第二遍审校 - 风格与语气：
- 降低AI腔表达：15处
- 提升专业性表达：8处
- 风格匹配度：4.7/5

第三遍审校 - 细节与格式：
- 修正标点符号：5处
- 统一术语使用
- 检查引用格式
```

### 步骤 6：生成质量报告

```typescript
const report = await tools['generate-report'].handler({
  report_type: 'quality-metrics',
  article_topic: 'HDR技术在移动设备上的应用与挑战',
  include_suggestions: true
});

console.log('报告已生成:', report.report_path);
```

**报告内容示例**：
```
# 写作质量报告

## 基本信息
- 文章主题：HDR技术在移动设备上的应用与挑战
- 工作流类型：新文章写作
- 实际用时：3.5小时
- 目标字数：3000字
- 实际字数：3150字

## 质量指标
- 事实准确性：100%
- 素材调用率：85%
- AI腔表达比例：1.5%
- 风格匹配度：4.6/5

## 关键成果
✅ 通过三遍审校
✅ 素材库使用率达到85%
✅ 成功降AI味至1.5%
✅ 工程师风格匹配度达标

## 建议
- 可进一步补充功耗测试数据
- 建议增加更多实际拍摄样张
- 未来可关注HDR与AI的结合应用
```

## 完整代码示例

```typescript
import { aiWritingSkill } from '../index';

async function writeTechArticle() {
  try {
    // 1. 初始化工作区
    const workspace = await aiWritingSkill.tools['init-workspace'].handler({
      workspace_type: 'tech'
    });

    // 2. 创建Brief
    const brief = await aiWritingSkill.tools['create-brief'].handler({
      topic: 'HDR技术在移动设备上的应用与挑战',
      target_audience: '移动设备工程师',
      word_count: 3000,
      key_points: [
        'HDR技术原理与标准',
        '移动设备实现的技术挑战',
        '功耗优化解决方案',
        '实际应用案例分析',
        '未来发展趋势'
      ],
      key_questions: [
        'HDR如何平衡画质与功耗？',
        '硬件HDR vs 软件HDR，哪种方案更优？',
        '用户真实体验如何？',
        '产业链如何协同推进HDR普及？'
      ]
    });

    // 3. 执行工作流
    const workflow = await aiWritingSkill.tools['run-workflow'].handler({
      workflow_type: 'new_article',
      workspace_type: 'tech',
      brief_id: brief.brief_id
    });

    // 4. 等待工作流完成
    const finalOutput = await waitForWorkflow(workflow.workflow_id);

    // 5. 三遍审校
    const review = await aiWritingSkill.tools['review-article'].handler({
      article_content: finalOutput.content,
      review_level: 'standard',
      target_style: 'tech'
    });

    // 6. 生成报告
    const report = await aiWritingSkill.tools['generate-report'].handler({
      report_type: 'quality-metrics',
      article_topic: 'HDR技术在移动设备上的应用与挑战',
      include_suggestions: true
    });

    console.log('写作完成！');
    console.log('文章路径:', finalOutput.path);
    console.log('质量报告:', report.report_path);

  } catch (error) {
    console.error('写作流程出错:', error);
  }
}

async function waitForWorkflow(workflowId: string) {
  // 实际实现中需要轮询或监听工作流状态
  // 这里只是示例
  return { content: '完整文章内容', path: './output/article.md' };
}
```

## 关键要点

1. **严格遵循9步流程** - 不跳过任何步骤
2. **充分利用素材库** - 提升内容真实感
3. **重视三遍审校** - 特别是第二遍风格审校
4. **关注质量指标** - 确保各项指标达标
5. **持续优化** - 根据报告建议改进

通过这个完整的工作流，您可以创建高质量、低AI腔的技术文章。
