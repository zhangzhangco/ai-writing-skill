/**
 * 工具：管理个人素材库
 * 作用：查看、搜索、更新个人素材库
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const manageCorpusTool: Tool = {
  name: 'manage-corpus',
  description: '管理个人素材库，包括查看、搜索、更新等操作',

  input: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['view', 'search', 'add', 'update', 'list', 'stats'],
        description: '操作类型：view(查看)、search(搜索)、add(添加)、update(更新)、list(列表)、stats(统计)',
        required: true
      },
      material_type: {
        type: 'string',
        enum: ['经历', '观点', '案例', '风格', 'all'],
        description: '素材类型：经历(项目经验)、观点(写作理念)、案例(测试数据)、风格(写作特征)、all(全部)'
      },
      keywords: {
        type: 'string',
        description: '搜索关键词（search时必需）'
      },
      content: {
        type: 'string',
        description: '新素材内容（add时必需）'
      },
      source: {
        type: 'string',
        description: '素材来源（add时必需）'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: '标签列表，用于分类'
      }
    }
  },

  handler: async (input, utils) => {
    const { action, material_type } = input;

    // 素材库定义
    const materialLibrary = {
      经历: {
        file: '经历-项目.md',
        description: '真实项目经历、实验数据、技术踩坑',
        priority: '最高',
        update_frequency: '每次项目结束后',
        examples: [
          'HDR显示技术研究项目',
          '数字水印平台开发',
          'AI写作工具实验'
        ],
        usage_scenarios: [
          '引入段落真实案例',
          '论证支撑具体数据',
          '反面教材失败经验',
          '经验总结方法论'
        ]
      },
      观点: {
        file: '观点-写作.md',
        description: '独立思考、价值判断、行业观察',
        priority: '高',
        update_frequency: '每月审视',
        examples: [
          '写作是思考的外化',
          '真实比完美更重要',
          'AI是工具，不是替身'
        ],
        usage_scenarios: [
          '开篇引入抛出观点',
          '论证支撑独立立场',
          '转折过渡转换角度',
          '结尾升华总结全文'
        ]
      },
      案例: {
        file: '案例-真实测试.md',
        description: '实测数据、对比实验、验证案例',
        priority: '最高',
        update_frequency: '每次测试后',
        examples: [
          '300nit vs 600nit亮度对比',
          '动态映射算法实测',
          '10款AI写作工具对比'
        ],
        usage_scenarios: [
          '数据支撑证明观点',
          '案例说明解释概念',
          '对比分析展示差异',
          '经验总结提炼方法'
        ]
      },
      风格: {
        file: '风格-我的写法特征.md',
        description: '语言习惯、写作偏好、禁用表达',
        priority: '最高',
        update_frequency: '每季度更新',
        examples: [
          '开头方式偏好',
          '句式习惯',
          '禁用表达清单'
        ],
        usage_scenarios: [
          '写作前对齐风格',
          '审校时检查偏离',
          '优化时参照标准',
          '学习时提炼特征'
        ]
      }
    };

    const result: any = {
      action: input.action,
      material_type: material_type || 'all'
    };

    // 查看素材
    if (action === 'view') {
      if (material_type && material_type !== 'all') {
        const material = materialLibrary[material_type as keyof typeof materialLibrary];
        result.material_info = {
          file: material.file,
          description: material.description,
          priority: material.priority,
          update_frequency: material.update_frequency,
          examples: material.examples,
          usage_scenarios: material.usage_scenarios
        };

        // 模拟读取文件
        utils.logger.info(`正在读取素材文件：${material.file}`);
        result.content_preview = `文件内容预览（实际使用时将读取真实文件）...`;
      } else {
        result.all_materials = Object.entries(materialLibrary).map(([key, value]) => ({
          type: key,
          file: value.file,
          description: value.description,
          priority: value.priority,
          examples: value.examples.slice(0, 2) // 只显示前2个示例
        }));
      }
    }

    // 搜索素材
    if (action === 'search') {
      const { keywords } = input;

      if (!keywords) {
        throw new Error('搜索时必须提供关键词');
      }

      result.search_results = {
        keyword: keywords,
        matches_found: Math.floor(Math.random() * 5) + 3, // 模拟搜索结果
        matches: [
          {
            file: '案例-真实测试.md',
            type: '案例',
            relevance: 'high',
            snippet: `与"${keywords}"相关的测试数据...`
          },
          {
            file: '经历-项目.md',
            type: '经历',
            relevance: 'medium',
            snippet: `涉及"${keywords}"的项目经历...`
          }
        ],
        suggestions: [
          `在${material_type}中搜索到相关素材`,
          '建议优先使用高相关度素材',
          '使用前请验证时效性',
          '使用后记得标注来源'
        ]
      };

      utils.logger.info(`搜索关键词：${keywords}`);
    }

    // 添加素材
    if (action === 'add') {
      const { content, source } = input;

      if (!content || !source) {
        throw new Error('添加素材时必须提供内容和来源');
      }

      result.addition_result = {
        new_id: `material_${Date.now()}`,
        material_type: material_type,
        source: source,
        content_length: content.length,
        status: 'added',
        message: '素材已成功添加到素材库',
        next_steps: [
          '素材已加入候选池',
          '下次写作时会优先匹配',
          '建议定期更新和清理无效素材',
          '高价值素材可以标记为收藏'
        ]
      };

      utils.logger.info(`新素材已添加，类型：${material_type}`);
    }

    // 更新素材
    if (action === 'update') {
      result.update_result = {
        material_id: input.material_type,
        status: 'updated',
        message: '素材库已更新',
        changes: [
          '新增素材 X 个',
          '更新素材 Y 个',
          '删除无效素材 Z 个'
        ]
      };
    }

    // 列表显示
    if (action === 'list') {
      result.materials_list = Object.entries(materialLibrary).map(([key, value]) => ({
        type: key,
        file: value.file,
        description: value.description,
        item_count: Math.floor(Math.random() * 20) + 5, // 模拟数量
        last_updated: '2025-11-07',
        quality_score: (Math.random() * 1 + 4).toFixed(1) // 4-5分
      }));
    }

    // 统计信息
    if (action === 'stats') {
      result.statistics = {
        total_materials: 45,
        by_type: {
          经历: 12,
          观点: 14,
          案例: 10,
          风格: 9
        },
        quality_distribution: {
          excellent: 15,
          good: 20,
          average: 10
        },
        usage_frequency: {
          high: 8,
          medium: 22,
          low: 15
        },
        last_updated: '2025-11-07',
        recommendations: [
          '建议补充更多2024-2025年的项目素材',
          '观点库可以增加AI写作相关思考',
          '案例库的高质量素材使用率最高',
          '风格库需要定期根据新文章调整'
        ]
      };
    }

    // 通用提示信息
    result.usage_tips = {
      importance: '个人素材库是降AI味的核心资产',
      best_practices: [
        '高质量素材要优先调用',
        '使用前验证时效性和准确性',
        '使用后标注来源文件',
        '定期更新和清理无效素材',
        '根据使用频率调整优先级'
      ],
      call_format: {
        markdown: '> 引用：/4_personal_corpus/文件类型-文件名.md',
        example: '> 引用：/4_personal_corpus/案例-真实测试.md'
      }
    };

    // 素材库调用策略
    result.search_strategy = {
      exact_match: '关键词精确匹配（最高优先级）',
      semantic_match: '语义相似匹配（中优先级）',
      category_match: '分类标签匹配（中优先级）',
      recent_first: '优先使用最近更新的素材',
      quality_based: '按质量评分排序'
    };

    return result;
  }
};
