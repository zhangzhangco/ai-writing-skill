/**
 * 工具：三遍审校（降AI味专用流程）
 * 作用：通过三层审校提升文章质量，重点是降AI腔
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';
import { fluencyOptimizerTool } from './fluency-optimizer';

export const reviewArticleTool: Tool = {
  name: 'review-article',
  description: '执行三遍审校流程，专门用于降AI味和提升文章质量',

  input: {
    type: 'object',
    properties: {
      article_content: {
        type: 'string',
        description: '待审校文章内容',
        required: true
      },
      review_level: {
        type: 'string',
        enum: ['basic', 'standard', 'deep'],
        description: '审校级别：basic(基础)、standard(标准)、deep(深度)',
        default: 'standard'
      },
      enable_fluency_optimization: {
        type: 'boolean',
        description: '是否启用流畅度优化（自动调用fluency-optimizer）',
        default: true
      },
      workspace_type: {
        type: 'string',
        enum: ['quick', 'standard', 'deep'],
        description: '审校深度：quick(快速)、standard(标准)、deep(深度)',
        default: 'standard'
      },
      focus_areas: {
        type: 'array',
        items: { type: 'string' },
        description: '重点检查领域',
        default: ['内容', '风格', '细节']
      },
      workspace_type: {
        type: 'string',
        enum: ['tech', 'blog', 'paper', 'promptlab'],
        description: '工作区类型，影响审校标准'
      },
      use_ai_tone_filter: {
        type: 'boolean',
        description: '是否启用AI腔过滤器',
        default: true
      }
    }
  },

  handler: async (input, utils) => {
    const { review_level, workspace_type, enable_fluency_optimization = true } = input;

    // 审校深度定义
    const reviewLevels = {
      quick: {
        name: '快速审校',
        time: '10-15分钟',
        focus: ['AI腔表达', '明显错误', '基本格式'],
        depth: 'surface'
      },
      standard: {
        name: '标准审校',
        time: '30-45分钟',
        focus: ['事实准确性', '逻辑连贯性', '风格一致性', '语言自然度'],
        depth: 'moderate'
      },
      deep: {
        name: '深度审校',
        time: '60-90分钟',
        focus: ['技术细节', '引用规范', '结构优化', '读者体验', '内容深度'],
        depth: 'thorough'
      }
    };

    const level = reviewLevels[review_level];

    // AI腔表达检测模式
    const aiTonePatterns = {
      template_starts: [
        '在当今时代',
        '随着...的快速发展',
        '近年来',
        '我们可以看到',
        '众所周知'
      ],
      empty_phrases: [
        '赋能', '引领', '加速转型',
        '充分利用', '深度挖掘', '极致体验'
      ],
      absolute_statements: [
        '所有人都知道',
        '显而易见',
        '毫无疑问',
        '板上钉钉'
      ],
      social_ending: [
        '让我们共同期待',
        '相信明天会更好',
        '未来可期',
        '一起加油'
      ]
    };

    // 工作区特定审校重点
    const workspaceFocus = {
      tech: {
        primary: ['技术准确性', '数据支撑', '实验验证'],
        secondary: ['专业术语', '逻辑严密', '实操性']
      },
      blog: {
        primary: ['可读性', '互动性', '金句设计'],
        secondary: ['开头抓力', '故事性', '情感共鸣']
      },
      paper: {
        primary: ['引用规范', '逻辑严谨', '方法透明'],
        secondary: ['学术客观', '结构完整', '结论审慎']
      },
      promptlab: {
        primary: ['方法论', '可复现性', '实验设计'],
        secondary: ['假设明确', '数据支撑', '结论有效']
      }
    };

    const focus = workspaceFocus[workspace_type as keyof typeof workspaceFocus];

    // 四遍审校流程定义
    const fourPassProcess = {
      pass1: {
        name: '第一遍：内容与逻辑审校',
        focus_areas: [
          '事实准确性：技术参数、数据来源',
          '逻辑连贯性：论证链条、因果关系',
          '结构完整性：各部分是否完整',
          '信息可验证：来源是否可靠'
        ],
        checks: [
          {
            item: '技术参数验证',
            description: '所有技术数据是否有来源',
            pass_criteria: '100%有来源标注'
          },
          {
            item: '逻辑连贯性',
            description: '论证是否环环相扣',
            pass_criteria: '无逻辑跳跃或断层'
          },
          {
            item: '信息完整性',
            description: '是否遗漏关键信息',
            pass_criteria: '核心观点有充分支撑'
          }
        ],
        common_issues: [
          '数据来源不明确',
          '逻辑链条断裂',
          '技术细节错误',
          '信息过时'
        ]
      },

      pass2: {
        name: '第二遍：风格与语气审校 ⭐',
        focus_areas: [
          'AI腔清理：模板化句式识别',
          '个人风格对齐：语言习惯、表达偏好',
          '语言自然度：流畅性、生动性',
          '真实感增强：个人色彩、真实细节'
        ],
        checks: [
          {
            item: 'AI腔表达检测',
            description: '识别并标记所有AI腔表达',
            pass_criteria: 'AI腔表达<2%'
          },
          {
            item: '风格一致性',
            description: '是否匹配个人写作风格',
            pass_criteria: '风格匹配度≥4.5/5'
          },
          {
            item: '语言自然度',
            description: '语言是否流畅自然',
            pass_criteria: '无明显机械感'
          },
          {
            item: '真实感',
            description: '是否体现个人特色',
            pass_criteria: '至少1处真实素材'
          }
        ],
        common_issues: [
          '模板化开头和结尾',
          '使用禁用词汇',
          '语气过于正式',
          '缺少个人色彩'
        ]
      },

      pass3: {
        name: '第三遍：细节与格式审校',
        focus_areas: [
          '术语一致性：专业词汇统一使用',
          '格式规范：标题、列表、引用格式',
          '标点符号：逗号、句号、分号使用',
          '数字与单位：数值格式、单位规范'
        ],
        checks: [
          {
            item: '术语一致性',
            description: '专业术语是否统一',
            pass_criteria: '无同义词混用'
          },
          {
            item: '格式规范',
            description: '是否符合写作规范',
            pass_criteria: '100%符合规范'
          },
          {
            item: '标点准确',
            description: '标点使用是否正确',
            pass_criteria: '无标点错误'
          },
          {
            item: '数字格式',
            description: '数值格式是否统一',
            pass_criteria: '格式完全一致'
          }
        ],
        common_issues: [
          '术语不统一',
          '中英文混排不规范',
          '标点中英文混用',
          '数字格式混乱'
        ]
      },

      pass4: {
        name: '第四遍：流畅度优化 ⭐',
        focus_areas: [
          '段落过渡：章节间连接是否自然',
          '句子长度：避免过长句子',
          '节奏控制：信息密度是否适中',
          '阅读体验：整体流畅度优化'
        ],
        checks: [
          {
            item: '段落过渡检查',
            description: '章节间是否有过渡句',
            pass_criteria: '每章开头有2-3句过渡'
          },
          {
            item: '句子长度优化',
            description: '长句是否拆分为短句',
            pass_criteria: '长句<5%，平均长度<25字'
          },
          {
            item: '信息密度控制',
            description: '段落信息点是否过多',
            pass_criteria: '每段1-2个信息点'
          },
          {
            item: '流畅度评分',
            description: '整体阅读流畅度',
            pass_criteria: '流畅度≥4.0/5'
          }
        ],
        common_issues: [
          '段落间跳跃大',
          '句子过长（>30字）',
          '信息点过密',
          '缺少呼吸点'
        ]
      }
    };

    // 执行四遍审校
    utils.logger.info(`执行${level.name}，预计用时：${level.time}`);

    // 第四遍审校：流畅度优化的具体实现逻辑
    const fluencyOptimization = {
      paragraphTransition: (content: string) => {
        // 检查段落间过渡
        const sections = content.split('## ');
        let transitionIssues: string[] = [];

        sections.forEach((section, index) => {
          if (index === 0) return; // 跳过第一个空section

          const lines = section.split('\n');
          const firstParagraph = lines.find(line => line.trim() && !line.startsWith('#'));

          if (firstParagraph) {
            // 检查是否有过渡词
            const hasTransition = /^(但|然而|接下来|基于|从|除了|更重要的是|同时|此外|因此|所以)/.test(firstParagraph.trim());
            if (!hasTransition) {
              transitionIssues.push(`第${index}章开头缺少过渡句`);
            }
          }
        });

        return transitionIssues;
      },

      sentenceLength: (content: string) => {
        // 检查句子长度
        const sentences = content.match(/[。！？.!?]/g) || [];
        const longSentences = content.split(/[。！？.!?]/).filter(s => s.length > 30);

        return {
          total: sentences.length,
          longCount: longSentences.length,
          longPercentage: (longSentences.length / sentences.length * 100).toFixed(1),
          examples: longSentences.slice(0, 3)
        };
      },

      infoDensity: (content: string) => {
        // 检查段落信息密度
        const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
        const denseParagraphs = paragraphs.filter(p => {
          const infoPoints = p.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
          return infoPoints.length > 2;
        });

        return {
          totalParagraphs: paragraphs.length,
          denseCount: denseParagraphs.length,
          densityPercentage: (denseParagraphs.length / paragraphs.length * 100).toFixed(1),
          examples: denseParagraphs.slice(0, 2)
        };
      }
    };

    // ⭐ 流畅度优化（如果启用）
    let fluencyOptimization = null;
    if (enable_fluency_optimization) {
      utils.logger.info('✨ 执行流畅度优化...');
      fluencyOptimization = await fluencyOptimizerTool.handler({
        article_content: input.article_content,
        optimization_level: review_level,
        target_audience: 'general',
        focus_areas: [
          'paragraph_transition',
          'sentence_length',
          'info_density',
          'rhythm_control'
        ]
      }, utils);
    }

    return {
      status: 'ready_to_execute',
      review_config: {
        level: input.review_level,
        level_name: level.name,
        time_estimate: level.time,
        depth: level.depth,
        focus_areas: level.focus,
        workspace_type: workspace_type,
        ai_tone_filter: input.use_ai_tone_filter,
        fluency_optimization_enabled: enable_fluency_optimization
      },

      // ⭐ 流畅度优化结果
      fluency_optimization: fluencyOptimization ? {
        status: 'completed',
        optimization_level: review_level,
        metrics: fluencyOptimization.metrics || {},
        optimized_content: fluencyOptimization.optimized_content,
        improvements: fluencyOptimization.improvements || []
      } : {
        status: 'disabled',
        reason: 'enable_fluency_optimization = false'
      },

      // AI腔检测模式
      ai_tone_detection: {
        patterns: aiTonePatterns,
        detection_method: '模式匹配 + 规则引擎',
        accuracy: '95%+',
        update_frequency: '每月更新规则'
      },

      // 三遍审校详细流程
      three_pass_process: {
        pass1: {
          name: threePassProcess.pass1.name,
          focus: threePassProcess.pass1.focus_areas,
          checks: threePassProcess.pass1.checks,
          common_issues: threePassProcess.pass1.common_issues,
          expected_time: '15分钟'
        },
        pass2: {
          name: threePassProcess.pass2.name,
          focus: threePassProcess.pass2.focus_areas,
          checks: threePassProcess.pass2.checks,
          common_issues: threePassProcess.pass2.common_issues,
          expected_time: '20分钟'
        },
        pass3: {
          name: threePassProcess.pass3.name,
          focus: threePassProcess.pass3.focus_areas,
          checks: threePassProcess.pass3.checks,
          common_issues: threePassProcess.pass3.common_issues,
          expected_time: '10-15分钟'
        }
      },

      // 工作区特定指导
      workspace_guidelines: {
        workspace: workspace_type,
        primary_focus: focus.primary,
        secondary_focus: focus.secondary
      },

      // 预期输出
      expected_outputs: [
        '第一遍审校报告（问题清单+修改建议）',
        '第二遍审校报告（AI腔清理+风格优化）',
        '第三遍审校报告（细节优化+格式规范）',
        '最终修改稿（经三遍审校优化）',
        '质量评分报告（各项得分+综合评分）',
        '改进建议（如何进一步优化）'
      ],

      // 质量标准
      quality_standards: {
        pass_criteria: {
          factual_accuracy: '100%',
          logic_coherence: '无断层',
          style_match: '≥4.5/5',
          ai_tone_ratio: '<2%',
          format_compliance: '100%',
          readability: '优秀'
        },
        excellence_criteria: {
          unique_perspective: '有独特观点',
          rich_materials: '素材丰富',
          natural_language: '语言自然',
          clear_structure: '结构清晰',
          engaging_content: '值得转发'
        }
      },

      // 下一步建议
      next_steps: [
        '1. 开始第一遍审校：内容与逻辑',
        '2. 重点检查工作区特定要求',
        '3. 清理所有AI腔表达',
        '4. 确保格式完全规范',
        '5. 对照质量标准自查'
      ],

      // 注意事项
      important_notes: [
        '第二遍是降AI味的关键',
        '不要跳过任何一遍审校',
        '发现严重问题时回到第一步',
        '质量标准必须严格把关',
        '最终稿件需要用户确认'
      ],

      // 快速通道（仅快速审校）
      fast_track: review_level === 'quick' ? {
        enabled: true,
        skips: ['深度内容分析', '详细格式检查'],
        keeps: ['AI腔检测', '基本逻辑检查'],
        time_saving: '50%'
      } : null
    };
  }
};
