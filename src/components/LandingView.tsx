import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Bot, 
  Layers, 
  Cpu, 
  Check, 
  Clock, 
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { SkillLevel, TechExperience, UserGoal } from '../types';
import { generateCurriculum } from '../data/curriculumGenerator';

interface LandingViewProps {
  onStartLearning: (goal: UserGoal) => void;
  initialGoal?: UserGoal | null;
}

const PRESET_GOALS = [
  {
    label: 'Chatbot with App Integration',
    prompt: 'I want to learn how to build an AI chatbot and integrate it into my existing application or platform.',
    icon: Bot,
    recommendedLevel: 'intermediate' as SkillLevel
  },
  {
    label: 'RAG & Custom Knowledge System',
    prompt: 'I want to build a RAG system to search and answer questions from my private company documents and PDFs using vector embeddings.',
    icon: Layers,
    recommendedLevel: 'intermediate' as SkillLevel
  },
  {
    label: 'Autonomous AI Agents & Tool Calling',
    prompt: 'I want to build an autonomous AI agent with multi-step reasoning, tool execution, and API function calling.',
    icon: Cpu,
    recommendedLevel: 'advanced' as SkillLevel
  },
  {
    label: 'AI Fundamentals & NLP from Scratch',
    prompt: 'I want to understand how LLMs work under the hood, tokenization, prompt engineering, and the theory behind modern AI.',
    icon: GraduationCap,
    recommendedLevel: 'beginner' as SkillLevel
  }
];

const SKILL_LEVELS: { id: SkillLevel; title: string; desc: string; badge: string }[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'New to AI development. Want simple explanations, core concepts, and gentle step-by-step guidance.',
    badge: 'Foundation First'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    desc: 'Comfortable with programming. Ready to build working chatbots, vector embeddings, and RAG pipelines.',
    badge: 'Practical Builder'
  },
  {
    id: 'advanced',
    title: 'Advanced',
    desc: 'Experienced engineer. Focus on agentic workflows, function calling, evaluation guardrails, and production APIs.',
    badge: 'Deep Architecture'
  }
];

const TECH_OPTIONS: TechExperience[] = [
  'JavaScript / TypeScript',
  'Python',
  'React / Frontend',
  'Node.js / Backend',
  'Cloud / APIs',
  'No coding experience'
];

