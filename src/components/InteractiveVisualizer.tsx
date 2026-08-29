import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Bot, 
  FileText, 
  Search, 
  Layers, 
  Cpu, 
  Terminal, 
  Sparkles,
  RefreshCw,
  Zap,
  Sliders
} from 'lucide-react';
import { VisualType, FlowStep } from '../types';

interface InteractiveVisualizerProps {
  visualType: VisualType;
  diagramTitle: string;
  steps: FlowStep[];
  pipelineDescription: string;
}

export const InteractiveVisualizer: React.FC<InteractiveVisualizerProps> = ({
  visualType,
  diagramTitle,
  steps,
  pipelineDescription,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Specific state for Tokenizer interactive widget
  const [tokenizerText, setTokenizerText] = useState('Retrieval Augmented Generation with AI Agents');
  
  // Specific state for Hybrid Search interactive widget
  const [alphaWeight, setAlphaWeight] = useState(0.6); // 0 = BM25, 1 = Dense Vector

  // Specific state for RAG interactive search
  const [ragQuery, setRagQuery] = useState('What is the return policy for electronics?');

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="bg-[#0F172A] text-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10">
      
      {/* Header with macOS Terminal Dots */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="px-2.5 py-0.5 rounded bg-white text-black text-[10px] font-black uppercase tracking-tighter">
              Visual Architecture
            </span>
            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest">
              Stage 0{activeStepIndex + 1} / 0{steps.length}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            {diagramTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-md hidden sm:block font-medium">
          {pipelineDescription}
        </p>
      </div>

      {/* Stepper Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5" id="visualizer-step-pills">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3.5 rounded-xl text-left border transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/20 border-indigo-500 border-l-4 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : isPassed
                  ? 'bg-[#020617] border-white/10 text-slate-300 hover:border-white/20'
                  : 'bg-[#020617]/50 border-white/5 text-slate-500 hover:text-slate-300'
              }`}
              id={`step-pill-${idx}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-black text-indigo-400">
                  0{idx + 1}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.9)]' : 'bg-slate-700'}`} />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-tight truncate">
                {step.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Step Detail Card */}
      <div className="bg-[#020617] border border-white/10 rounded-xl p-6 space-y-4 shadow-inner">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">
              Execution Stage: 0{activeStepIndex + 1}
            </span>
            <h4 className="text-lg font-black uppercase tracking-tight text-white mt-0.5">
              {currentStep.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-medium">
              {currentStep.desc}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              disabled={activeStepIndex === 0}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-[10px] font-black uppercase tracking-wider text-slate-300 transition-colors border border-white/10 cursor-pointer"
              id="prev-step-btn"
            >
              Prev
            </button>
            <button
              onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-[10px] font-black uppercase tracking-widest text-white transition-colors flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              id="next-step-btn"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Input/Output Sample Preview Box */}
        {(currentStep.inputSample || currentStep.outputSample) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {currentStep.inputSample && (
              <div className="p-4 rounded-xl bg-[#0F172A] border border-white/10">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-black tracking-wider block mb-1.5">
                  📥 Input / Payload:
                </span>
                <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all bg-[#020617] p-3 rounded-lg border border-white/5">
                  {currentStep.inputSample}
                </pre>
              </div>
            )}
            {currentStep.outputSample && (
              <div className="p-4 rounded-xl bg-[#0F172A] border border-white/10">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-black tracking-wider block mb-1.5">
                  📤 Output / Transformation:
                </span>
                <pre className="text-xs font-mono text-indigo-300 whitespace-pre-wrap break-all bg-[#020617] p-3 rounded-lg border border-white/5">
                  {currentStep.outputSample}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Micro-Widget based on visualType */}
      {visualType === 'token-embed' && (
        <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Interactive Token Sub-Word Sandbox
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">
              Tokens: ~{Math.ceil(tokenizerText.length / 4)} | Characters: {tokenizerText.length}
            </span>
          </div>

          <input
            type="text"
            value={tokenizerText}
            onChange={(e) => setTokenizerText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0F172A] border border-white/10 text-xs text-slate-100 focus:border-indigo-500 font-mono"
            placeholder="Type any sentence to see sub-word tokens..."
          />

          {/* Color-coded token breakdown visualizer */}
          <div className="flex flex-wrap gap-2 pt-1">
            {tokenizerText.split(/(\s+|[.,!?;:])/).filter(Boolean).map((chunk, idx) => {
              const colors = [
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                'bg-amber-500/20 text-amber-300 border-amber-500/40',
                'bg-purple-500/20 text-purple-300 border-purple-500/40',
                'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              ];
              const colorClass = colors[idx % colors.length];
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono border ${colorClass} transition-all font-semibold`}
                  title={`Token #${idx + 1}`}
                >
                  {chunk === ' ' ? '␣' : chunk}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {visualType === 'hybrid-search' && (
        <div className="p-5 rounded-xl bg-[#020617] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Hybrid Search Weight Balancer (BM25 vs Vector)
            </span>
            <span className="text-xs font-mono text-indigo-400">
              Alpha: {alphaWeight.toFixed(2)} ({Math.round(alphaWeight * 100)}% Dense / {Math.round((1 - alphaWeight) * 100)}% Sparse)
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={alphaWeight}
            onChange={(e) => setAlphaWeight(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-3 rounded-lg bg-[#0F172A] border border-white/10">
              <span className="text-slate-400 text-[10px] font-black uppercase block mb-1">Keyword Match (BM25):</span>
              <span className="text-emerald-400 font-bold">ERR_4091 Gateway</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Weight: {((1 - alphaWeight) * 100).toFixed(0)}%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0F172A] border border-white/10">
              <span className="text-slate-400 text-[10px] font-black uppercase block mb-1">Semantic Vector (Cosine):</span>
              <span className="text-indigo-400 font-bold">Network timeout recovery</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Weight: {(alphaWeight * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
