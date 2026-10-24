import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function ErrorBanner({ status, message, line, stack, summary }) {
  if (!status) return null;

  const configs = {
    accepted: {
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: CheckCircle,
      title: 'ACCEPTED'
    },
    wrong_answer: {
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      icon: XCircle,
      title: 'WRONG ANSWER'
    },
    compile_error: {
      bgColor: 'bg-rose-500/15',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      icon: AlertTriangle,
      title: 'COMPILATION ERROR'
    },
    runtime_error: {
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/40',
      textColor: 'text-orange-400',
      icon: AlertCircle,
      title: 'RUNTIME ERROR'
    },
    time_limit_exceeded: {
      bgColor: 'bg-rose-500/15',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      icon: Clock,
      title: 'TIME LIMIT EXCEEDED'
    },
    system_error: {
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-400',
      icon: AlertTriangle,
      title: 'SYSTEM ERROR'
    }
  };

  const config = configs[status] || configs.wrong_answer;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} transition-all space-y-2 mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs tracking-wider">
          <Icon className={`w-4 h-4 ${config.textColor}`} />
          <span className={config.textColor}>{config.title}</span>
          {line && (
            <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/30">
              Line {line}
            </span>
          )}
        </div>

        {summary && (
          <div className="text-[11px] font-mono font-semibold text-gray-300">
            {summary.passed} / {summary.total} Test Cases Passed
          </div>
        )}
      </div>

      {message && (
        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-lg border border-gray-800/80 max-h-40 overflow-y-auto">
          {message}
        </pre>
      )}

      {stack && (
        <details className="text-[11px] font-mono text-gray-400 cursor-pointer">
          <summary className="hover:text-gray-200 py-1">View Stack Trace</summary>
          <pre className="mt-2 text-[10px] bg-black/60 p-2.5 rounded border border-gray-800 overflow-x-auto text-rose-300">
            {stack}
          </pre>
        </details>
      )}
    </div>
  );
}