export const LandingView: React.FC<LandingViewProps> = ({ onStartLearning, initialGoal }) => {
  const [goalText, setGoalText] = useState(
    initialGoal?.goalText || 'I want to learn how to build an AI chatbot and integrate it into my existing application or platform.'
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(initialGoal?.skillLevel || 'intermediate');
  const [selectedTech, setSelectedTech] = useState<TechExperience[]>(
    initialGoal?.techExperience || ['JavaScript / TypeScript', 'React / Frontend', 'Node.js / Backend']
  );

  const toggleTech = (tech: TechExperience) => {
    if (tech === 'No coding experience') {
      setSelectedTech(['No coding experience']);
      return;
    }

    let updated = selectedTech.filter(t => t !== 'No coding experience');
    if (updated.includes(tech)) {
      updated = updated.filter(t => t !== tech);
    } else {
      updated.push(tech);
    }
    setSelectedTech(updated);
  };

  // Preview generated curriculum in real-time
  const previewCurriculum = useMemo(() => {
    if (!goalText.trim()) return null;
    const tempGoal: UserGoal = {
      goalText,
      skillLevel,
      techExperience: selectedTech,
      primaryFocus: 'general',
      createdAt: new Date().toISOString()
    };
    return generateCurriculum(tempGoal);
  }, [goalText, skillLevel, selectedTech]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;

    let primaryFocus: UserGoal['primaryFocus'] = 'chatbot';
    const textLower = goalText.toLowerCase();
    if (textLower.includes('agent') || textLower.includes('tool')) primaryFocus = 'agent';
    else if (textLower.includes('rag') || textLower.includes('vector') || textLower.includes('knowledge')) primaryFocus = 'rag';
    else if (textLower.includes('integrate') || textLower.includes('api') || textLower.includes('app')) primaryFocus = 'fullstack';

    const goal: UserGoal = {
      goalText: goalText.trim(),
      skillLevel,
      techExperience: selectedTech,
      primaryFocus,
      createdAt: new Date().toISOString()
    };

    onStartLearning(goal);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Main Title & Hero Banner */}
        <div className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Curriculum Generator
          </div>
          
          <h1 className="text-4xl sm:text-[64px] font-black tracking-tighter leading-[0.92] uppercase text-white">
            MASTER AI <span className="text-indigo-500">SYSTEMS & AGENTS</span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Learn the core theory, inspect high-dimensional visual flows, simulate live code pipelines, and build production AI architectures.
          </p>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-8" id="goal-assessment-form">
          
          {/* Section 1: User Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="goal-input" className="block text-sm font-black uppercase tracking-wider text-white">
                01. What do you want to build or learn?
              </label>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Input Vector</span>
            </div>
            <p className="text-xs text-slate-400">
              Describe your target AI use-case, application architecture, or domain requirement.
            </p>
            
            <textarea
              id="goal-input"
              rows={3}
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. I want to learn how to build an AI chatbot and integrate it into my existing application or platform."
              className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder:text-slate-500 bg-[#020617] transition-all font-mono"
              required
            />

            {/* Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 block">
                Quick Preset Targets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_GOALS.map((preset, idx) => {
                  const Icon = preset.icon;
                  const isSelected = goalText === preset.prompt;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGoalText(preset.prompt);
                        setSkillLevel(preset.recommendedLevel);
                      }}
                      className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 text-white font-bold border-l-4 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                          : 'border-white/10 hover:border-white/20 bg-slate-900/60 text-slate-300'
                      }`}
                      id={`preset-btn-${idx}`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate font-semibold">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Skill Level Assessment */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-black uppercase tracking-wider text-white">
                02. Select your AI engineering tier
              </label>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Calibration</span>
            </div>
            <p className="text-xs text-slate-400">
              Calibrates architectural depth, math complexity, and code abstractions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SKILL_LEVELS.map((level) => {
                const isSelected = skillLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSkillLevel(level.id)}
                    className={`text-left p-4 rounded-xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 border-l-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'border-white/10 hover:border-white/20 bg-slate-900/60'
                    }`}
                    id={`skill-level-${level.id}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-white text-sm uppercase tracking-wide">{level.title}</span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {level.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {level.desc}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Technical Background / Tech Stack */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-black uppercase tracking-wider text-white">
                03. Technology stack & tools
              </label>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Stack</span>
            </div>
            <p className="text-xs text-slate-400">
              Tailors interactive code simulators to your development environment.
            </p>

            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((tech) => {
                const isSelected = selectedTech.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:border-white/20'
                    }`}
                    id={`tech-chip-${tech.replace(/[^a-zA-Z0-9]/g, '')}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview of Generated Roadmap */}
          {previewCurriculum && (
            <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.15em] text-indigo-400">
                      Curriculum Synthesis Preview
                    </h4>
                    <p className="text-xs text-slate-300 font-bold">
                      {previewCurriculum.learningPathTitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-black text-[10px] uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/40">
                    {previewCurriculum.modules.length} Modules
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    ~{previewCurriculum.estimatedTotalHours} hours
                  </span>
                </div>
              </div>

              {/* Module List Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {previewCurriculum.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 text-xs flex items-center gap-2.5"
                  >
                    <span className="w-5 h-5 rounded bg-white/10 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="truncate font-semibold text-slate-200">
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-xl bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group cursor-pointer"
              id="create-learning-path-submit"
            >
              <span>Initialize Learning Architecture</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Feature summary points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-center">
          <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Theory</span>
              <span className="text-sm">💡</span>
            </div>
            <h3 className="font-black text-white text-sm uppercase tracking-wide">Deep Mental Models</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foundations for NLP, Vector Math, Cosine Distance, Hybrid Search, and ReAct Agents.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Simulation</span>
              <Code2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-black text-white text-sm uppercase tracking-wide">Interactive Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live code snippets, parameter tuning, token counters, and execution sandbox logs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Mastery</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-black text-white text-sm uppercase tracking-wide">Knowledge Quizzes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified assessments with immediate answer reasoning, XP unlocks, and progress saves.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
