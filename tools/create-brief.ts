/**
 * 工具：创建写作Brief
 * 作用：结构化写作需求，生成标准化Brief模板
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const createBriefTool: Tool = {
  name: 'create-brief',
  description: '创建结构化写作Brief，标准化写作需求',

  input: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: '文章主题',
        required: true
      },
      target_audience: {
        type: 'string',
        description: '目标读者（必须明确）',
        required: true
      },
      word_count: {
        type: 'number',
        description: '预期字数',
        default: 2000,
        minimum: 500,
        maximum: 10000
      },
      output_format: {
        type: 'string',
        enum: ['markdown', 'html', 'latex'],
        description: '输出格式',
        default: 'markdown'
      },
      key_points: {
        type: 'array',
        items: { type: 'string' },
        description: '核心要点列表（至少3个）',
        minItems: 3
      },
      key_questions: {
        type: 'array',
        items: { type: 'string' },
        description: '需要回答的关键问题',
        minItems: 3
      },
      material_requirements: {
        type: 'string',
        description: '素材需求说明（需要哪些类型的素材）'
      },
      special_requirements: {
        type: 'string',
        description: '特殊要求（配图、引用格式等）'
      },
      deadline: {
        type: 'string',
        description: '期望完成时间（可选）'
      },
      // ⭐ 新增：强制检查前置步骤
      prerequisite_check: {
        type: 'object',
        description: '前置步骤检查（用于自动验证）',
        properties: {
          has_research: {
            type: 'boolean',
            description: '是否已完成网络研究（web-research）',
            default: false
          },
          has_materials: {
            type: 'boolean',
            description: '是否已获取个人素材（manage-corpus）',
            default: false
          }
        }
      }
    }
  },

  handler: async (input, utils) => {
    const briefId = `brief_${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];

    // ⚠️ 强验证：检查前置步骤
    if (input.prerequisite_check) {
      const { has_research, has_materials } = input.prerequisite_check;

      if (!has_materials) {
        throw new Error(`
❌ 错误：未完成前置步骤

📋 当前步骤：创建写作Brief
⚠️ 缺少步骤：搜索个人素材（manage-corpus）

🔄 正确流程：
1. ✅ web-research（已完成）
2. ❌ manage-corpus（未完成）← 您在这里
3. ⏳ create-brief（当前）

📌 必须先执行：
const materials = await manageCorpusTool.handler({
  action: 'search',
  keywords: '你的主题关键词',
  material_type: '观点'
});

然后将结果传入 create-brief：
const brief = await createBriefTool.handler({
  topic: '你的主题',
  target_audience: '目标读者',
  prerequisite_check: {
    has_research: true,
    has_materials: true  // 确保为 true
  }
});
        `);
      }
    }

    // 生成Brief内容
    const briefContent = `# 写作Brief

**Brief ID**：${briefId}
**创建时间**：${currentDate}
**状态**：待执行

---

## 基本信息

**主题**：${input.topic}
**目标读者**：${input.target_audience}
**预期字数**：${input.word_count}字
**输出格式**：${input.output_format}

${input.deadline ? `**期望完成时间**：${input.deadline}` : ''}

---

## 核心要点

${input.key_points?.map((point, index) => `${index + 1}. ${point}`).join('\n') || '待明确'}

---

## 关键问题

需要回答的核心问题：

${input.key_questions?.map((question, index) => `${index + 1}. ${question}`).join('\n') || '待明确'}

---

## 素材需求

${input.material_requirements || '无特殊素材要求，建议优先使用个人素材库中的真实案例'}

---

## 特殊要求

${input.special_requirements || '无特殊要求'}

---

## 写作要求

### 内容要求
- ✅ 必须真实、准确、可验证
- ✅ 所有技术参数需标注来源
- ✅ 优先调用个人素材库
- ✅ 避免空洞的趋势分析

### 风格要求
- ✅ 符合对应工作区规则
- ✅ 避免AI腔表达
- ✅ 保持个人写作风格
- ✅ 段落长度适配移动端

### 质量要求
- ✅ 信息来源≥3个
- ✅ 真实素材引用≥1处
- ✅ AI腔表达<2%
- ✅ 风格匹配度≥4.5分

---

## 工作流规划

建议使用工作流：new_article（9步完整流程）

**预计用时**：3-4小时

**关键步骤**：
1. 信息搜索与知识库建立（30分钟）
2. 选题讨论（15分钟）⭐ 必做
3. 素材库调用（20分钟）
4. 初稿生成（90分钟）
5. 三遍审校（60分钟）

---

**备注**：这是一个结构化的写作Brief，确保每个环节都有明确的目标和要求。
`;

    utils.logger.info(`Brief已创建：${briefId}`);
    utils.logger.info(`主题：${input.topic}`);
    utils.logger.info(`预计字数：${input.word_count}`);

    // 返回Brief信息和下一步建议
    return {
      brief_id: briefId,
      brief_content: briefContent,
      status: 'created',

      // Brief摘要
      summary: {
        topic: input.topic,
        target_audience: input.target_audience,
        word_count: input.word_count,
        key_points_count: input.key_points?.length || 0,
        key_questions_count: input.key_questions?.length || 0
      },

      // 工作流建议
      workflow_suggestion: {
        type: 'new_article',
        reason: '这是新文章创作，建议使用完整的9步工作流',
        steps: [
          '保存Brief',
          '信息检索与知识库建立',
          '选题讨论（必做）',
          '学习个人风格',
          '调用个人素材库',
          '生成初稿',
          '三遍审校（逻辑→风格→细节）',
          '配图与成稿输出'
        ],
        time_estimate: '3-4小时'
      },

      // 下一步建议
      next_steps: [
        '1. 使用 run-workflow 工具开始执行工作流',
        '2. 使用 manage-corpus 检查和更新素材库',
        '3. 准备开始信息搜索和知识库建立'
      ],

      // 质量检查清单
      quality_checklist: [
        '□ 主题是否明确？',
        '□ 目标读者是否清晰？',
        '□ 核心要点是否完整？',
        '□ 关键问题是否明确？',
        '□ 素材需求是否合理？',
        '□ 特殊要求是否标注？'
      ],

      // 注意事项
      notes: [
        '选题讨论环节是核心，不能跳过',
        '个人素材库是降AI味的关键',
        '三遍审校必须严格执行',
        '所有信息必须可验证'
      ]
    };
  }
};
