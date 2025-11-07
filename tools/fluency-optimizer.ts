/**
 * 工具：流畅度优化
 * 作用：专门优化文章的流畅度，包括段落过渡、句子长度、节奏控制
 */

import { Tool } from '@anthropic-ai/claude-code-sdk';

export const fluencyOptimizerTool: Tool = {
  name: 'fluency-optimizer',
  description: '专门优化文章流畅度，包括段落过渡、句子拆分、节奏控制等',

  input: {
    type: 'object',
    properties: {
      article_content: {
        type: 'string',
        description: '待优化的文章内容',
        required: true
      },
      optimization_level: {
        type: 'string',
        enum: ['basic', 'standard', 'deep'],
        description: '优化级别：basic(基础)、standard(标准)、deep(深度)',
        default: 'standard'
      },
      target_audience: {
        type: 'string',
        description: '目标读者，影响节奏控制',
        default: 'general'
      },
      focus_areas: {
        type: 'array',
        items: { type: 'string' },
        description: '重点优化领域',
        default: ['paragraph_transition', 'sentence_length', 'info_density', 'rhythm_control']
      }
    }
  },

  handler: async (input, utils) => {
    const { article_content, optimization_level, target_audience, focus_areas } = input;

    utils.logger.info(`开始流畅度优化，级别：${optimization_level}`);

    // 1. 段落过渡检查与优化
    const paragraphTransitionAnalysis = () => {
      const sections = article_content.split(/^## /m);
      const transitionIssues: Array<{section: number, title: string, issue: string, suggestion: string}> = [];

      sections.forEach((section, index) => {
        if (index === 0) return; // 跳过第一个空section

        const lines = section.split('\n');
        const title = lines[0].trim();
        const firstParagraph = lines.slice(1).find(line => line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*'));

        if (firstParagraph) {
          const firstLine = firstParagraph.trim();

          // 检查是否有过渡词或过渡句
          const hasTransition = /^(但|然而|接下来|基于|从|除了|更重要的是|同时|此外|因此|所以|这|那|以上|下面)/.test(firstLine);
          const isNewTopic = firstLine.length < 15 && !hasTransition; // 过短且无过渡

          if (!hasTransition || isNewTopic) {
            transitionIssues.push({
              section: index,
              title,
              issue: '缺少自然的段落过渡',
              suggestion: `建议在开头添加过渡句，如："基于以上分析，接下来我们将..."或"但技术成熟只是第一步，真正的变革在于..."`
            });
          }
        }
      });

      return transitionIssues;
    };

    // 2. 句子长度分析
    const sentenceLengthAnalysis = () => {
      const sentences = article_content.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
      const longSentences: Array<{text: string, length: number, suggestion: string}> = [];

      sentences.forEach(sentence => {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 30) {
          // 提供拆分建议
          let suggestion = '';

          // 检查是否有并列结构
          if (cleanSentence.includes('，') && cleanSentence.split('，').length > 2) {
            suggestion = '建议：将并列的多个短句拆分为独立句子';
          } else if (cleanSentence.includes('；')) {
            suggestion = '建议：将分号前后的内容拆分为两个句子';
          } else if (cleanSentence.includes('，并且') || cleanSentence.includes('，同时')) {
            suggestion = '建议：将"并且/同时"连接的内容拆分为两个句子';
          } else {
            suggestion = '建议：将长句拆分为2-3个短句';
          }

          longSentences.push({
            text: cleanSentence.length > 50 ? cleanSentence.substring(0, 50) + '...' : cleanSentence,
            length: cleanSentence.length,
            suggestion
          });
        }
      });

      return {
        total: sentences.length,
        longCount: longSentences.length,
        longPercentage: (longSentences.length / sentences.length * 100).toFixed(1),
        examples: longSentences.slice(0, 5)
      };
    };

    // 3. 信息密度分析
    const infoDensityAnalysis = () => {
      const paragraphs = article_content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
      const denseParagraphs: Array<{text: string, infoPoints: number, suggestion: string}> = [];

      paragraphs.forEach((paragraph, index) => {
        const sentences = paragraph.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
        if (sentences.length > 3) { // 超过3个信息点认为是信息过密
          denseParagraphs.push({
            text: paragraph.length > 100 ? paragraph.substring(0, 100) + '...' : paragraph,
            infoPoints: sentences.length,
            suggestion: '建议：拆分为2个段落，或删除非核心信息点'
          });
        }
      });

      return {
        totalParagraphs: paragraphs.length,
        denseCount: denseParagraphs.length,
        densityPercentage: (denseParagraphs.length / paragraphs.length * 100).toFixed(1),
        examples: denseParagraphs.slice(0, 3)
      };
    };

    // 4. 中文段落长度分析
    const chineseParagraphAnalysis = () => {
      const paragraphs = article_content.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
      const shortParagraphs: Array<{text: string, length: number, suggestion: string}> = [];
      const longParagraphs: Array<{text: string, length: number, suggestion: string}> = [];

      paragraphs.forEach(paragraph => {
        const length = paragraph.length;
        // 中文段落建议200-500字
        if (length < 200) {
          shortParagraphs.push({
            text: paragraph.length > 100 ? paragraph.substring(0, 100) + '...' : paragraph,
            length,
            suggestion: '建议：扩展段落内容，增加细节或例子，达到200字以上'
          });
        } else if (length > 500) {
          longParagraphs.push({
            text: paragraph.length > 100 ? paragraph.substring(0, 100) + '...' : paragraph,
            length,
            suggestion: '建议：将超长段落拆分为2-3个段落，每个段落聚焦一个主题'
          });
        }
      });

      return {
        totalParagraphs: paragraphs.length,
        shortCount: shortParagraphs.length,
        longCount: longParagraphs.length,
        shortExamples: shortParagraphs.slice(0, 3),
        longExamples: longParagraphs.slice(0, 3)
      };
    };

    // 5. 问句检查
    const questionCheck = () => {
      const sentences = article_content.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
      const questions: Array<{text: string, position: string, suggestion: string}> = [];

      sentences.forEach((sentence, index) => {
        const cleanSentence = sentence.trim();
        // 检查问句模式
        if (/^[？?]/.test(cleanSentence) || /？$/.test(cleanSentence) || /^[哪里|什么|为什么|怎么|如何|是不是|能不能|要不要]/.test(cleanSentence)) {
          questions.push({
            text: cleanSentence.length > 50 ? cleanSentence.substring(0, 50) + '...' : cleanSentence,
            position: `第${index + 1}句`,
            suggestion: '建议：将问句改为陈述句或反问句，避免直接提问'
          });
        }
      });

      return {
        totalSentences: sentences.length,
        questionCount: questions.length,
        questionPercentage: (questions.length / sentences.length * 100).toFixed(1),
        examples: questions.slice(0, 5)
      };
    };

    // 6. 诗式换行检查
    const poeticLineBreakCheck = () => {
      const lines = article_content.split('\n');
      const issues: Array<{lineNumber: number, text: string, suggestion: string}> = [];

      let consecutiveBreaks = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const nextLine = lines[i + 1]?.trim() || '';

        // 检查孤立的短行（可能是诗式换行）
        if (line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*') && line.length < 50) {
          if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('-') && !nextLine.startsWith('*') && nextLine.length < 50) {
            consecutiveBreaks++;
            if (consecutiveBreaks > 0) {
              issues.push({
                lineNumber: i + 1,
                text: line,
                suggestion: '建议：将相关短句合并为连续段落，避免诗式换行'
              });
            }
          }
        } else {
          consecutiveBreaks = 0;
        }
      }

      return {
        totalLines: lines.length,
        issueCount: issues.length,
        examples: issues.slice(0, 5)
      };
    };

    // 执行分析
    const transitionIssues = paragraphTransitionAnalysis();
    const sentenceStats = sentenceLengthAnalysis();
    const densityStats = infoDensityAnalysis();
    const paragraphStats = chineseParagraphAnalysis();
    const questionStats = questionCheck();
    const poeticBreakStats = poeticLineBreakCheck();

    // 生成优化建议
    const optimizationSuggestions = {
      paragraph_transition: transitionIssues.length > 0,
      sentence_length: parseFloat(sentenceStats.longPercentage) > 5,
      info_density: parseFloat(densityStats.densityPercentage) > 20,
      chinese_paragraph_length: paragraphStats.shortCount > 0 || paragraphStats.longCount > 0,
      question_check: questionStats.questionCount > 0,
      poetic_line_break: poeticBreakStats.issueCount > 0
    };

    // 计算流畅度评分
    let fluencyScore = 5.0;

    if (transitionIssues.length > 0) fluencyScore -= 0.5;
    if (parseFloat(sentenceStats.longPercentage) > 10) fluencyScore -= 0.8;
    if (parseFloat(sentenceStats.longPercentage) > 20) fluencyScore -= 1.0;
    if (parseFloat(densityStats.densityPercentage) > 30) fluencyScore -= 0.7;
    if (paragraphStats.shortCount > 2) fluencyScore -= 0.8; // 短段落过多
    if (paragraphStats.longCount > 0) fluencyScore -= 0.5; // 存在超长段落
    if (parseFloat(questionStats.questionPercentage) > 1) fluencyScore -= 0.8; // 问句过多
    if (poeticBreakStats.issueCount > 5) fluencyScore -= 0.5; // 诗式换行过多

    fluencyScore = Math.max(1.0, Math.min(5.0, fluencyScore));

    utils.logger.info(`流畅度评分：${fluencyScore.toFixed(1)}/5.0`);

    return {
      status: 'optimization_complete',
      fluency_score: Number(fluencyScore.toFixed(1)),
      score_breakdown: {
        paragraph_transition: transitionIssues.length === 0 ? 5.0 : Math.max(3.0, 5.0 - transitionIssues.length * 0.5),
        sentence_length: sentenceStats.longCount === 0 ? 5.0 : Math.max(2.0, 5.0 - (parseFloat(sentenceStats.longPercentage) / 10)),
        info_density: parseFloat(densityStats.densityPercentage) < 20 ? 5.0 : Math.max(2.0, 5.0 - (parseFloat(densityStats.densityPercentage) / 15)),
        chinese_paragraph_length: (paragraphStats.shortCount === 0 && paragraphStats.longCount === 0) ? 5.0 : Math.max(2.0, 5.0 - (paragraphStats.shortCount + paragraphStats.longCount) * 0.5),
        question_check: parseFloat(questionStats.questionPercentage) <= 1 ? 5.0 : Math.max(1.0, 5.0 - (parseFloat(questionStats.questionPercentage))),
        poetic_line_break: poeticBreakStats.issueCount === 0 ? 5.0 : Math.max(3.0, 5.0 - (poeticBreakStats.issueCount / 10))
      },

      // 详细分析结果
      analysis_results: {
        paragraph_transition: {
          issues_found: transitionIssues.length,
          issues: transitionIssues,
          pass_criteria: '每章开头有2-3句过渡',
          status: transitionIssues.length === 0 ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        },

        sentence_length: {
          total_sentences: sentenceStats.total,
          long_sentences: sentenceStats.longCount,
          long_percentage: sentenceStats.longPercentage,
          examples: sentenceStats.examples,
          pass_criteria: '长句<5%，平均长度<25字',
          status: parseFloat(sentenceStats.longPercentage) < 5 ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        },

        info_density: {
          total_paragraphs: densityStats.totalParagraphs,
          dense_paragraphs: densityStats.denseCount,
          density_percentage: densityStats.densityPercentage,
          examples: densityStats.examples,
          pass_criteria: '每段1-2个信息点',
          status: parseFloat(densityStats.densityPercentage) < 20 ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        },

        chinese_paragraph_length: {
          total_paragraphs: paragraphStats.totalParagraphs,
          short_paragraphs: paragraphStats.shortCount,
          long_paragraphs: paragraphStats.longCount,
          short_examples: paragraphStats.shortExamples,
          long_examples: paragraphStats.longExamples,
          pass_criteria: '每段200-500字，符合中文阅读习惯',
          status: (paragraphStats.shortCount === 0 && paragraphStats.longCount === 0) ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        },

        question_check: {
          total_sentences: questionStats.totalSentences,
          question_count: questionStats.questionCount,
          question_percentage: questionStats.questionPercentage,
          examples: questionStats.examples,
          pass_criteria: '问句比例<1%，技术文章避免问句',
          status: parseFloat(questionStats.questionPercentage) <= 1 ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        },

        poetic_line_break: {
          total_lines: poeticBreakStats.totalLines,
          issue_count: poeticBreakStats.issueCount,
          examples: poeticBreakStats.examples,
          pass_criteria: '避免诗式换行，相关内容合并为段落',
          status: poeticBreakStats.issueCount < 5 ? '✅ PASS' : '⚠️ NEED IMPROVEMENT'
        }
      },

      // 优化建议
      optimization_suggestions: {
        high_priority: [
          ...(transitionIssues.length > 0 ? ['为缺少过渡的章节添加2-3句过渡句'] : []),
          ...(parseFloat(sentenceStats.longPercentage) > 10 ? ['拆分超过30字的长句'] : []),
          ...(parseFloat(densityStats.densityPercentage) > 30 ? ['拆分信息过密的段落'] : []),
          ...(paragraphStats.shortCount > 0 ? ['扩展短段落至200字以上'] : []),
          ...(paragraphStats.longCount > 0 ? ['将超长段落拆分为2-3个段落'] : []),
          ...(parseFloat(questionStats.questionPercentage) > 1 ? ['将问句改为陈述句或反问句'] : []),
          ...(poeticBreakStats.issueCount > 0 ? ['合并诗式换行为连贯段落'] : [])
        ],
        medium_priority: [
          ...(parseFloat(sentenceStats.longPercentage) > 5 ? ['优化句式结构，增加短句调节'] : []),
          ...(parseFloat(questionStats.questionPercentage) > 0.5 ? ['减少技术文章中的问句使用'] : [])
        ],
        low_priority: [
          '在长段落后添加呼吸点（短段落或列表）',
          '使用过渡词汇连接句子',
          '控制每段的核心信息点数量',
          '保持句长适度变化（10字短句+30字中句+50字长句）'
        ]
      },

      // 目标读者适配
      target_audience_notes: {
        general: '保持简洁明了，避免过于复杂的句式',
        technical: '可以容忍稍长的句子，但要注意逻辑清晰',
        academic: '重视严谨性，但需平衡可读性',
        creative: '鼓励多样化句式，但保持整体流畅'
      }[target_audience] || '保持平衡的阅读体验',

      next_steps: [
        '1. 根据分析结果进行修改',
        '2. 重新运行 fluency-optimizer 验证',
        '3. 进行人工阅读检查',
        '4. 最终质量确认'
      ]
    };
  }
};

export default fluencyOptimizerTool;
