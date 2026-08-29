import React from 'react';
import { Sparkles, BookOpen, Compass, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { UserProgress, LearningModule } from '../types';

interface HeaderProps {
  progress: UserProgress;
  activeCurriculum: LearningModule[];
  currentView: 'roadmap' | 'module';
  onNavigateRoadmap: () => void;
  onResetGoal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeCurriculum,
  currentView,
  onNavigateRoadmap,
  onResetGoal,
}) => {
  const totalModules = activeCurriculum.length;
  const completedCount = progress.completedModuleIds.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateRoadmap}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            id="brand-home-button"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xs text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block">
                Curriculum
              </span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase leading-none">
                AI ARCHITECT
              </span>
            </div>
          </button>
        </div>

        {/* Center / Navigation items */}
        {progress.userGoal && (
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onNavigateRoadmap}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'roadmap'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              id="nav-roadmap-btn"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Roadmap Overview
            </button>
          </div>
        )}

        {/* Right side stats & action */}
        {progress.userGoal ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Progress summary pill */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedCount}/{totalModules} DONE</span>
              </div>
              <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.7)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-indigo-400">{progressPercent}%</span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Edit / Reset goal */}
            <button
              onClick={onResetGoal}
              className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
              title="Change your learning goal or skill assessment"
              id="reset-goal-button"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Change Goal</span>
            </button>
          </div>
        ) : (
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Curriculum Engine</span>
          </div>
        )}
      </div>
    </header>
  );
};
