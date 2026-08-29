import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, AlertCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizSectionProps {
  questions: QuizQuestion[];
  selectedAnswers: number[]; // user selected answer index for each question
  onSelectAnswer: (questionIdx: number, optionIdx: number) => void;
  isPassed: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  selectedAnswers,
  onSelectAnswer,
  isPassed,
}) => {
  const answeredCount = selectedAnswers.filter(a => a !== undefined && a !== -1).length;

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl" id="module-quiz-section">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              Knowledge Verification Check
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Validate your architectural comprehension before advancing to the next module.
            </p>
          </div>
        </div>

        {isPassed ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Passed (+50 XP)</span>
          </div>
        ) : (
          <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest bg-[#020617] px-3 py-1.5 rounded-lg border border-white/10">
            {answeredCount} of {questions.length} Completed
          </span>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const hasAnswered = userChoice !== undefined && userChoice !== -1;
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-6 rounded-xl bg-[#020617] border border-white/10 space-y-4 shadow-inner"
              id={`quiz-question-${q.id}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{qIdx + 1}
                </span>
                <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5 sm:pl-9">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = userChoice === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let buttonStyles = 'border-white/10 bg-[#0F172A] text-slate-200 hover:border-white/20 hover:bg-white/5';
                  if (hasAnswered) {
                    if (isThisCorrect) {
                      buttonStyles = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]';
                    } else if (isThisSelected && !isCorrect) {
                      buttonStyles = 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold';
                    } else {
                      buttonStyles = 'border-white/5 bg-[#0F172A]/40 text-slate-500 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => onSelectAnswer(qIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${buttonStyles}`}
                      id={`quiz-opt-${q.id}-${optIdx}`}
                    >
                      <span className="leading-relaxed font-medium">{opt}</span>
                      {hasAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box upon answering */}
              {hasAnswered && (
                <div className={`p-4 rounded-xl text-xs space-y-1.5 sm:ml-9 border ${
                  isCorrect 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                }`}>
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Correctly Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">Conceptual Clarification</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed pt-0.5 font-medium">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
