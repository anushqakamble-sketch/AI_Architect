import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Award, 
  Layers, 
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Target
} from 'lucide-react';
import { LearningModule, UserProgress, UserGoal } from '../types';

interface RoadmapViewProps {
  goal: UserGoal;
  curriculum: LearningModule[];
  progress: UserProgress;
  onSelectModule: (moduleId: string) => void;
  onResetGoal: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  goal,
  curriculum,
  progress,
  onSelectModule,
  onResetGoal,
}) => {
  const completedCount = progress.completedModuleIds.length;
  const totalModules = curriculum.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Find the next incomplete module
  const currentModule = curriculum.find(m => !progress.completedModuleIds.includes(m.id)) || curriculum[0];

  const totalMinutes = curriculum.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Roadmap Banner Card */}
        <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Synthesis Roadmap
                </span>
                <span className="px-2.5 py-1 rounded bg-white/10 text-slate-300 font-black uppercase text-[10px] tracking-wider">
                  Level: {goal.skillLevel}
                </span>
                {goal.techExperience.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 text-[10px] font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.95] text-white">
                AGENT ARCHITECTURE <span className="text-indigo-500">ROADMAP</span>
              </h1>
              
              <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 block mb-1">Target Trajectory:</span>
                <p className="text-xs sm:text-sm text-slate-300 italic font-medium leading-relaxed">
                  "{goal.goalText}"
                </p>
              </div>
            </div>

            <button
              onClick={onResetGoal}
              className="text-[10px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              id="change-curriculum-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Goal</span>
            </button>
          </div>

          {/* Progress Overview Bar */}
          <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-300">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <GraduationCap className="w-4 h-4" />
                Curriculum Progression
              </span>
              <span className="text-xl font-black text-white">{completedCount} of {totalModules} Completed ({progressPercent}%)</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(99,102,241,0.7)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>{totalModules} Specialized Modules</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Est. Duration: ~{totalHours} hours
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Total XP: {progress.xp}
              </span>
            </div>
          </div>

          {/* Resume learning CTA */}
          {currentModule && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block mb-0.5">
                  {completedCount === totalModules ? 'Curriculum Complete — Review Pipeline' : 'Active Learning Node:'}
                </span>
                <span className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  0{currentModule.moduleNumber}. {currentModule.title}
                </span>
              </div>

              <button
                onClick={() => onSelectModule(currentModule.id)}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-black text-xs font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                id="resume-learning-btn"
              >
                <span>{completedCount === totalModules ? 'Review Module' : 'Resume Module →'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modules Timeline / Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
              Module Sequence ({totalModules})
            </h2>
            <span className="text-[10px] font-mono uppercase text-slate-500">
              Select node to enter workspace
            </span>
          </div>

          <div className="space-y-3" id="roadmap-modules-list">
            {curriculum.map((mod, index) => {
              const isCompleted = progress.completedModuleIds.includes(mod.id);
              const isCurrent = currentModule?.id === mod.id;
              const isPassed = progress.quizPassed[mod.id];

              return (
                <div
                  key={mod.id}
                  onClick={() => onSelectModule(mod.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group relative ${
                    isCompleted
                      ? 'bg-[#0B1120] border-emerald-500/30 border-l-4 border-l-emerald-500 hover:border-emerald-500/60'
                      : isCurrent
                      ? 'bg-[#0B1120] border-indigo-500 border-l-4 border-l-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30'
                      : 'bg-[#0B1120]/80 border-white/10 hover:border-white/20 border-l-2 border-l-white/10 hover:bg-[#0B1120]'
                  }`}
                  id={`module-card-${mod.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Left: Number badge + Text */}
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                          : 'bg-white/5 text-slate-400 border border-white/10 group-hover:text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-black text-[10px] uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {mod.category}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {mod.estimatedMinutes}m
                          </span>
                          <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                            {mod.difficulty}
                          </span>
                          {isPassed && (
                            <span className="text-emerald-400 font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded text-[9px] border border-emerald-500/20">
                              Quiz Passed
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                          {mod.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-normal">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action pill */}
                    <div className="shrink-0 pt-1">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Completed</span>
                        </div>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-4 py-2 rounded-lg shadow-[0_0_12px_rgba(99,102,241,0.5)] group-hover:bg-indigo-500 transition-colors">
                          <span>Enter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group-hover:text-white group-hover:border-white/20 transition-colors">
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
