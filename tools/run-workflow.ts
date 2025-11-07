/**
 * 工具：执行工作流
 * 作用：选择并执行对应的写作工作流
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const runWorkflowTool: Tool = {
  name: 'run-workflow',
  description: '选择并执行写作工作流，支持新文章、修改、审校三种模式',

  input: {
    type: 'object',
    properties: {
      workflow_type: {
        type: 'string',
        enum: ['new_article', 'edit_article', 'review_article'],
        description: '工作流类型',
        required: true
      },
      topic: {
        type: 'string',
        description: '文章主题（new_article时必需，自动执行完整流程）'
      },
      target_audience: {
        type: 'string',
        description: '目标读者（new_article时必需）',
        default: 'general'
      },
      brief_id: {
        type: 'string',
        description: 'Brief ID（可选，如果提供将跳过自动创建步骤）'
      },
      article_path: {
        type: 'string',
        description: '文章路径（edit_article或review_article时必需）'
      },
      workspace_type: {
        type: 'string',
        enum: ['tech', 'blog', 'paper', 'promptlab'],
        description: '工作区类型',
        required: true
      },
      fast_track: {
        type: 'boolean',
        description: '是否启用快速通道（仅限简单任务）',
        default: false
      },
      auto_mode: {
        type: 'boolean',
        description: '是否启用自动模式（自动调用所有工具，一键完成）',
        default: true
      },
      personal_materials: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            type: { type: 'string', enum: ['经历', '观点', '案例', '风格'] },
            tags: { type: 'array', items: { type: 'string' } }
          }
        },
        description: '个人素材库材料（auto_mode为false时必需）',
        required: false
      },
      materials_usage_rate: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: '素材调用率（auto_mode为false时必需）',
        required: false
      }
    }
  },

  handler: async (input, utils) => {
    const { workflow_type, workspace_type, fast_track, personal_materials, materials_usage_rate, auto_mode, topic, target_audience, brief_id } = input;

    // ✨ 自动模式：自动调用所有工具，一键完成
    if (auto_mode && workflow_type === 'new_article') {
      if (!topic) {
        throw new Error(`
❌ 错误：自动模式需要提供 topic

📋 请提供文章主题，例如：
const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  topic: 'HDR技术在投影领域的应用',
  workspace_type: 'tech',
  auto_mode: true
});
        `);
      }

      utils.logger.info('🚀 启动自动模式，自动执行完整工作流');

      // 执行完整的新文章工作流
      const result = await executeAutoNewArticleWorkflow({
        topic,
        target_audience: target_audience || 'general',
        workspace_type,
        fast_track,
        utils
      });

      return result;
    }

    // 🔧 手动模式：需要用户手动提供素材（保留原有逻辑）
    if (!auto_mode) {
      // ⚠️ 强制验证：必须提供个人素材
      if (!personal_materials || personal_materials.length === 0) {
        throw new Error(`
❌ 错误：未提供个人素材库材料

📋 解决方案：
1. 请先使用 manage-corpus 工具搜索个人素材
2. 获取个人观点、经历、案例、风格等材料
3. 确保素材调用率 ≥ 80%
4. 将获取的 materials 传入 run-workflow

示例：
const materials = await manageCorpusTool.handler({
  action: 'search',
  keywords: '你的主题关键词',
  material_type: '观点'
});

const workflow = await runWorkflowTool.handler({
  workflow_type: 'new_article',
  workspace_type: 'tech',
  brief_id: '...',
  personal_materials: materials.results.materials,  // 必需！
  materials_usage_rate: 0.85,  // 必需 ≥ 0.8
  auto_mode: false
});
        `);
      }
    }

    // ⚠️ 强制验证：素材调用率必须达标
    if (materials_usage_rate < 0.8) {
      throw new Error(`
❌ 错误：素材调用率不足

当前调用率：${(materials_usage_rate * 100).toFixed(1)}%
要求：≥ 80%

📋 解决方案：
1. 搜索更多相关个人素材
2. 确保至少使用 3-5 个个人素材
3. 在文章中体现个人观点和真实经历

请使用 manage-corpus 增加素材数量后重试。
      `);
    }

    utils.logger.info(`✅ 素材验证通过：${personal_materials.length}个素材，调用率${(materials_usage_rate * 100).toFixed(1)}%`);

    // 工作流定义
    const workflows = {
      new_article: {
        name: '新文章9步流程',
        description: '适用于完整新文章创作，包含从Brief到成稿的全流程',
        steps: [
          {
            step: 1,
            name: '保存Brief',
            description: '将Brief存档至 /5_briefs/',
            time: '5分钟',
            critical: false
          },
          {
            step: 2,
            name: '信息搜索与知识库建立',
            description: '检索权威资料，建立知识库',
            time: '30分钟',
            critical: false
          },
          {
            step: 3,
            name: '选题讨论',
            description: '提供3-4个选题选项，等待用户选择 ⭐',
            time: '15分钟',
            critical: true,
            note: '此步骤不能跳过'
          },
          {
            step: 4,
            name: '协作文档创建',
            description: '如需实验/配图，创建任务清单',
            time: '10分钟',
            critical: false,
            optional: true
          },
          {
            step: 5,
            name: '学习个人风格',
            description: '读取 /4_personal_corpus/ 风格文件',
            time: '10分钟',
            critical: false
          },
          {
            step: 6,
            name: '调用个人素材库 ⭐',
            description: '搜索匹配的真实案例和数据（必须使用）',
            time: '10分钟',
            critical: true,
            note: '此步骤不能跳过，素材调用率必须≥80%'
          },
          {
            step: 7,
            name: '生成初稿',
            description: '结合所有资料撰写初稿',
            time: '90分钟',
            critical: false
          },
          {
            step: 8,
            name: '四遍审校',
            description: '逻辑→风格→细节→流畅度，逐步优化 ⭐',
            time: '75分钟',
            critical: true
          },
          {
            step: 9,
            name: '流畅度优化',
            description: '段落过渡、句子拆分、节奏调整',
            time: '30分钟',
            critical: true
          },
          {
            step: 10,
            name: '配图与成稿输出',
            description: '生成配图需求，输出最终成稿',
            time: '30分钟',
            critical: false,
            optional: true
          }
        ],
        total_time: '3.5-4.5小时',
        fast_track_time: '2.5-3小时',
        quality_gate: ['选题确认', '四遍审校完成', '流畅度≥4.0'],
        output_files: [
          '/5_briefs/brief_*.md',
          '/3_knowledge_base/summary_*.md',
          '/7_logs/topic_*.md',
          '/5_briefs/draft_*.md',
          '/7_logs/review_*.md',
          '/5_briefs/final_*.md'
        ]
      },

      edit_article: {
        name: '文章修改快速流程',
        description: '适用于已有文章的修改、优化、扩展',
        steps: [
          {
            step: 1,
            name: '需求分析与理解',
            description: '分析修改范围和类型',
            time: '10分钟',
            critical: false
          },
          {
            step: 2,
            name: '快速理解原文',
            description: '提取核心价值和可用素材',
            time: '15分钟',
            critical: false
          },
          {
            step: 3,
            name: '执行修改',
            description: '按计划执行具体修改',
            time: '30-60分钟',
            critical: false
          },
          {
            step: 4,
            name: '质量审校',
            description: '检查修改效果和文章质量',
            time: '20分钟',
            critical: false
          }
        ],
        total_time: '1-2小时',
        fast_track_time: '30-60分钟',
        quality_gate: ['修改需求明确', '质量审校完成'],
        output_files: [
          '/5_briefs/edited_*.md',
          '/7_logs/edit_*.md'
        ]
      },

      review_article: {
        name: '审校与降AI味流程',
        description: '专门用于提升文章质量，重点是降AI腔',
        steps: [
          {
            step: 1,
            name: '文章诊断',
            description: '全面分析文章现状，识别问题 ⭐',
            time: '10分钟',
            critical: true
          },
          {
            step: 2,
            name: '第一遍审校：内容与逻辑',
            description: '检查准确性、逻辑、结构',
            time: '15分钟',
            critical: false
          },
          {
            step: 3,
            name: '第二遍审校：风格与语气',
            description: '清理AI腔，对齐个人风格 ⭐',
            time: '20分钟',
            critical: true
          },
          {
            step: 4,
            name: '第三遍审校：细节与格式',
            description: '优化段落、句式、标点',
            time: '15分钟',
            critical: false
          },
          {
            step: 5,
            name: '对比分析与总结',
            description: '生成改进报告和经验总结',
            time: '10分钟',
            critical: false
          }
        ],
        total_time: '1-1.5小时',
        fast_track_time: '45分钟',
        quality_gate: ['诊断完成', '三遍审校通过'],
        output_files: [
          '/7_logs/diagnosis_*.md',
          '/7_logs/review-pass1_*.md',
          '/7_logs/review-pass2_*.md',
          '/7_logs/review-pass3_*.md',
          '/7_logs/review-summary_*.md'
        ]
      }
    };

    const workflow = workflows[workflow_type];

    // 记录工作流信息
    utils.logger.info(`工作流类型：${workflow.name}`);
    utils.logger.info(`工作区：${workspace_type}`);
    utils.logger.info(`快速通道：${fast_track ? '开启' : '关闭'}`);

    // 根据工作区调整建议
    const workspaceGuidelines = {
      tech: {
        focus: '技术准确性和实操性',
        style: '工程师视角，专业严谨',
        check: ['数据支撑', '案例验证', '技术细节']
      },
      blog: {
        focus: '可读性和互动性',
        style: '故事化引入，金句提炼',
        check: ['开头抓力', '金句设计', '读者共鸣']
      },
      paper: {
        focus: '学术严谨性',
        style: '客观规范，引用完整',
        check: ['逻辑严密', '引用规范', '方法透明']
      },
      promptlab: {
        focus: '方法论和可复现性',
        style: '实验精神，系统化',
        check: ['假设明确', '实验设计', '结论有效']
      }
    };

    const guidelines = workspaceGuidelines[workspace_type];

    // 实际用时计算
    const actualTime = fast_track ? workflow.fast_track_time : workflow.total_time;

    return {
      status: 'ready_to_execute',
      workflow_type,
      workflow_info: {
        name: workflow.name,
        description: workflow.description,
        workspace_type,
        total_steps: workflow.steps.length,
        critical_steps: workflow.steps.filter(s => s.critical).length,
        optional_steps: workflow.steps.filter(s => s.optional).length,
        time_estimate: actualTime,
        fast_track_enabled: fast_track
      },

      // 详细步骤
      steps: workflow.steps.map(step => ({
        step: step.step,
        name: step.name,
        description: step.description,
        time: step.time,
        critical: step.critical,
        optional: step.optional || false,
        note: step.note || ''
      })),

      // 质量关卡
      quality_gates: workflow.quality_gate.map(gate => ({
        gate,
        description: `在${gate}之前不能继续`,
        blocking: true
      })),

      // 工作区特定指导
      workspace_guidelines: {
        focus: guidelines.focus,
        style: guidelines.style,
        check_points: guidelines.check
      },

      // 输出文件
      output_files: workflow.output_files,

      // 成功标准
      success_criteria: {
        all_steps_completed: true,
        quality_gates_passed: true,
        ai_tone_ratio: '<2%',
        material_usage: '≥80%',
        factual_accuracy: '100%'
      },

      // 下一步建议
      next_steps: [
        '1. 开始执行第一步：保存Brief/分析文章',
        '2. 确保有足够时间完成所有步骤',
        '3. 准备好个人素材库',
        '4. 保持透明思考，每步都解释为什么',
        '5. 关键节点等待用户确认'
      ],

      // 注意事项
      important_notes: [
        '关键步骤不能跳过',
        '质量关卡必须通过',
        '所有修改都要有记录',
        '最终稿件需要用户确认',
        '建议完成所有步骤，不要半途而废'
      ],

      // 快速通道说明
      fast_track: {
        enabled: fast_track,
        description: fast_track
          ? '跳过部分非关键步骤，但保持质量标准'
          : '完整执行所有步骤，保证最高质量',
        recommended_for: fast_track
          ? '紧急任务、简单修改'
          : '重要文章、首次使用'
      }
    };
  }
};

/**
 * 自动执行新文章完整工作流
 * 内部自动调用所有工具，一键完成
 */
