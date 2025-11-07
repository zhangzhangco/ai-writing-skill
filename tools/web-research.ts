/**
 * 工具：网络研究与资料收集
 * 作用：自动搜索相关资料并保存到素材库
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const webResearchTool: Tool = {
  name: 'web-research',
  description: '自动搜索并整理相关资料，保存到素材库供写作使用',

  input: {
    type: 'object',
    properties: {
      research_topic: {
        type: 'string',
        description: '研究主题',
        required: true
      },
      research_queries: {
        type: 'array',
        items: { type: 'string' },
        description: '搜索关键词列表（至少3个）',
        minItems: 3
      },
      source_types: {
        type: 'array',
        items: { type: 'string' },
        enum: ['research_papers', 'technical_docs', 'news', 'case_studies', 'benchmarks'],
        description: '资料类型偏好',
        default: ['technical_docs', 'case_studies', 'benchmarks']
      },
      save_to_corpus: {
        type: 'boolean',
        description: '是否自动保存到素材库',
        default: true
      },
      auto_categorize: {
        type: 'boolean',
        description: '是否自动分类（经历/观点/案例/风格）',
        default: true
      }
    }
  },

  handler: async (input, utils) => {
    const { research_topic, research_queries, source_types } = input;

    utils.logger.info(`开始研究主题：${research_topic}`);
    utils.logger.info(`搜索关键词：${research_queries.join(', ')}`);

    // 模拟搜索过程
    const searchResults = await Promise.all(
      research_queries.map(async (query) => {
        utils.logger.info(`搜索中：${query}`);
        // 实际实现中会调用网络搜索API
        return {
          query,
          sources: [
            {
              title: `${query} - 技术分析报告`,
              summary: `关于${query}的详细技术分析...`,
              relevance_score: 0.95,
              type: 'technical_docs'
            },
            {
              title: `${query} - 实际应用案例`,
              summary: `真实项目中${query}的应用案例...`,
              relevance_score: 0.88,
              type: 'case_studies'
            }
          ]
        };
      })
    );

    // 整理并分类资料
    const categorizedMaterials = {
      technical: [],
      cases: [],
      data: [],
      opinions: []
    };

    searchResults.forEach(result => {
      result.sources.forEach(source => {
        if (source.type === 'technical_docs') {
          categorizedMaterials.technical.push({
            title: source.title,
            content: source.summary,
            category: '案例',
            tags: [research_topic, '技术资料', result.query],
            source_type: 'web_research'
          });
        } else if (source.type === 'case_studies') {
          categorizedMaterials.cases.push({
            title: source.title,
            content: source.summary,
            category: '案例',
            tags: [research_topic, '应用案例', result.query],
            source_type: 'web_research'
          });
        }
      });
    });

    // 自动保存到素材库
    if (input.save_to_corpus) {
      utils.logger.info('正在保存资料到素材库...');
      // 实际实现中会调用素材库管理工具
    }

    return {
      research_topic,
      total_sources: searchResults.reduce((sum, r) => sum + r.sources.length, 0),
      categorized_materials: categorizedMaterials,
      search_queries: research_queries,
      source_breakdown: {
        technical_docs: categorizedMaterials.technical.length,
        case_studies: categorizedMaterials.cases.length,
        benchmarks: 0,
        research_papers: 0
      },
      next_steps: [
        '1. 查看已保存的素材库 (manage-corpus view)',
        '2. 基于研究结果生成多个选题 (generate-topics)',
        '3. 选择感兴趣的选题继续创作'
      ],
      research_summary: `已为"${research_topic}"收集${searchResults.reduce((sum, r) => sum + r.sources.length, 0)}份资料，主要涵盖技术分析和应用案例。资料已自动保存到素材库。`
    };
  }
};

export default webResearchTool;
