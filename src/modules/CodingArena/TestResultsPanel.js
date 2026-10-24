import React, { useState } from 'react';
import { Terminal, Brain, Sparkles, Clock, Database, ChevronDown, ChevronUp } from 'lucide-react';
import ErrorBanner from './ErrorBanner';
import TestCaseRow from './TestCaseRow';

export default function TestResultsPanel({ result, isSubmission }) {
  const [activeTab, setActiveTab] = useState('testcases');
  const [expandedFollowUp, setExpandedFollowUp] = useState({});

  if (!result) return null;

  const resultsList = result.results || [];
  const passedCount = result.passedCount !== undefined 
    ? result.passedCount 
    : resultsList.filter(r => r.passed).length;
  const totalCount = result.totalCount || result.summary?.total || resultsList.length || 0;
  
  const status = result.status || (passedCount === totalCount && totalCount > 0 ? 'accepted' : 'wrong_answer');
  const compileError = result.compileError;
  const runtimeError = result.runtimeError;

  const toggleFollowUp = (idx) => {
    setExpandedFollowUp(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const autopsy = result.autopsy;

  return (
    <div className="bg-[#111118] border border-gray-800 rounded-2xl overflow-hidden shadow-xl mt-4">
      
      {/* Top Banner Message */}
      <div className="p-4 border-b border-gray-800/80 bg-[#14141f]">
        <ErrorBanner
          status={status}
          message={
            compileError
              ? compileError.message
              : runtimeError
              ? runtimeError.message
              : result.error
          }
          line={compileError?.line}
          stack={runtimeError?.stack}
          summary={{ passed: passedCount, total: totalCount }}
        />

        {/* Tab Switcher & Runtime Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('testcases')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'testcases'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-[#181824] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Test Cases ({passedCount}/{totalCount})
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'console'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-[#181824] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>

            {autopsy && (
              <button
                onClick={() => setActiveTab('complexity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'complexity'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Complexity & AI Autopsy</span>
              </button>
            )}
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5" title="Execution Time">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{result.runtimeMs || result.summary?.runtime || 12} ms</span>
            </div>
            <div className="flex items-center gap-1.5" title="Memory Footprint">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>{result.memoryMb || result.summary?.memory || 34.2} MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 max-h-[360px] overflow-y-auto">
        
        {/* TAB 1: Test Cases */}
        {activeTab === 'testcases' && (
          <div>
            {resultsList.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 italic">
                No test case results available.
              </div>
            ) : (
              resultsList.map((res, i) => (
                <TestCaseRow key={i} index={i} result={res} />
              ))
            )}
          </div>
        )}

        {/* TAB 2: Console Output */}
        {activeTab === 'console' && (
          <div className="bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-xs text-gray-200">
            {result.error || resultsList.some(r => r.stdout) ? (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {resultsList.map(r => r.stdout).filter(Boolean).join('\n') || result.error || 'Console output recorded.'}
              </pre>
            ) : (
              <p className="text-gray-500 italic">No console.log or standard error output recorded during execution.</p>
            )}
          </div>
        )}

        {/* TAB 3: Complexity & AI Autopsy */}
        {activeTab === 'complexity' && autopsy && (
          <div className="space-y-4 font-sans text-xs">
            {/* Complexity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#181824] border border-gray-800 rounded-xl">
                <div className="text-gray-400 text-[11px] font-medium">Time Complexity</div>
                <div className="text-lg font-bold text-indigo-400 font-mono mt-1">
                  {autopsy.timeComplexity || 'O(N)'}
                </div>
              </div>

              <div className="p-3.5 bg-[#181824] border border-gray-800 rounded-xl">
                <div className="text-gray-400 text-[11px] font-medium">Space Complexity</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {autopsy.spaceComplexity || 'O(1)'}
                </div>
              </div>

              <div className="p-3.5 bg-[#181824] border border-gray-800 rounded-xl">
                <div className="text-gray-400 text-[11px] font-medium">Runtime Percentile</div>
                <div className="text-lg font-bold text-purple-400 font-mono mt-1">
                  Beats {autopsy.runtimePercentile || 88}%
                </div>
              </div>
            </div>

            {/* AI Report */}
            {autopsy.explanation && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-purple-300 text-xs">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>AI Autopsy Efficiency Report:</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {autopsy.explanation}
                </p>
              </div>
            )}

            {/* Follow-up Questions */}
            {Array.isArray(autopsy.followUpQuestions) && autopsy.followUpQuestions.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Interview Follow-Up Questions:</span>
                </div>
                {autopsy.followUpQuestions.map((q, idx) => (
                  <div key={idx} className="bg-[#181824] border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFollowUp(idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-gray-200 hover:bg-gray-800/50 transition-colors"
                    >
                      <span>Q{idx + 1}: {q}</span>
                      {expandedFollowUp[idx] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {expandedFollowUp[idx] && (
                      <div className="p-3 pt-0 text-xs text-gray-400 border-t border-gray-800/80 bg-[#14141f]">
                        <p className="italic text-indigo-300">
                          Interview Tip: Frame your answer by considering worst-case scenarios, memory overhead, and scaling limits.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
