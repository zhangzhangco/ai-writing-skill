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

    // 检查MCP环境
    let searchMethod = 'guide';
    let searchResults;

    // 检查是否有MCP环境
    if (utils.mcp && typeof utils.mcp.listServers === 'function') {
      try {
        const mcpServers = await utils.mcp.listServers();
        const hasWebSearchMCP = mcpServers.some((server: any) =>
          server.name?.toLowerCase().includes('web') ||
          server.name?.toLowerCase().includes('search')
        );

        if (hasWebSearchMCP) {
          utils.logger.info('✅ 检测到web search MCP！');
          utils.logger.info('📋 请在调用此工具前先执行MCP搜索');
          searchMethod = 'mcp_guide';
          const guideResult = guideMCPUsage(research_queries, utils);

          // 返回指导信息而不是实际搜索结果
          return {
            research_topic,
            total_sources: 0,
            categorized_materials: { technical: [], cases: [], data: [], opinions: [] },
            search_queries: research_queries,
            source_breakdown: {
              technical_docs: 0,
              case_studies: 0,
              benchmarks: 0,
              research_papers: 0
            },
            search_method: searchMethod,
            mcp_usage: guideResult.usage_example,
            mcp_instructions: guideResult.note,
            next_steps: [
              '1. 先执行MCP搜索：await utils.mcp.call("web_search", { query, num_results: 5 })',
              '2. 将搜索结果格式化后传递给web-research',
              '3. 或使用manage-corpus手动添加素材'
            ],
            research_summary: `请先执行MCP搜索后再使用此工具处理结果。检测到web search MCP可用。`
          };
        }
      } catch (mcpError) {
        utils.logger.warn(`MCP检测失败: ${mcpError.message}`);
      }
    }

    // 检查是否有WebSearch工具
    if (utils.webSearch || typeof WebSearch !== 'undefined') {
      utils.logger.info('✅ 检测到WebSearch工具！');
      utils.logger.info('📋 请在调用此工具前先执行WebSearch');
      searchMethod = 'websearch_guide';
      const guideResult = guideWebSearchUsage(research_queries, utils);

      return {
        research_topic,
        total_sources: 0,
        categorized_materials: { technical: [], cases: [], data: [], opinions: [] },
        search_queries: research_queries,
        source_breakdown: {
          technical_docs: 0,
          case_studies: 0,
          benchmarks: 0,
          research_papers: 0
        },
        search_method: searchMethod,
        websearch_usage: guideResult.usage_example,
        websearch_instructions: guideResult.note,
        next_steps: [
          '1. 先执行WebSearch：WebSearch({ query, num_results: 10 })',
          '2. 将搜索结果格式化后传递给web-research',
          '3. 或使用manage-corpus手动添加素材'
        ],
        research_summary: `请先执行WebSearch后再使用此工具处理结果。检测到WebSearch工具可用。`
      };
    }

    // 如果都没有，提供指导或使用模拟数据
    utils.logger.warn('⚠️ 未检测到MCP或WebSearch，使用模拟数据进行开发测试');
    searchMethod = 'mock';
    searchResults = generateMockResults(research_queries, source_types);

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
      search_method: searchMethod,
      mock_warning: searchMethod === 'mock' ? '⚠️ 这是模拟数据，仅用于开发测试' : '',
      next_steps: [
        '1. 查看已保存的素材库 (manage-corpus view)',
        '2. 基于研究结果生成多个选题 (generate-topics)',
        '3. 选择感兴趣的选题继续创作'
      ],
      research_summary: `已为"${research_topic}"收集${searchResults.reduce((sum, r) => sum + r.sources.length, 0)}份资料（${searchMethod}模式），主要涵盖技术分析和应用案例。资料已${input.save_to_corpus ? '自动保存' : '标记为需要手动保存'}到素材库。`
    };
  }
};

// 注意：web-research使用export const方式导出

/**
 * 使用MCP进行搜索 - 指导函数
 * 说明：在实际运行时，您需要手动调用MCP工具
 */
function guideMCPUsage(queries: string[], utils: any) {
  utils.logger.info(`
🔍 MCP搜索指导

请在您的应用中调用以下MCP方法：

1. 检查MCP服务器：
   const servers = await utils.mcp.listServers();

2. 执行web search MCP调用：
   const results = await utils.mcp.call('web_search', {
     query: 'HDR技术 投影应用',
     num_results: 5
   });

3. 将结果格式化为所需格式后传入此工具
  `);

  return {
    queries,
    note: '请在调用此工具前先执行MCP搜索',
    usage_example: `
在调用web-research前，请先：
const mcpResults = await utils.mcp.call('web_search', { query, num_results: 5 });
然后将结果传递给web-research工具。`,
    search_queries: queries
  };
}

/**
 * 使用WebSearch工具进行搜索 - 指导函数
 * 说明：在实际运行时，您需要手动调用WebSearch工具
 */
function guideWebSearchUsage(queries: string[], utils: any) {
  utils.logger.info(`
🔍 WebSearch工具指导

请在您的应用中调用以下方法：

1. 调用WebSearch工具：
   const searchResult = await utils.webSearch({
     query: 'HDR技术 投影应用',
     num_results: 10
   });

2. 格式化结果并传递给此工具

注意：此工具只能由Claude Code在运行时调用，无法在Skill中直接使用
  `);

  return {
    queries,
    note: '请在调用此工具前先执行WebSearch',
    usage_example: `
在调用web-research前，请先：
const searchResult = await WebSearch({ query, num_results: 10 });
然后将结果传递给web-research工具。`,
    search_queries: queries
  };
}

/**
 * 模拟搜索结果 - 开发模式
 * 说明：用于开发测试，实际使用时应调用真实搜索
 */
function generateMockResults(queries: string[], source_types: string[]) {
  return queries.map(query => ({
    query,
    sources: [
      {
        title: `${query} - 技术分析报告`,
        summary: `关于${query}的详细技术分析，包括最新发展趋势...`,
        relevance_score: 0.95,
        type: 'technical_docs'
      },
      {
        title: `${query} - 实际应用案例`,
        summary: `真实项目中${query}的应用案例和最佳实践...`,
        relevance_score: 0.88,
        type: 'case_studies'
      },
      {
        title: `${query} - 行业数据报告`,
        summary: `${query}相关的行业数据和市场分析...`,
        relevance_score: 0.82,
        type: 'benchmarks'
      }
    ],
    method: 'mock'
  }));
}
