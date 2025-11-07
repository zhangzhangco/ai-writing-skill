/**
 * AI协同写作系统助手Skill
 * 基于三层架构的科技写作工作流
 * 核心能力：降AI味、提升真实感、可追踪、可复用
 */

import { initWorkspaceTool } from './tools/init-workspace';
import { createBriefTool } from './tools/create-brief';
import { runWorkflowTool } from './tools/run-workflow';
import { manageCorpusTool } from './tools/manage-corpus';
import { reviewArticleTool } from './tools/review-article';
import { generateReportTool } from './tools/generate-report';
import { webResearchTool } from './tools/web-research';
import { generateTopicsTool } from './tools/generate-topics';
import { fluencyOptimizerTool } from './tools/fluency-optimizer';

export const aiWritingSkill = {
  name: 'ai-writing-assistant',
  description: 'AI协同写作系统助手 - 可控、可复用、可追踪的科技写作框架',
  version: '1.0.0',
  author: 'Claude',

  tools: {
    'init-workspace': initWorkspaceTool,
    'create-brief': createBriefTool,
    'run-workflow': runWorkflowTool,
    'manage-corpus': manageCorpusTool,
    'review-article': reviewArticleTool,
    'generate-report': generateReportTool,
    'web-research': webResearchTool,
    'generate-topics': generateTopicsTool,
    'fluency-optimizer': fluencyOptimizerTool
  },

  // 核心元数据
  manifest: {
    name: 'ai-writing-assistant',
    version: '1.0.0',
    description: 'AI协同写作系统助手 - 基于三层架构的科技写作工作流',
    categories: ['writing', 'productivity', 'content'],
    keywords: ['写作', 'AI', '工作流', '科技写作', '审校', '降AI味']
  },

  // 框架核心特征
  features: {
    three_layer_architecture: {
      name: '三层架构',
      layers: [
        {
          name: '认知结构层',
          description: '判断工作区与任务类型',
          files: ['CLAUDE.md', 'workspace_*.md']
        },
        {
          name: '操作流程层',
          description: '标准化工作流执行',
          files: ['*_article.yml']
        },
        {
          name: '经验注入层',
          description: '个人素材库与风格对齐',
          files: ['personal_corpus/*']
        }
      ]
    },
    anti_ai_tone_engine: {
      name: '降AI味引擎',
      mechanism: '三遍审校机制',
      passes: [
        '内容与逻辑审校',
        '风格与语气审校',
        '细节与格式审校'
      ]
    },
    quality_control: {
      name: '质量控制',
      standards: {
        accuracy: '100%',
        material_usage: '≥80%',
        ai_tone: '<2%',
        style_match: '≥4.5/5'
      }
    }
  },

  // 支持的工作流
  workflows: {
    new_article: {
      name: '新文章9步流程',
      steps: 9,
      time_estimate: '3-4小时',
      use_case: '完整新文章写作'
    },
    edit_article: {
      name: '修改快速流程',
      steps: 4,
      time_estimate: '1-2小时',
      use_case: '已有文章修改优化'
    },
    review_article: {
      name: '审校专用流程',
      steps: 5,
      time_estimate: '1-1.5小时',
      use_case: '降AI味、风格优化'
    }
  },

  // 支持的工作区
  workspaces: {
    tech: {
      name: '科技写作',
      description: '技术评测、项目说明、科普文章',
      audience: '技术工程师、研发人员'
    },
    blog: {
      name: '公众号写作',
      description: '科技类公众号文章、趋势分析',
      audience: '科技爱好者、从业者'
    },
    paper: {
      name: '学术论文',
      description: '学术论文、技术报告、标准文档',
      audience: '研究人员、学者'
    },
    promptlab: {
      name: 'Prompt工程',
      description: '提示词研究、流程设计、AI协作优化',
      audience: 'AI工程师、提示词工程师'
    }
  }
};

export default aiWritingSkill;
