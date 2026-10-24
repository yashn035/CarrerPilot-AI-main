import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export default function TestCaseRow({ index, result }) {
  const [isOpen, setIsOpen] = useState(!result.passed);
  const isPassed = result.passed;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isPassed
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-rose-500/5 border-rose-500/25'
      } overflow-hidden mb-2.5`}
    >
      {/* Test Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-xs">
          {isPassed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className={isPassed ? 'text-emerald-300' : 'text-rose-300'}>
            Test Case {index + 1} {result.isHidden ? '(Hidden)' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {result.runtime !== undefined && (
            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.runtime} ms
            </span>
          )}
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
            isPassed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {isPassed ? 'Passed' : 'Failed'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Test Case Details */}
      {isOpen && !result.isHidden && (
        <div className="p-3.5 border-t border-gray-800/80 bg-black/40 space-y-2 text-xs font-mono">
          <div>
            <span className="text-gray-400 font-sans font-medium text-[11px] block mb-0.5">Input:</span>
            <div className="bg-[#14141f] p-2 rounded border border-gray-800 text-gray-200 overflow-x-auto">
              {result.input || 'N/A'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-gray-400 font-sans font-medium text-[11px] block mb-0.5">Expected Output:</span>
              <div className="bg-[#14141f] p-2 rounded border border-emerald-500/30 text-emerald-400 overflow-x-auto">
                {result.expected || 'N/A'}
              </div>
            </div>

            <div>
              <span className="text-gray-400 font-sans font-medium text-[11px] block mb-0.5">Actual Output:</span>
              <div className={`bg-[#14141f] p-2 rounded border ${
                isPassed ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'
              } overflow-x-auto`}>
                {result.actual || result.stdout || '(Empty Output)'}
              </div>
            </div>
          </div>

          {result.error && (
            <div className="pt-1">
              <span className="text-rose-400 font-sans font-medium text-[11px] block mb-0.5">Error:</span>
              <div className="bg-rose-500/10 p-2.5 rounded border border-rose-500/20 text-rose-300 text-[11px]">
                {result.error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
