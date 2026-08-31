import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { UserGoal, UserProgress, LearningModule } from './types';
import { generateCurriculum } from './data/curriculumGenerator';
import { ALL_LEARNING_MODULES } from './data/modules';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { RoadmapView } from './components/RoadmapView';
import { ModuleView } from './components/ModuleView';
import { AuthModal } from './components/AuthModal';
import { getSupabase } from './lib/supabase';

const DEFAULT_INITIAL_GOAL: UserGoal = {
  goalText: 'I want to learn how to build an AI chatbot and integrate it into my existing application or platform.',
  skillLevel: 'intermediate',
  techExperience: ['JavaScript / TypeScript', 'React / Frontend', 'Node.js / Backend'],
  primaryFocus: 'chatbot',
  createdAt: new Date().toISOString()
};

const createInitialProgress = (): UserProgress => ({
  completedModuleIds: [],
  quizAnswers: {},
  quizPassed: {},
  currentModuleId: 'ai-foundations',
  xp: 0,
  startedAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  userGoal: null,
  curriculumModuleIds: []
});

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'roadmap' | 'module'>('roadmap');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Pending actions to continue automatically after authentication
  const [pendingAction, setPendingAction] = useState<'start_course' | null>(null);
  const [pendingGoal, setPendingGoal] = useState<UserGoal | null>(null);
  const [authCustomMessage, setAuthCustomMessage] = useState<string | null>(null);

  // Active in-memory user progress
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress);

  // Supabase Auth session initialization and listener
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    // 1. Check existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        try {
          const userStorageKey = `ai_learning_guide_progress_${currentUser.id}`;
          const saved = localStorage.getItem(userStorageKey);
          if (saved) {
            setProgress(JSON.parse(saved));
          }
        } catch (e) {
          console.error('Error loading stored progress for user:', e);
        }
      }
      setAuthLoading(false);
    }).catch((err) => {
      console.error('Error retrieving Supabase session:', err);
      setAuthLoading(false);
    });

    // 2. Subscribe to auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_OUT' || !currentUser) {
        // Clear active in-memory state on sign out without deleting localStorage
        setProgress(createInitialProgress());
        setCurrentView('roadmap');
        setIsEditingGoal(false);
        setPendingAction(null);
        setPendingGoal(null);
      } else if (currentUser && event === 'SIGNED_IN') {
        try {
          const userStorageKey = `ai_learning_guide_progress_${currentUser.id}`;
          const saved = localStorage.getItem(userStorageKey);
          if (saved) {
            setProgress(JSON.parse(saved));
          }
        } catch (e) {
          console.error('Error restoring user progress:', e);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Persist progress to isolated user key whenever progress or user changes
  useEffect(() => {
    if (user && progress.userGoal) {
      try {
        const userStorageKey = `ai_learning_guide_progress_${user.id}`;
        localStorage.setItem(userStorageKey, JSON.stringify(progress));
      } catch (e) {
        console.error('Error saving user progress to localStorage:', e);
      }
    }
  }, [progress, user]);

  // Derive active curriculum modules from userGoal
  const activeCurriculum: LearningModule[] = useMemo(() => {
    if (!progress.userGoal) {
      return ALL_LEARNING_MODULES;
    }
    const result = generateCurriculum(progress.userGoal);
    return result.modules;
  }, [progress.userGoal]);

  // Find active learning module
  const activeModule = useMemo(() => {
    return activeCurriculum.find(m => m.id === progress.currentModuleId) || activeCurriculum[0] || ALL_LEARNING_MODULES[0];
  }, [activeCurriculum, progress.currentModuleId]);

  // Handle Start / Generate Curriculum action from LandingView
  const handleStartLearning = (goal: UserGoal) => {
    // If visitor is NOT authenticated:
    if (!user) {
      // 1. Preserve entered learning goal in state
      setPendingGoal(goal);
      // 2. Set pending action
      setPendingAction('start_course');
      // 3. Set friendly guidance message
      setAuthCustomMessage('Create an account or sign in to begin your personalized learning journey and save your progress.');
      // 4. Open Auth Modal
      setIsAuthModalOpen(true);
      return;
    }

    // If user IS authenticated:
    const generated = generateCurriculum(goal);
    const firstModuleId = generated.modules[0]?.id || 'ai-foundations';

    const updatedProgress: UserProgress = {
      ...progress,
      userGoal: goal,
      curriculumModuleIds: generated.modules.map(m => m.id),
      currentModuleId: firstModuleId,
      lastActive: new Date().toISOString()
    };

    setProgress(updatedProgress);
    setIsEditingGoal(false);
    setCurrentView('roadmap');

    try {
      localStorage.setItem(`ai_learning_guide_progress_${user.id}`, JSON.stringify(updatedProgress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  // Called when user completes Sign In or Sign Up inside AuthModal
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);

    // Check if there was a pending learning action to continue
    if (pendingAction === 'start_course' && pendingGoal) {
      const goalToUse = pendingGoal;
      const generated = generateCurriculum(goalToUse);
      const firstModuleId = generated.modules[0]?.id || 'ai-foundations';

      // Check if user already had previous progress or start fresh
      let existingSavedProg: UserProgress = createInitialProgress();
      try {
        const saved = localStorage.getItem(`ai_learning_guide_progress_${authenticatedUser.id}`);
        if (saved) {
          existingSavedProg = JSON.parse(saved);
        }
      } catch (e) {}

      const newProgress: UserProgress = {
        ...existingSavedProg,
        userGoal: goalToUse,
        curriculumModuleIds: generated.modules.map(m => m.id),
        currentModuleId: firstModuleId,
        lastActive: new Date().toISOString()
      };

      setProgress(newProgress);
      setIsEditingGoal(false);
      setCurrentView('roadmap');

      try {
        localStorage.setItem(`ai_learning_guide_progress_${authenticatedUser.id}`, JSON.stringify(newProgress));
      } catch (e) {
        console.error('Error saving progress for new user:', e);
      }

      // Clear pending state
      setPendingAction(null);
      setPendingGoal(null);
      setAuthCustomMessage(null);
    } else {
      // User signed in directly via header
      try {
        const saved = localStorage.getItem(`ai_learning_guide_progress_${authenticatedUser.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProgress(parsed);
          if (parsed.userGoal) {
            setIsEditingGoal(false);
            setCurrentView('roadmap');
          }
        }
      } catch (e) {
        console.error('Error restoring progress:', e);
      }
    }
  };

  // Sign out user
  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    setUser(null);
    setProgress(createInitialProgress());
    setCurrentView('roadmap');
    setIsEditingGoal(false);
  };

  const handleSelectModule = (moduleId: string) => {
    setProgress(prev => ({
      ...prev,
      currentModuleId: moduleId,
      lastActive: new Date().toISOString()
    }));
    setCurrentView('module');
  };

  const handleCompleteModule = (moduleId: string) => {
    if (!user) return; // Protected action
    setProgress(prev => {
      const alreadyDone = prev.completedModuleIds.includes(moduleId);
      if (alreadyDone) return prev;

      return {
        ...prev,
        completedModuleIds: [...prev.completedModuleIds, moduleId],
        xp: prev.xp + 50,
        lastActive: new Date().toISOString()
      };
    });
  };

  const handleAnswerQuiz = (moduleId: string, questionIdx: number, optionIdx: number) => {
    if (!user) return; // Protected action
    const targetModule = ALL_LEARNING_MODULES.find(m => m.id === moduleId);
    if (!targetModule) return;

    setProgress(prev => {
      const currentAnswers = [...(prev.quizAnswers[moduleId] || [])];
      currentAnswers[questionIdx] = optionIdx;

      // Check if all questions are answered and correct
      const questions = targetModule.knowledgeCheck.questions;
      let allCorrect = true;
      for (let i = 0; i < questions.length; i++) {
        if (currentAnswers[i] !== questions[i].correctIndex) {
          allCorrect = false;
          break;
        }
      }

      const updatedQuizPassed = {
        ...prev.quizPassed,
        [moduleId]: allCorrect
      };

      return {
        ...prev,
        quizAnswers: {
          ...prev.quizAnswers,
          [moduleId]: currentAnswers
        },
        quizPassed: updatedQuizPassed
      };
    });
  };

  const handleResetGoal = () => {
    setIsEditingGoal(true);
  };

  const handleOpenAuthModal = () => {
    setAuthCustomMessage(null);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header with authentic design and user auth area */}
      <Header
        progress={progress}
        activeCurriculum={activeCurriculum}
        currentView={currentView}
        onNavigateRoadmap={() => {
          if (user && progress.userGoal) {
            setIsEditingGoal(false);
            setCurrentView('roadmap');
          }
        }}
        onResetGoal={handleResetGoal}
        user={user}
        onOpenAuth={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/*
          Protected Content Rule:
          - If unauthenticated OR user has not generated a goal yet OR is editing goal -> Show LandingView
          - If authenticated AND has active userGoal -> Show RoadmapView or ModuleView
        */}
        {!user || !progress.userGoal || isEditingGoal ? (
          <LandingView
            onStartLearning={handleStartLearning}
            initialGoal={pendingGoal || progress.userGoal || DEFAULT_INITIAL_GOAL}
          />
        ) : currentView === 'roadmap' ? (
          <RoadmapView
            goal={progress.userGoal}
            curriculum={activeCurriculum}
            progress={progress}
            onSelectModule={handleSelectModule}
            onResetGoal={handleResetGoal}
          />
        ) : (
          <ModuleView
            module={activeModule}
            curriculum={activeCurriculum}
            progress={progress}
            onNavigateModule={handleSelectModule}
            onBackToRoadmap={() => setCurrentView('roadmap')}
            onCompleteModule={handleCompleteModule}
            onAnswerQuiz={handleAnswerQuiz}
          />
        )}
      </main>

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthCustomMessage(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        customMessage={authCustomMessage}
      />
    </div>
  );
}
