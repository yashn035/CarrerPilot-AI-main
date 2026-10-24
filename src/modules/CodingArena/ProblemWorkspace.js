import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, FileCode2, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import EditorPanel from './EditorPanel';
import TestResultsPanel from './TestResultsPanel';
import BlindModeToggle from './BlindModeToggle';
import { useUser } from '../../context/UserContext';

export default function ProblemWorkspace({ problem, onBack }) {
  const { getAuthHeaders } = useUser();
  const [fullProblem, setFullProblem] = useState(problem);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [language, setLanguage] = useState('javascript');
  const [codeByLanguage, setCodeByLanguage] = useState({
    javascript: '',
    python: '',
    java: '',
    cpp: ''
  });

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [isSubmission, setIsSubmission] = useState(false);

  // Blind mode state
  const [blindMode, setBlindMode] = useState(false);
  const [peeksRemaining, setPeeksRemaining] = useState(3);

  // Fetch full problem details if description missing
  useEffect(() => {
    if (problem) {
      const probId = problem.id || problem.titleSlug;
      if (!problem.description) {
        setLoadingDetail(true);
        fetch(`/api/coding/${probId}`, { headers: getAuthHeaders() })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && data.description) {
              setFullProblem(data);
            } else {
              setFullProblem(problem);
            }
          })
          .catch(() => setFullProblem(problem))
          .finally(() => setLoadingDetail(false));
      } else {
        setFullProblem(problem);
      }
    }
  }, [problem]);

  const activeProb = fullProblem || problem;
  const problemId = activeProb?.id || activeProb?.titleSlug;

  // Initialize per-language starter code when activeProb changes
  useEffect(() => {
    if (activeProb) {
      const starters = {
        javascript:
          activeProb.starterCode?.javascript ||
          'function solution() {\n  // Write JavaScript solution here\n}',
        python:
          activeProb.starterCode?.python ||
          'class Solution:\n    def solution(self):\n        pass',
        java:
          activeProb.starterCode?.java ||
          'class Solution {\n    public void solution() {\n        \n    }\n}',
        cpp:
          activeProb.starterCode?.cpp ||
          'class Solution {\npublic:\n    void solution() {\n        \n    }\n};'
      };

      setCodeByLanguage(starters);
    }
  }, [activeProb]);

  if (!activeProb) return null;

  const currentCode = codeByLanguage[language] || '';

  const handleCodeChange = (newCode) => {
    setCodeByLanguage(prev => ({
      ...prev,
      [language]: newCode
    }));
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleRun = async () => {
    setRunning(true);
    setExecResult(null);
    setIsSubmission(false);
    try {
      const res = await fetch(`/api/coding/${problemId}/run`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language })
      });
      if (res.ok) {
        const data = await res.json();
        setExecResult(data);
        if (data.status === 'accepted' || data.success) {
          fireConfetti();
        }
      }
    } catch (e) {
      console.error('Run failed:', e);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setExecResult(null);
    setIsSubmission(true);
    try {
      const res = await fetch(`/api/coding/${problemId}/submit`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language })
      });
      if (res.ok) {
        const data = await res.json();
        setExecResult(data);
        if (data.status === 'accepted' || data.success) {
          fireConfetti();
        }
      }
    } catch (e) {
      console.error('Submission failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-4">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#111118] border border-gray-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Back to Problem Browser"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">{activeProb.title}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  activeProb.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : activeProb.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {activeProb.difficulty}
              </span>
            </div>
            <span className="text-xs text-gray-400">{activeProb.category || 'Algorithms'}</span>
          </div>
        </div>

        {/* Blind Mode Toolbar */}
        <BlindModeToggle
          blindMode={blindMode}
          setBlindMode={setBlindMode}
          peeksRemaining={peeksRemaining}
          onPeekUsed={() => setPeeksRemaining((p) => Math.max(0, p - 1))}
        />
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Pane: Problem Description */}
        <div className="lg:col-span-5 flex flex-col h-[740px] bg-[#111118] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-[#14141f] border-b border-gray-800/80 flex items-center justify-between text-xs font-semibold text-gray-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Problem Description</span>
            </div>
            {loadingDetail && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
          </div>

          <div
            className={`p-6 flex-1 overflow-y-auto space-y-6 transition-all ${
              blindMode ? 'backdrop-blur-md opacity-20 filter select-none' : ''
            }`}
          >
            {/* Description Text */}
            {activeProb.description ? (
              <div
                className="prose prose-invert prose-xs text-gray-300 leading-relaxed max-w-none space-y-3"
                dangerouslySetInnerHTML={{ __html: activeProb.description }}
              />
            ) : (
              <div className="text-xs text-gray-500 italic p-4">Loading problem description...</div>
            )}

            {/* Examples List */}
            {Array.isArray(activeProb.examples) && activeProb.examples.length > 0 && (
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs text-white">Examples</h4>
                {activeProb.examples.map((ex, idx) => (
                  <div key={idx} className="bg-[#181824] p-3.5 rounded-xl border border-gray-800/80 space-y-1 text-xs font-mono">
                    {ex.input && (
                      <div>
                        <span className="text-gray-400 font-sans font-semibold">Input: </span>
                        <code className="text-white">{ex.input}</code>
                      </div>
                    )}
                    {ex.output && (
                      <div>
                        <span className="text-gray-400 font-sans font-semibold">Output: </span>
                        <code className="text-indigo-400">{ex.output}</code>
                      </div>
                    )}
                    {ex.explanation && (
                      <div className="text-gray-400 font-sans text-[11px] pt-1 italic">
                        Explanation: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {Array.isArray(activeProb.constraints) && activeProb.constraints.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-white">Constraints</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 font-mono">
                  {activeProb.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Monaco Editor & Output Results */}
        <div className="lg:col-span-7 flex flex-col h-[740px] overflow-y-auto space-y-4">
          <div className="flex-1">
            <EditorPanel
              language={language}
              setLanguage={setLanguage}
              code={currentCode}
              setCode={handleCodeChange}
              onRun={handleRun}
              onSubmit={handleSubmit}
              running={running}
              submitting={submitting}
              compileError={execResult?.compileError}
            />
          </div>

          {/* Execution Results */}
          <TestResultsPanel result={execResult} isSubmission={isSubmission} />
        </div>
      </div>
    </div>
  );
}
