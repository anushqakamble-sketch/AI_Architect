import React from 'react';
import { Sparkles, Compass, RotateCcw, Award, CheckCircle2, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { UserProgress, LearningModule } from '../types';

interface HeaderProps {
  progress: UserProgress;
  activeCurriculum: LearningModule[];
  currentView: 'roadmap' | 'module';
  onNavigateRoadmap: () => void;
  onResetGoal: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeCurriculum,
  currentView,
  onNavigateRoadmap,
  onResetGoal,
  user,
  onOpenAuth,
  onSignOut,
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
        {user && progress.userGoal && (
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

        {/* Right side stats & Authentication Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && progress.userGoal && (
            <>
              {/* Progress summary pill */}
              <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{completedCount}/{totalModules} DONE</span>
                </div>
                <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                title="Change your learning goal or skill assessment"
                id="reset-goal-button"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Goal</span>
              </button>
            </>
          )}

          {/* Authentication State Controls */}
          {user ? (
            /* Logged-in user area */
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-200"
                id="authenticated-user-pill"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-inner">
                  {user.email ? user.email.slice(0, 1).toUpperCase() : <UserIcon className="w-3 h-3" />}
                </div>
                <span className="max-w-[130px] truncate text-[11px] font-mono text-slate-300 hidden sm:inline">
                  {user.email}
                </span>
              </div>

              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                id="sign-out-btn"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated user: EXACTLY "Sign In / Sign Up" */
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600/90 hover:bg-indigo-500 text-white border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
              id="header-auth-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
