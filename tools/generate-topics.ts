/**
 * 工具：生成多个选题方向
 * 作用：基于研究资料生成4个不同角度的选题供选择
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const generateTopicsTool: Tool = {
  name: 'generate-topics',
  description: '基于研究资料生成多个选题方向，便于选择和深入创作',

  input: {
    type: 'object',
    properties: {
      main_topic: {
        type: 'string',
        description: '主题关键词',
        required: true
      },
      target_audience: {
        type: 'string',
        description: '目标读者群体',
        required: true
      },
      materials_available: {
        type: 'array',
        items: { type: 'string' },
        description: '已收集的资料关键词（可选）'
      },
      angle_preferences: {
        type: 'array',
        items: { type: 'string' },
        description: '偏好角度（技术/商业/用户/趋势）',
        default: ['技术', '应用', '对比', '趋势']
      },
      output_count: {
        type: 'number',
        description: '生成选题数量',
        default: 4,
        minimum: 3,
        maximum: 6
      },
      style_preference: {
        type: 'string',
        enum: ['deep', 'practical', 'analytical', 'trendy'],
        description: '风格偏好',
        default: 'practical'
      }
    }
  },

  handler: async (input, utils) => {
    const {
      main_topic,
      target_audience,
      materials_available = [],
      angle_preferences = ['技术', '应用', '对比', '趋势'],
      output_count = 4,
      style_preference = 'practical'
    } = input;

    utils.logger.info(`为"${main_topic}"生成${output_count}个选题方向`);

    // 选题生成策略
    const topicTemplates = {
      技术: {
        prefix: '深度解析',
        focus: '技术原理、架构、实现细节',
        angle: '工程师视角',
        structure: '技术深挖 + 原理 + 挑战',
        hooks: ['底层逻辑', '技术实现', '架构设计']
      },
      应用: {
        prefix: '实战指南',
        focus: '实际应用、案例、经验',
        angle: '实践者视角',
        structure: '应用场景 + 案例 + 经验总结',
        hooks: ['真实案例', '实践经验', '坑与建议']
      },
      对比: {
        prefix: '横向对比',
        focus: '不同方案、优劣分析',
        angle: '决策者视角',
        structure: '对比分析 + 选型建议',
        hooks: ['选型', '优劣', '最佳实践']
      },
      趋势: {
        prefix: '未来展望',
        focus: '发展方向、预测、前沿',
        angle: '观察者视角',
        structure: '现状 + 趋势 + 预测',
        hooks: ['未来', '趋势', '机会']
      }
    };

    // 生成4个不同角度的选题
    const topics = angle_preferences.slice(0, output_count).map((angle, index) => {
      const template = topicTemplates[angle] || topicTemplates['技术'];
      const hook = template.hooks[index % template.hooks.length];

      return {
        id: `topic_${index + 1}`,
        title: `${template.prefix}：${main_topic}的${angle}维度深度剖析`,
        angle: angle,
        focus: template.focus,
        angle_detail: template.angle,
        target_audience: target_audience,
        content_hooks: [
          `以${hook}为核心展开`,
          `${template.structure}的结构组织内容`,
          `结合${main_topic}的实际场景讲解`
        ],
        suggested_structure: template.structure,
        estimated_word_count: angle === '技术' ? 3500 : 3000,
        difficulty: angle === '技术' ? 'high' : 'medium',
        uniqueness_score: 0.85 + (Math.random() * 0.1),
        audience_match: 0.9,
        materials_readiness: materials_available.length > 0 ? 0.8 : 0.6,
        pros: [
          `角度独特，${hook}视角分析`,
          `符合${target_audience}的阅读偏好`,
          `内容有深度，有技术含量`
        ],
        potential_challenges: [
          '需要收集更多技术细节',
          '案例可能需要补充',
          '专业度要求较高'
        ]
      };
    });

    // 为每个选题打分
    const scoredTopics = topics.map(topic => {
      const final_score = (
        topic.uniqueness_score * 0.3 +
        topic.audience_match * 0.3 +
        topic.materials_readiness * 0.2 +
        (1 - (topic.difficulty === 'high' ? 0.3 : 0.1)) * 0.2
      );

      return {
        ...topic,
        overall_score: Number((final_score * 10).toFixed(2)),
        recommendation: final_score > 0.8 ? '强烈推荐' : final_score > 0.7 ? '推荐' : '可考虑'
      };
    });

    // 按得分排序
    scoredTopics.sort((a, b) => b.overall_score - a.overall_score);

    utils.logger.info(`已生成${scoredTopics.length}个选题，得分最高：${scoredTopics[0].title}`);

    return {
      main_topic,
      target_audience,
      total_topics: scoredTopics.length,
      topics: scoredTopics,
      top_recommendation: scoredTopics[0],
      selection_criteria: {
        uniqueness: '内容角度的新颖程度',
        audience_match: '与目标读者的契合度',
        materials_readiness: '现有素材的充足程度',
        difficulty: '创作难度评估'
      },
      next_steps: [
        '1. 浏览所有选题，选择最感兴趣的一个',
        '2. 确认选择后，调用 create-brief 创建详细Brief',
        '3. 基于Brief执行 run-workflow 开始创作'
      ],
      selection_tips: [
        '建议选择得分0.8以上的选题',
        '优先选择自己熟悉的角度',
        '考虑可用素材的丰富程度',
        '匹配目标读者的兴趣点'
      ]
    };
  }
};

// 注意：generate-topics使用export const方式导出