async function executeAutoNewArticleWorkflow(params: {
  topic: string;
  target_audience: string;
  workspace_type: string;
  fast_track: boolean;
  utils: any;
}) {
  const { topic, target_audience, workspace_type, fast_track, utils } = params;
  const executionLog: any = {
    start_time: new Date().toISOString(),
    topic,
    workspace_type,
    fast_track,
    steps_completed: []
  };

  try {
    // 步骤1: 自动初始化工作区
    utils.logger.info('📁 步骤1/9: 初始化工作区...');
    const workspace = await import('./init-workspace').then(m => m.initWorkspaceTool.handler({
      workspace_type
    }, utils));
    executionLog.steps_completed.push({ step: 1, name: 'init-workspace', status: 'completed' });

    // 步骤2: 自动网络研究
    utils.logger.info('🔍 步骤2/9: 执行网络研究...');
    const researchQueries = generateResearchQueries(topic);
    const research = await import('./web-research').then(m => m.webResearchTool.handler({
      research_topic: topic,
      research_queries: researchQueries,
      source_types: ['technical_docs', 'case_studies', 'research_papers'],
      save_to_corpus: true
    }, utils));
    executionLog.steps_completed.push({ step: 2, name: 'web-research', status: 'completed' });

    // 步骤3: 自动生成选题
    utils.logger.info('💡 步骤3/9: 生成多选题方向...');
    const topics = await import('./generate-topics').then(m => m.generateTopicsTool.handler({
      main_topic: topic,
      target_audience,
      output_count: 4
    }, utils));
    executionLog.steps_completed.push({ step: 3, name: 'generate-topics', status: 'completed' });

    // 步骤4: 自动选择第一个选题（或让用户选择）
    const selectedTopic = topics.topics[0];
    utils.logger.info(`✅ 已选择选题: ${selectedTopic.title}`);

    // 步骤5: 自动搜索个人素材
    utils.logger.info('📚 步骤4/9: 搜索个人素材库...');
    const materials = await import('./manage-corpus').then(m => m.manageCorpusTool.handler({
      action: 'search',
      keywords: topic,
      material_type: '观点'
    }, utils));
    executionLog.steps_completed.push({ step: 4, name: 'manage-corpus', status: 'completed' });

    // 步骤6: 自动创建Brief
    utils.logger.info('📋 步骤5/9: 创建写作Brief...');
    const brief = await import('./create-brief').then(m => m.createBriefTool.handler({
      topic: selectedTopic.title,
      target_audience,
      word_count: 3000,
      key_points: selectedTopic.key_points || [],
      key_questions: selectedTopic.key_questions || []
    }, utils));
    executionLog.steps_completed.push({ step: 5, name: 'create-brief', status: 'completed' });

    // 步骤7: 执行内部写作逻辑
    utils.logger.info('✍️ 步骤6/9: 执行写作逻辑...');
    const articleContent = await generateArticleContent({
      topic: selectedTopic.title,
      brief: brief,
      materials: materials.results.materials,
      workspace_type,
      fast_track
    });
    executionLog.steps_completed.push({ step: 6, name: 'article_generation', status: 'completed' });

    // 步骤8: 自动四遍审校
    utils.logger.info('🔍 步骤7/9: 执行四遍审校...');
    const review = await import('./review-article').then(m => m.reviewArticleTool.handler({
      article_content: articleContent,
      review_level: 'standard'
    }, utils));
    executionLog.steps_completed.push({ step: 7, name: 'review-article', status: 'completed' });

    // 步骤9: 自动流畅度优化
    utils.logger.info('✨ 步骤8/9: 优化文章流畅度...');
    const fluency = await import('./fluency-optimizer').then(m => m.fluencyOptimizerTool.handler({
      article_content: review.optimized_content,
      optimization_level: 'standard',
      target_audience
    }, utils));
    executionLog.steps_completed.push({ step: 8, name: 'fluency-optimizer', status: 'completed' });

    // 步骤10: 自动生成报告
    utils.logger.info('📊 步骤9/9: 生成质量报告...');
    const report = await import('./generate-report').then(m => m.generateReportTool.handler({
      report_type: 'quality-metrics',
      article_topic: topic
    }, utils));
    executionLog.steps_completed.push({ step: 9, name: 'generate-report', status: 'completed' });

    executionLog.end_time = new Date().toISOString();
    executionLog.status = 'success';

    utils.logger.info('🎉 自动工作流完成！');

    return {
      status: 'auto_completed',
      execution_log: executionLog,
      article: {
        content: fluency.optimized_content,
        title: selectedTopic.title,
        word_count: fluency.optimized_content.length
      },
      quality_metrics: {
        fluency_score: fluency.fluency_score,
        material_usage_rate: materials.results.usage_rate,
        ai_tone_ratio: review.ai_tone_ratio
      },
      report: report,
      tools_invoked: executionLog.steps_completed.map(s => s.name)
    };

  } catch (error) {
    utils.logger.error(`❌ 自动工作流失败: ${error.message}`);
    executionLog.end_time = new Date().toISOString();
    executionLog.status = 'failed';
    executionLog.error = error.message;

    throw new Error(`自动工作流执行失败: ${error.message}`);
  }
}

/**
 * 生成研究查询词
 */
function generateResearchQueries(topic: string): string[] {
  // 简单的查询词生成逻辑，可以根据topic优化
  const baseKeywords = topic.split(/\s+/);
  const queries = [
    topic,
    `${topic} 技术`,
    `${topic} 应用`,
    `${topic} 案例`,
    `${topic} 最佳实践`
  ];
  return queries;
}

/**
 * 生成文章内容
 * 这里应该调用实际的AI生成逻辑，这里用占位符
 */
async function generateArticleContent(params: {
  topic: string;
  brief: any;
  materials: any[];
  workspace_type: string;
  fast_track: boolean;
}): Promise<string> {
  // 这里应该调用AI生成文章内容的逻辑
  // 由于这是工具调用链的演示，返回一个占位符
  return `# ${params.topic}\n\n[AI生成的文章内容将在此处]\n\n基于以下素材：\n${params.materials.map(m => `- ${m.title}`).join('\n')}`;
}
