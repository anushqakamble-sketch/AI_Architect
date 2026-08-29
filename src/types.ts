export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type TechExperience = 
  | 'No coding experience'
  | 'JavaScript / TypeScript'
  | 'Python'
  | 'React / Frontend'
  | 'Node.js / Backend'
  | 'Cloud / APIs';

export interface UserGoal {
  goalText: string;
  skillLevel: SkillLevel;
  techExperience: TechExperience[];
  primaryFocus: 'chatbot' | 'rag' | 'agent' | 'fullstack' | 'general';
  createdAt: string;
}

export type VisualType = 
  | 'token-embed'
  | 'prompt-flow'
  | 'rag-pipeline'
  | 'chat-state'
  | 'agent-loop'
  | 'hybrid-search'
  | 'api-integration'
  | 'eval-guardrails';

export interface FlowStep {
  id: number;
  title: string;
  desc: string;
  badge?: string;
  inputSample?: string;
  outputSample?: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExternalResource {
  title: string;
  type: 'Documentation' | 'Research Paper' | 'Interactive Guide' | 'GitHub Repository' | 'Course';
  url: string;
  description: string;
  tag?: string;
}

export interface CodeTab {
  language: string;
  filename: string;
  codeSnippet: string;
}

export interface InteractivePlaygroundConfig {
  type: 'token-tester' | 'prompt-tester' | 'rag-simulator' | 'chat-memory' | 'agent-tool-caller' | 'api-request';
  title: string;
  description: string;
  defaultInputs: Record<string, any>;
  paramsList: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'slider' | 'toggle';
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
    step?: number;
    defaultValue: any;
    helpText?: string;
  }[];
}

export interface LearningModule {
  id: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  category: 'Foundations' | 'NLP' | 'RAG' | 'Chatbot' | 'Agents' | 'Integration' | 'Production';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  relevanceScore?: number;
  concept: {
    summary: string;
    coreExplanation: string;
    keyPoints: string[];
    keyTerms: KeyTerm[];
  };
  howItWorks: {
    visualType: VisualType;
    diagramTitle: string;
    steps: FlowStep[];
    pipelineDescription: string;
  };
  whyItMatters: {
    businessValue: string;
    technicalBenefits: string[];
    commonPitfalls: string[];
  };
  example: {
    title: string;
    scenario: string;
    userQuery: string;
    systemProcess: string;
    finalOutput: string;
    takeaway: string;
  };
  code: {
    explanation: string;
    primarySnippet: CodeTab;
    alternativeSnippets?: CodeTab[];
    playgroundConfig?: InteractivePlaygroundConfig;
  };
  knowledgeCheck: {
    title: string;
    questions: QuizQuestion[];
  };
  resources: ExternalResource[];
}

export interface UserProgress {
  completedModuleIds: string[];
  quizAnswers: Record<string, number[]>; // moduleId -> selected option indices
  quizPassed: Record<string, boolean>; // moduleId -> boolean
  currentModuleId: string;
  xp: number;
  startedAt: string;
  lastActive: string;
  userGoal: UserGoal | null;
  curriculumModuleIds: string[];
}
