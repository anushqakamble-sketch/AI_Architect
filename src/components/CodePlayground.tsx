import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Sparkles, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { CodeTab, InteractivePlaygroundConfig } from '../types';

interface CodePlaygroundProps {
  primarySnippet: CodeTab;
  alternativeSnippets?: CodeTab[];
  explanation: string;
  playgroundConfig?: InteractivePlaygroundConfig;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  primarySnippet,
  alternativeSnippets = [],
  explanation,
  playgroundConfig,
}) => {
  const allTabs = [primarySnippet, ...alternativeSnippets];
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Playground input state
  const [params, setParams] = useState<Record<string, any>>(
    playgroundConfig?.defaultInputs || {}
  );
  const [isRunning, setIsRunning] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const activeSnippet = allTabs[activeTabIdx] || primarySnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const runSimulation = () => {
    setIsRunning(true);
    setSimulatedLogs([]);
    setSimulatedOutput(null);

    // Simulate realistic generation stream and logs
    setTimeout(() => {
      const logs: string[] = [];
      logs.push(`[Client] Initializing GoogleGenAI client (model: "${params.model || 'gemini-2.5-flash'}")`);
      
      if (params.temperature !== undefined) {
        logs.push(`[Config] Temperature set to ${params.temperature} | Response tokens calculated`);
      }

      if (params.context) {
        logs.push(`[RAG Retrieval] Injected ${params.context.length} chars of verified grounded context`);
      }

      if (params.selectedTool) {
        logs.push(`[Tool Declaration] Registered function schema: "${params.selectedTool}"`);
        logs.push(`[Agent Decision] Model generated tool call -> arguments verified`);
      }

      setSimulatedLogs(logs);

      // Generate output based on config type
      let responseText = '';
      if (playgroundConfig?.type === 'token-tester') {
        const text = params.prompt || 'Define AI';
        const tokenEst = Math.ceil(text.length / 4);
        responseText = `Simulated Analysis:\n• Input Prompt: "${text}"\n• Estimated Tokens: ${tokenEst} tokens\n• Model: ${params.model || 'gemini-2.5-flash'}\n• Temperature: ${params.temperature ?? 0.2}\n\nOutput:\n"Artificial intelligence represents computational systems designed to simulate human-like cognitive functions such as learning, pattern recognition, and problem-solving."`;
      } else if (playgroundConfig?.type === 'prompt-tester') {
        const temp = params.temperature ?? 0.2;
        responseText = `System Directive Applied: "${params.systemInstruction || 'Strict factual tone'}"\nTemperature: ${temp}\n\nGenerated Response:\n• Retrieval-Augmented Generation (RAG) decouples dynamic data retrieval from model weights, allowing real-time private document updates without expensive retraining.\n• Fine-tuning modifies neural weights directly and is best reserved for specialized syntax, tone, or style adaptation rather than continuous knowledge updates.`;
      } else if (playgroundConfig?.type === 'rag-simulator') {
        responseText = `[Vector Match Confirmed (Cosine Similarity: 0.94)]\nInjected Context: "${params.context || params.query}"\n\nAI Answer:\n"Based on the verified knowledge base: Acme Cloud v4.2 introduces Quantum Encryption with a 99.999% uptime guarantee as released in January 2026."\n\n[Grounding Check: 100% Faithful to Context]`;
      } else if (playgroundConfig?.type === 'agent-tool-caller') {
        responseText = `[Agent Reasoning Step]\nThought: The user requested an external data lookup for flight AA129.\nAction Call: ${params.selectedTool || 'lookupFlight'}({\n  flightNumber: "AA129",\n  date: "2026-08-30"\n})\n\n[Tool Output Received]\n{ status: "On Time", gate: "B14", departure: "10:45 AM" }\n\n[Final AI Response to User]\n"Flight AA129 is scheduled on time tomorrow, departing at 10:45 AM from Gate B14."`;
      } else if (playgroundConfig?.type === 'chat-memory') {
        responseText = `[Memory Buffer Window: ${params.slidingWindowSize || 4} turns active]\n\nAI Reply:\n"We discussed the core differences between traditional keyword indexing and high-dimensional semantic vector search, specifically how Cosine Similarity enables RAG systems to understand contextual intent."`;
      } else {
        responseText = `[HTTP 200 OK - SSE Stream]\n{"event": "message", "chunk": "Successfully routed through secure backend API proxy with server-side authentication."}`;
      }

      setSimulatedOutput(responseText);
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Code Snippet Box */}
      <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Code Header / Tabs */}
        <div className="bg-[#020617] px-4 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {allTabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTabIdx === idx
                      ? 'bg-indigo-500/20 text-white border border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                  id={`code-tab-${idx}`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{tab.filename}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-tighter hover:bg-slate-200 transition-colors cursor-pointer shadow-sm"
            id="copy-code-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Editor Body */}
        <div className="p-5 overflow-x-auto bg-[#020617]/90 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <pre className="whitespace-pre">
            <code>{activeSnippet.codeSnippet}</code>
          </pre>
        </div>

        {/* Explanation Footer */}
        <div className="bg-[#020617] px-5 py-3.5 border-t border-white/10 text-xs text-slate-400 flex items-start gap-2.5 font-medium">
          <Code2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>{explanation}</p>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      {playgroundConfig && (
        <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-tight text-white">
                  {playgroundConfig.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {playgroundConfig.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setParams(playgroundConfig.defaultInputs);
                setSimulatedOutput(null);
                setSimulatedLogs([]);
              }}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1.5 font-black uppercase tracking-widest transition-colors cursor-pointer bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
              title="Reset parameters to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Parameters Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {playgroundConfig.paramsList.map((param) => {
              const val = params[param.key] ?? param.defaultValue;

              if (param.type === 'slider') {
                return (
                  <div key={param.key} className="space-y-2 sm:col-span-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wide text-slate-300">
                      <label htmlFor={`param-${param.key}`}>{param.label}</label>
                      <span className="font-mono text-indigo-400 font-black">{val}</span>
                    </div>
                    <input
                      id={`param-${param.key}`}
                      type="range"
                      min={param.min ?? 0}
                      max={param.max ?? 1}
                      step={param.step ?? 0.1}
                      value={val}
                      onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    {param.helpText && <p className="text-[11px] text-slate-500">{param.helpText}</p>}
                  </div>
                );
              }

              if (param.type === 'select') {
                return (
                  <div key={param.key} className="space-y-1.5">
                    <label htmlFor={`param-${param.key}`} className="block text-xs font-black uppercase tracking-wide text-slate-300">
                      {param.label}
                    </label>
                    <select
                      id={`param-${param.key}`}
                      value={val}
                      onChange={(e) => handleParamChange(param.key, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 text-xs text-white bg-[#020617] focus:border-indigo-500 font-medium cursor-pointer"
                    >
                      {param.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#020617] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {param.helpText && <p className="text-[11px] text-slate-500">{param.helpText}</p>}
                  </div>
                );
              }

              if (param.type === 'textarea') {
                return (
                  <div key={param.key} className="space-y-1.5 sm:col-span-2">
                    <label htmlFor={`param-${param.key}`} className="block text-xs font-black uppercase tracking-wide text-slate-300">
                      {param.label}
                    </label>
                    <textarea
                      id={`param-${param.key}`}
                      rows={2}
                      value={val}
                      onChange={(e) => handleParamChange(param.key, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 text-xs text-white bg-[#020617] focus:border-indigo-500 font-mono"
                    />
                    {param.helpText && <p className="text-[11px] text-slate-500">{param.helpText}</p>}
                  </div>
                );
              }

              return (
                <div key={param.key} className="space-y-1.5">
                  <label htmlFor={`param-${param.key}`} className="block text-xs font-black uppercase tracking-wide text-slate-300">
                    {param.label}
                  </label>
                  <input
                    id={`param-${param.key}`}
                    type="text"
                    value={val}
                    onChange={(e) => handleParamChange(param.key, e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-white/10 text-xs text-white bg-[#020617] focus:border-indigo-500 font-mono"
                  />
                  {param.helpText && <p className="text-[11px] text-slate-500">{param.helpText}</p>}
                </div>
              );
            })}
          </div>

          {/* Run Action */}
          <div>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              id="run-simulation-btn"
            >
              {isRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Live Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Output Area */}
          {simulatedOutput && (
            <div className="space-y-3.5 pt-2">
              {/* Terminal Logs */}
              {simulatedLogs.length > 0 && (
                <div className="bg-[#020617] text-slate-300 p-4 rounded-xl font-mono text-xs space-y-1.5 border border-white/10">
                  <div className="flex items-center gap-2 text-indigo-400 text-[10px] uppercase font-black tracking-widest mb-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Runtime Execution Logs</span>
                  </div>
                  {simulatedLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-300">
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Output Result */}
              <div className="bg-[#020617] border border-indigo-500/40 rounded-xl p-5 space-y-2.5 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Simulated AI Output:
                </span>
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {simulatedOutput}
                </pre>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
