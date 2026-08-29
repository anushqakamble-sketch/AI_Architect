import { LearningModule, SkillLevel, TechExperience, UserGoal } from '../types';
import { ALL_LEARNING_MODULES } from './modules';

export interface GeneratedCurriculumResult {
  modules: LearningModule[];
  overview: string;
  recommendedFocus: string;
  estimatedTotalHours: number;
  learningPathTitle: string;
  tags: string[];
}

export function generateCurriculum(goal: UserGoal): GeneratedCurriculumResult {
  const goalLower = goal.goalText.toLowerCase();
  const isBeginner = goal.skillLevel === 'beginner';
  const isAdvanced = goal.skillLevel === 'advanced';
  
  // Detect specific topics mentioned in the goal
  const mentionsRAG = goalLower.includes('rag') || goalLower.includes('retrieval') || goalLower.includes('documents') || goalLower.includes('knowledge') || goalLower.includes('search') || goalLower.includes('pdf');
  const mentionsAgents = goalLower.includes('agent') || goalLower.includes('tool') || goalLower.includes('autonomous') || goalLower.includes('function call') || goalLower.includes('workflow');
  const mentionsIntegration = goalLower.includes('integrate') || goalLower.includes('existing') || goalLower.includes('platform') || goalLower.includes('app') || goalLower.includes('api') || goalLower.includes('react') || goalLower.includes('backend');
  const mentionsNLP = goalLower.includes('nlp') || goalLower.includes('linguistics') || goalLower.includes('token') || goalLower.includes('language');

  // Determine focus
  let focusTag = 'AI Chatbot & Application Integration';
  if (mentionsAgents && mentionsRAG) {
    focusTag = 'Agentic RAG & Enterprise Workflows';
  } else if (mentionsAgents) {
    focusTag = 'Autonomous AI Agents & Tool Calling';
  } else if (mentionsRAG) {
    focusTag = 'Custom Knowledge Retrieval & RAG Systems';
  } else if (mentionsIntegration) {
    focusTag = 'Full-Stack AI Integration & Production APIs';
  }

  // Filter and prioritize modules based on skill level and goal
  let selectedModuleIds: string[] = [];

  if (isBeginner) {
    // Beginners need strong fundamentals
    selectedModuleIds = [
      'ai-foundations',
      'nlp-tokenization',
      'prompt-engineering',
      'embeddings-vector-db',
      'rag-architecture',
      'building-basic-chatbot',
      'ai-agents-tool-calling',
      'app-integration-api'
    ];
    if (mentionsAgents) {
      selectedModuleIds.push('multi-agent-planning');
    }
    if (mentionsRAG) {
      selectedModuleIds.push('advanced-rag-knowledge');
    }
  } else if (isAdvanced) {
    // Advanced learners jump straight to deep technical architecture
    selectedModuleIds = [
      'prompt-engineering',
      'embeddings-vector-db',
      'rag-architecture',
      'advanced-rag-knowledge',
      'building-basic-chatbot',
      'ai-agents-tool-calling',
      'multi-agent-planning',
      'app-integration-api',
      'eval-guardrails-production'
    ];
  } else {
    // Intermediate (standard balanced comprehensive path)
    selectedModuleIds = [
      'ai-foundations',
      'prompt-engineering',
      'embeddings-vector-db',
      'rag-architecture',
      'building-basic-chatbot',
      'advanced-rag-knowledge',
      'ai-agents-tool-calling',
      'app-integration-api',
      'eval-guardrails-production'
    ];
    if (mentionsAgents) {
      selectedModuleIds.push('multi-agent-planning');
    }
  }

  // Ensure between 6 and 11 modules
  const uniqueIds = Array.from(new Set(selectedModuleIds));
  
  // Map to full module objects and adjust numbering
  const curriculumModules: LearningModule[] = uniqueIds
    .map(id => ALL_LEARNING_MODULES.find(m => m.id === id))
    .filter((m): m is LearningModule => m !== undefined)
    .map((module, index) => ({
      ...module,
      moduleNumber: index + 1
    }));

  const totalMinutes = curriculumModules.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  // Build personalized summary
  let overview = `Tailored for a **${goal.skillLevel.toUpperCase()}** developer`;
  if (goal.techExperience.length > 0 && !goal.techExperience.includes('No coding experience')) {
    overview += ` with background in **${goal.techExperience.join(', ')}**`;
  }
  overview += `. This path walks you step-by-step from fundamental architecture to building, testing, and deploying your AI system.`;

  return {
    modules: curriculumModules,
    overview,
    recommendedFocus: focusTag,
    estimatedTotalHours: totalHours,
    learningPathTitle: `${focusTag} Masterclass`,
    tags: [goal.skillLevel, ...goal.techExperience.slice(0, 3)]
  };
}
