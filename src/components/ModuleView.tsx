import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Award,
  Layers,
  Code2,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { LearningModule, UserProgress } from '../types';
import { InteractiveVisualizer } from './InteractiveVisualizer';
import { CodePlayground } from './CodePlayground';
import { QuizSection } from './QuizSection';

interface ModuleViewProps {
  module: LearningModule;
  curriculum: LearningModule[];
  progress: UserProgress;
  onNavigateModule: (moduleId: string) => void;
  onBackToRoadmap: () => void;
  onCompleteModule: (moduleId: string) => void;
  onAnswerQuiz: (moduleId: string, questionIdx: number, optionIdx: number) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  module,
  curriculum,
  progress,
  onNavigateModule,
  onBackToRoadmap,
  onCompleteModule,
  onAnswerQuiz,
}) => {
  const currentIndex = curriculum.findIndex(m => m.id === module.id);
  const prevModule = currentIndex > 0 ? curriculum[currentIndex - 1] : null;
  const nextModule = currentIndex < curriculum.length - 1 ? curriculum[currentIndex + 1] : null;

  const isCompleted = progress.completedModuleIds.includes(module.id);
  const quizAnswers = progress.quizAnswers[module.id] || [];
  const isQuizPassed = progress.quizPassed[module.id] || false;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleComplete = () => {
    if (!isCompleted) {
      triggerConfetti();
      onCompleteModule(module.id);
    }
  };

  // Scroll to top when module changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [module.id]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header Bar */}
        <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={onBackToRoadmap}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              id="back-to-roadmap-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Roadmap</span>
            </button>

            {/* Prev / Next shortcuts */}
            <div className="flex items-center gap-2">
              {prevModule && (
                <button
                  onClick={() => onNavigateModule(prevModule.id)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  title={`Previous: ${prevModule.title}`}
                  id="prev-module-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
              )}
              {nextModule && (
                <button
                  onClick={() => onNavigateModule(nextModule.id)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  title={`Next: ${nextModule.title}`}
                  id="next-module-btn"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Module Title & Badges */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-tighter">
                Module {module.moduleNumber < 10 ? `0${module.moduleNumber}` : module.moduleNumber} / {curriculum.length < 10 ? `0${curriculum.length}` : curriculum.length}
              </span>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-black uppercase text-[10px] tracking-wider border border-indigo-500/30">
                {module.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 text-slate-400 font-mono text-[10px] flex items-center gap-1 border border-white/5">
                <Clock className="w-3 h-3 text-slate-500" />
                {module.estimatedMinutes}m
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-black uppercase text-[10px]">
                {module.difficulty}
              </span>
              {isCompleted && (
                <span className="px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Completed
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              {module.title}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
              {module.subtitle}
            </p>
          </div>
        </div>

        {/* SECTION 1: Concept & Theory */}
        <section className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl" id="section-concept">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block">Section 01</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Core Concept & Theory</h2>
            </div>
          </div>

          <div className="p-5 rounded-r-xl bg-indigo-500/10 border-l-4 border-indigo-500 text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            {module.concept.summary}
          </div>

          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
            <p>{module.concept.coreExplanation}</p>
          </div>

          {/* Key Takeaway Bullet points */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Architectural Principles:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {module.concept.keyPoints.map((point, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#020617] border border-white/10 text-xs text-slate-300 flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5 border border-indigo-500/30">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Terms Glossary */}
          {module.concept.keyTerms.length > 0 && (
            <div className="pt-3 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Domain Terminology:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {module.concept.keyTerms.map((term, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#020617] border border-white/10 text-xs space-y-1.5">
                    <span className="font-black text-indigo-400 font-mono text-xs block uppercase tracking-wide">{term.term}</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: How It Works (Visual Flow & Stepper) */}
        <section className="space-y-3" id="section-how-it-works">
          <div className="flex items-center gap-2.5 px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Section 02</span>
            <span className="text-slate-600">/</span>
            <h2 className="text-base font-black uppercase tracking-tight text-white">Interactive Visual Architecture</h2>
          </div>
          
          <InteractiveVisualizer
            visualType={module.howItWorks.visualType}
            diagramTitle={module.howItWorks.diagramTitle}
            steps={module.howItWorks.steps}
            pipelineDescription={module.howItWorks.pipelineDescription}
          />
        </section>

        {/* SECTION 3: Why It Matters & Business Value */}
        <section className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl" id="section-why-it-matters">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 block">Section 03</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Production & Business Value</h2>
            </div>
          </div>

          <div className="p-5 rounded-r-xl bg-emerald-500/10 border-l-4 border-emerald-500 text-slate-200 text-sm leading-relaxed">
            <span className="font-black text-emerald-400 uppercase tracking-wider text-xs block mb-1">Production Impact:</span>
            {module.whyItMatters.businessValue}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Technical Benefits */}
            <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-3">
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                Technical Advantages:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {module.whyItMatters.technicalBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">→</span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Pitfalls */}
            <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Anti-Patterns & Pitfalls:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {module.whyItMatters.commonPitfalls.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: Real-World Example */}
        <section className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl" id="section-example">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 block">Section 04</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Live Execution Scenario</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#020617] border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Context & Goal:</span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">{module.example.scenario}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#0F172A] border border-white/10 text-slate-200 space-y-1.5 font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block">Input Payload:</span>
                <p className="text-indigo-300">{module.example.userQuery}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0F172A] border border-emerald-500/30 text-indigo-100 space-y-1.5 font-mono text-xs">
                <span className="text-emerald-400 text-[10px] uppercase font-black tracking-widest block">Output State:</span>
                <p className="text-emerald-300">{module.example.finalOutput}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2.5 font-medium">
              <span className="font-black uppercase tracking-wider text-indigo-300">Takeaway:</span>
              <span>{module.example.takeaway}</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Code Snippet & Simulator */}
        <section className="space-y-3" id="section-code">
          <div className="flex items-center gap-2.5 px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Section 05</span>
            <span className="text-slate-600">/</span>
            <h2 className="text-base font-black uppercase tracking-tight text-white">Code Simulator & Live Engine</h2>
          </div>

          <CodePlayground
            primarySnippet={module.code.primarySnippet}
            alternativeSnippets={module.code.alternativeSnippets}
            explanation={module.code.explanation}
            playgroundConfig={module.code.playgroundConfig}
          />
        </section>

        {/* SECTION 6: Knowledge Check Quiz */}
        <section id="section-quiz">
          <QuizSection
            questions={module.knowledgeCheck.questions}
            selectedAnswers={quizAnswers}
            onSelectAnswer={(qIdx, optIdx) => onAnswerQuiz(module.id, qIdx, optIdx)}
            isPassed={isQuizPassed}
          />
        </section>

        {/* SECTION 7: External Resources / Learn More */}
        <section className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl" id="section-resources">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block">Section 07</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Curated Research & Documentation</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {module.resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-xl bg-[#020617] border border-white/10 hover:border-indigo-500 hover:bg-slate-900 transition-all group block space-y-2 cursor-pointer"
                id={`resource-link-${idx}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {res.type}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                  {res.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom Action / Completion Bar */}
        <div className="bg-[#0B1120] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-black text-base uppercase tracking-tight">
                {isCompleted ? 'Module Synthesized & Complete!' : 'Module Progression Protocol'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {isCompleted
                ? 'Excellent work. You have mastered this architectural domain and earned +50 XP.'
                : isQuizPassed
                ? 'Knowledge check validated. Click below to record module completion.'
                : 'Pass the Knowledge Check in Section 06 to unlock module completion.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted ? (
              <button
                onClick={handleComplete}
                disabled={!isQuizPassed}
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-black font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                id="complete-module-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Complete (+50 XP)</span>
              </button>
            ) : nextModule ? (
              <button
                onClick={() => onNavigateModule(nextModule.id)}
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                id="next-module-bottom-btn"
              >
                <span>Continue to Next Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onBackToRoadmap}
                className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                id="finish-roadmap-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Roadmap Finished! View Matrix</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
