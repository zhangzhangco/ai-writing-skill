/**
 * 工具：初始化工作区
 * 作用：帮助用户选择并切换到合适的工作区
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const initWorkspaceTool: Tool = {
  name: 'init-workspace',
  description: '初始化AI写作工作区，根据内容类型加载对应规则',

  input: {
    type: 'object',
    properties: {
      workspace_type: {
        type: 'string',
        enum: ['tech', 'blog', 'paper', 'promptlab'],
        description: '工作区类型：tech(科技写作)、blog(公众号)、paper(学术)、promptlab(提示词)',
        required: true
      },
      target_path: {
        type: 'string',
        description: '目标目录路径（可选，默认为当前目录）',
        default: './ai-writing'
      }
    }
  },

  handler: async (input, utils) => {
    const { workspace_type, target_path } = input;

    const workspaceDescriptions = {
      tech: {
        name: '科技写作工作区',
        description: '适用于技术评测、项目说明、科普文章',
        rules_file: 'ws_tech.md',
        features: [
          '强调数据支撑',
          '实操案例优先',
          '专业但易懂',
          '技术细节准确'
        ],
        audience: '技术工程师、研发人员、产品经理',
        style: '工程师视角，理性分析',
        output: '技术深度 + 实用价值'
      },
      blog: {
        name: '公众号写作工作区',
        description: '适用于科技类公众号文章、趋势分析、行业观察',
        rules_file: 'ws_blog.md',
        features: [
          '故事化引入',
          '浅显易懂',
          '观点鲜明',
          '互动性强'
        ],
        audience: '科技爱好者、从业者、普通读者',
        style: '亲切友好，适度幽默',
        output: '有趣 + 有料 + 有观点'
      },
      paper: {
        name: '学术论文工作区',
        description: '适用于学术论文、技术报告、标准文档',
        rules_file: 'ws_paper.md',
        features: [
          '逻辑严谨',
          '引用规范',
          '方法透明',
          '结论审慎'
        ],
        audience: '研究人员、学者、技术专家',
        style: '学术客观，第三人称',
        output: '严谨性 + 可验证性'
      },
      promptlab: {
        name: 'Prompt工程工作区',
        description: '适用于提示词研究、流程设计、AI协作优化',
        rules_file: 'ws_promptlab.md',
        features: [
          '系统化设计',
          '可测可证',
          '可复现',
          '可迭代'
        ],
        audience: 'AI工程师、提示词工程师、系统设计者',
        style: '实验精神，工程思维',
        output: '方法论 + 最佳实践'
      }
    };

    const workspace = workspaceDescriptions[workspace_type];

    // 记录初始化信息
    utils.logger.info(`正在初始化工作区：${workspace.name}`);
    utils.logger.info(`工作区描述：${workspace.description}`);
    utils.logger.info(`目标读者：${workspace.audience}`);

    // 返回初始化结果
    return {
      status: 'initialized',
      workspace_type,
      workspace_info: {
        name: workspace.name,
        description: workspace.description,
        rules_file: workspace.rules_file,
        features: workspace.features,
        target_audience: workspace.audience,
        style: workspace.style,
        output: workspace.output
      },

      // 下一步建议
      next_steps: [
        `1. 创建Brief文件 (create-brief tool)`,
        `2. 选择工作流 (run-workflow tool)`,
        `3. 准备个人素材库 (manage-corpus tool)`
      ],

      // 快速开始指南
      quick_start: {
        step1: '使用 create-brief 创建写作Brief',
        step2: '使用 run-workflow 选择并执行工作流',
        step3: '使用 manage-corpus 管理个人素材',
        step4: '使用 review-article 进行三遍审校',
        step5: '使用 generate-report 生成报告'
      },

      // 核心原则
      principles: [
        '真实比完美更重要',
        '数据胜过观点',
        '思考过程比结论更珍贵',
        '素材库是核心资产'
      ],

      // 质量标准
      quality_standards: {
        factual_accuracy: '100%',
        material_usage: '≥80%',
        ai_tone_expression: '<2%',
        style_match: '≥4.5/5'
      }
    };
  }
};
