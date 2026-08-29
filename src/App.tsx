import React, { useState, useEffect } from 'react';
import { UserGoal, UserProgress, LearningModule } from './types';
import { generateCurriculum } from './data/curriculumGenerator';
import { ALL_LEARNING_MODULES } from './data/modules';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { RoadmapView } from './components/RoadmapView';
import { ModuleView } from './components/ModuleView';

const STORAGE_KEY = 'ai_learning_guide_progress_v1';

const DEFAULT_INITIAL_GOAL: UserGoal = {
  goalText: 'I want to learn how to build an AI chatbot and integrate it into my existing application or platform.',
  skillLevel: 'intermediate',
  techExperience: ['JavaScript / TypeScript', 'React / Frontend', 'Node.js / Backend'],
  primaryFocus: 'chatbot',
  createdAt: new Date().toISOString()
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentView, setCurrentView] = useState<'roadmap' | 'module'>('roadmap');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Initialize progress from LocalStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage progress:', e);
    }
    return {
      completedModuleIds: [],
      quizAnswers: {},
      quizPassed: {},
      currentModuleId: 'ai-foundations',
      xp: 0,
      startedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      userGoal: null,
      curriculumModuleIds: []
    };
  });

  // Save to LocalStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving localStorage progress:', e);
    }
    setIsInitialized(true);
  }, [progress]);

  // Derive active curriculum modules from userGoal
  const activeCurriculum: LearningModule[] = React.useMemo(() => {
    if (!progress.userGoal) {
      return ALL_LEARNING_MODULES;
    }
    const result = generateCurriculum(progress.userGoal);
    return result.modules;
  }, [progress.userGoal]);

  // Find active learning module object
  const activeModule = React.useMemo(() => {
    return activeCurriculum.find(m => m.id === progress.currentModuleId) || activeCurriculum[0] || ALL_LEARNING_MODULES[0];
  }, [activeCurriculum, progress.currentModuleId]);

  const handleStartLearning = (goal: UserGoal) => {
    const generated = generateCurriculum(goal);
    const firstModuleId = generated.modules[0]?.id || 'ai-foundations';

    setProgress(prev => ({
      ...prev,
      userGoal: goal,
      curriculumModuleIds: generated.modules.map(m => m.id),
      currentModuleId: firstModuleId,
      lastActive: new Date().toISOString()
    }));

    setIsEditingGoal(false);
    setCurrentView('roadmap');
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

  // If no goal set yet or user requested editing goal -> show landing assessment
  if (!progress.userGoal || isEditingGoal) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          progress={progress}
          activeCurriculum={activeCurriculum}
          currentView={currentView}
          onNavigateRoadmap={() => {
            if (progress.userGoal) setIsEditingGoal(false);
          }}
          onResetGoal={handleResetGoal}
        />
        <LandingView
          onStartLearning={handleStartLearning}
          initialGoal={progress.userGoal || DEFAULT_INITIAL_GOAL}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        progress={progress}
        activeCurriculum={activeCurriculum}
        currentView={currentView}
        onNavigateRoadmap={() => setCurrentView('roadmap')}
        onResetGoal={handleResetGoal}
      />

      <main className="flex-1">
        {currentView === 'roadmap' ? (
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
    </div>
  );
}
