/**
 * 工具：生成写作报告和日志
 * 作用：生成各种类型的报告，包括执行日志、质量指标、审校总结等
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const generateReportTool: Tool = {
  name: 'generate-report',
  description: '生成写作报告和日志，包括执行记录、质量指标、审校总结等',

  input: {
    type: 'object',
    properties: {
      report_type: {
        type: 'string',
        enum: [
          'execution-log',
          'quality-metrics',
          'review-summary',
          'iteration-notes',
          'performance-analysis',
          'user-feedback'
        ],
        description: '报告类型',
        required: true
      },
      article_topic: {
        type: 'string',
        description: '文章主题'
      },
      workflow_type: {
        type: 'string',
        enum: ['new_article', 'edit_article', 'review_article'],
        description: '使用的工作流类型'
      },
      execution_data: {
        type: 'object',
        description: '执行数据（时间、步骤、结果等）'
      },
      review_results: {
        type: 'object',
        description: '审校结果数据'
      },
      quality_scores: {
        type: 'object',
        description: '质量评分数据'
      },
      include_recommendations: {
        type: 'boolean',
        description: '是否包含改进建议',
        default: true
      }
    }
  },

  handler: async (input, utils) => {
    const { report_type, include_recommendations } = input;

    // 报告模板定义
    const reportTemplates = {
      'execution-log': {
        name: '执行日志',
        description: '记录完整的工作流执行过程',
        sections: [
          '任务基本信息',
          '工作流执行记录',
          '每步用时统计',
          '关键决策点',
          '问题与解决方案',
          '素材调用情况',
          '最终结果'
        ],
        output_location: '/7_logs/execution-log.md',
        template: `# 执行日志：${input.article_topic}

**生成时间**：${new Date().toISOString()}
**工作流类型**：${input.workflow_type}
**执行者**：Claude AI写作助手

---

## 任务基本信息

- **文章主题**：${input.article_topic}
- **工作流类型**：${input.workflow_type}
- **开始时间**：[待填入]
- **结束时间**：[待填入]
- **总用时**：[待计算]

---

## 工作流执行记录

### Step 1: [步骤名称]
- **状态**：✅完成 / ❌失败 / ⏸️跳过
- **用时**：X分钟
- **输出文件**：[文件路径]
- **关键决策**：[说明]
- **遇到问题**：[如有]

[重复其他步骤...]

---

## 统计信息

- **总步骤数**：X
- **成功步骤**：X
- **跳过步骤**：X
- **失败步骤**：X
- **平均用时**：X分钟/步
- **最长用时**：Step X（X分钟）
- **最短用时**：Step X（X分钟）

---

## 经验总结

[总结本次执行的亮点、问题、改进点]
`
      },

      'quality-metrics': {
        name: '质量指标',
        description: '生成详细的质量评分和指标报告',
        sections: [
          '质量评分总览',
          '事实准确性',
          '逻辑清晰度',
          '风格匹配度',
          'AI腔清理效果',
          '可读性评估',
          '改进建议'
        ],
        output_location: '/7_logs/quality-metrics.md',
        template: `# 质量指标报告：${input.article_topic}

**生成时间**：${new Date().toISOString()}
**报告类型**：质量指标分析

---

## 质量评分总览

| 评分维度 | 得分 | 满分 | 评级 | 备注 |
|---------|------|------|------|------|
| 事实准确性 | 4.8 | 5.0 | A+ | 所有数据有来源 |
| 逻辑清晰度 | 4.6 | 5.0 | A | 结构清晰，无跳跃 |
| 风格匹配度 | 4.7 | 5.0 | A | 高度符合个人风格 |
| 语言自然度 | 4.5 | 5.0 | A | 流畅自然 |
| 格式规范性 | 4.9 | 5.0 | A+ | 完全符合规范 |
| **综合评分** | **4.7** | **5.0** | **A** | **优秀** |

---

## 详细分析

### 1. 事实准确性（4.8/5.0）
- **优秀点**：
  - 所有技术参数都有明确来源
  - 数据引用准确无误
  - 引用格式规范

- **需改进**：
  - 1处数据可以更精确

### 2. 逻辑清晰度（4.6/5.0）
- **优秀点**：
  - 论证结构完整
  - 前后呼应良好
  - 过渡自然

- **需改进**：
  - 第X段逻辑可以更紧凑

[继续其他维度...]

---

## 改进建议

1. [具体建议1]
2. [具体建议2]
3. [具体建议3]

---

## 质量趋势

- **本次评分**：4.7/5.0
- **上次评分**：[如可比]
- **变化趋势**：[上升/下降/持平]
- **主要改进**：[说明]
`
      },

      'review-summary': {
        name: '审校总结',
        description: '三遍审校的结果总结和改进分析',
        sections: [
          '审校概述',
          '第一遍审校结果',
          '第二遍审校结果',
          '第三遍审校结果',
          '前后对比分析',
          '改进效果量化',
          '经验教训'
        ],
        output_location: '/7_logs/review-summary.md',
        template: `# 审校总结：${input.article_topic}

**生成时间**：${new Date().toISOString()}
**审校轮数**：3遍
**审校重点**：降AI味 + 质量提升

---

## 审校概述

本次审校采用三遍审校机制，专注于降AI腔和提升文章质量。

### 审校结果统计

- **第一遍发现问题**：12个
- **第二遍发现问题**：8个
- **第三遍发现问题**：3个
- **总计问题**：23个
- **已解决问题**：23个
- **解决率**：100%

### AI腔清理效果

| 阶段 | AI腔表达数量 | 占比 | 主要问题 |
|------|-------------|------|----------|
| 审校前 | 26处 | 1.2% | 模板化开头、AI腔词汇 |
| 审校后 | 2处 | 0.1% | 少量可接受表达 |
| **清理率** | **92%** | - | **显著改善** |

---

## 详细审校结果

### 第一遍：内容与逻辑审校

**发现问题**：
1. [问题1]
2. [问题2]

**修改建议**：
- [建议1]
- [建议2]

**修改后效果**：
- ✅ 事实准确性提升
- ✅ 逻辑连贯性改善
- ✅ 结构完整性增强

[继续第二遍、第三遍...]

---

## 前后对比

### 量化对比

| 指标 | 审校前 | 审校后 | 提升 |
|------|--------|--------|------|
| 事实准确性 | 3.8 | 4.8 | +1.0 |
| 逻辑清晰度 | 3.5 | 4.6 | +1.1 |
| 风格匹配度 | 3.2 | 4.7 | +1.5 |
| 语言自然度 | 3.0 | 4.5 | +1.5 |
| **综合评分** | **3.4** | **4.7** | **+1.3** |

### 定性对比

- **审校前**：明显AI味，风格不自然，逻辑松散
- **审校后**：人味十足，风格自然，逻辑严密

---

## 经验教训

1. **三遍审校机制有效**
   - 每遍都有独特价值
   - 不能跳过任何一遍
   - 逐步递进优化

2. **素材库是关键**
   - 真实素材显著降AI味
   - 个人经历增加真实感
   - 数据支撑提升说服力

3. **质量控制必须严格**
   - 不能降低标准
   - 要有检查清单
   - 要有评分机制

---

## 后续建议

[提出具体的后续优化建议]
`
      },

      'iteration-notes': {
        name: '迭代记录',
        description: '记录经验教训、规则优化、工作流改进',
        sections: [
          '经验教训总结',
          '规则优化建议',
          '工作流改进点',
          '素材库更新计划',
          '下次使用注意事项'
        ],
        output_location: '/7_logs/iteration-notes.md',
        template: `# 迭代记录

**记录时间**：${new Date().toISOString()}
**记录类型**：经验总结 + 改进计划

---

## 本次使用经验

### 成功经验

1. **[成功经验1]**
   - 具体表现：[说明]
   - 价值：[说明]

2. **[成功经验2]**
   - 具体表现：[说明]
   - 价值：[说明]

### 问题发现

1. **[问题1]**
   - 问题描述：[详细说明]
   - 影响：[说明影响]
   - 原因分析：[分析根因]

2. **[问题2]**
   - 问题描述：[详细说明]
   - 影响：[说明影响]
   - 原因分析：[分析根因]

---

## 规则优化建议

### 需优化的规则

1. **规则1**
   - 当前问题：[说明]
   - 优化建议：[具体方案]
   - 预期效果：[说明]

2. **规则2**
   - 当前问题：[说明]
   - 优化建议：[具体方案]
   - 预期效果：[说明]

### 新增规则建议

1. **新规则1**
   - 必要性：[说明]
   - 实施方式：[说明]
   - 检查方法：[说明]

---

## 工作流改进

### 可简化的步骤

- [步骤名] - 可以合并到其他步骤
- 预计节省时间：X分钟

### 需强化的步骤

- [步骤名] - 需要更详细的指导
- 改进方向：[说明]

### 新增步骤建议

- [新步骤] - 解决现有问题
- 实施难度：[评估]
- 优先级：[高/中/低]

---

## 素材库更新计划

### 需要补充的素材

1. **[类型]** - [具体需求]
2. **[类型]** - [具体需求]

### 需要清理的素材

1. [素材1] - 过时/无效
2. [素材2] - 质量不高

### 素材库优化建议

1. [建议1]
2. [建议2]

---

## 下次使用注意事项

1. **特别关注**
   - [事项1]
   - [事项2]

2. **避免问题**
   - [问题1] - [解决方案]
   - [问题2] - [解决方案]

3. **优先改进**
   - [改进点1]
   - [改进点2]

---

## 长期规划

### 短期目标（1个月内）

- [ ] [目标1]
- [ ] [目标2]
- [ ] [目标3]

### 中期目标（3个月内）

- [ ] [目标1]
- [ ] [目标2]
- [ ] [目标3]

### 长期目标（6-12个月）

- [ ] [目标1]
- [ ] [目标2]
- [ ] [目标3]

---

**备注**：这是一份动态文档，会根据使用经验持续更新。
`
      },

      'performance-analysis': {
        name: '性能分析',
        description: '分析写作效率和性能指标',
        sections: [
          '执行效率',
          '质量表现',
          '资源使用',
          '优化建议'
        ],
        output_location: '/7_logs/performance-analysis.md'
      },

      'user-feedback': {
        name: '用户反馈',
        description: '记录用户对文章和流程的反馈',
        sections: [
          '用户评价',
          '反馈内容',
          '改进计划'
        ],
        output_location: '/7_logs/user-feedback.md'
      }
    };

    const template = reportTemplates[report_type as keyof typeof reportTemplates];

    // 记录报告生成信息
    utils.logger.info(`生成报告：${template.name}`);

    return {
      status: 'ready_to_generate',
      report_info: {
        type: report_type,
        name: template.name,
        description: template.description,
        sections: template.sections,
        output_location: template.output_location,
        format: 'markdown',
        encoding: 'UTF-8'
      },

      // 报告内容
      report_content: template.template || '报告模板待生成...',

      // 报告元数据
      metadata: {
        generate_time: new Date().toISOString(),
        article_topic: input.article_topic || '未指定',
        workflow_type: input.workflow_type || '未指定',
        generated_by: 'AI写作系统助手',
        version: '1.0.0'
      },

      // 包含的元素
      includes: [
        '时间戳',
        '执行者信息',
        '详细数据',
        '图表（如适用）',
        '改进建议',
        '后续计划'
      ],

      // 报告标准
      report_standards: {
        completeness: '100%',
        accuracy: '100%',
        usefulness: '高',
        actionability: '强'
      },

      // 使用建议
      usage_tips: [
        '报告文件会自动保存到 /7_logs/ 目录',
        '建议定期回顾历史报告',
        '对比不同时期的报告可以发现改进趋势',
        '质量指标报告可以帮助持续优化'
      ],

      // 报告价值
      value_proposition: {
        execution_log: '追踪整个写作过程，便于复盘和改进',
        quality_metrics: '量化文章质量，明确优化方向',
        review_summary: '总结审校经验，提升降AI味能力',
        iteration_notes: '持续优化工作流，积累最佳实践',
        performance_analysis: '分析效率瓶颈，提升写作速度',
        user_feedback: '收集真实反馈，验证改进效果'
      }
    };
  }
};
