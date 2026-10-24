import React from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle, Lightbulb, Zap, FileText, ArrowUpRight, Info, Award
} from 'lucide-react';

export default function ATSScorePanel({ atsResult }) {
  if (!atsResult) {
    return (
      <div className="bg-[#111118] border border-border-subtle rounded-card p-12 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-text-muted mx-auto" />
        <h3 className="text-base font-bold text-text-primary">No ATS Analysis Performed Yet</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          Upload your PDF resume or click "Analyze ATS Score" in the Upload & Analyzer tab to get instant feedback and keywords optimization suggestions powered by Groq AI.
        </p>
      </div>
    );
  }

  const {
    overallScore,
    ats_score,
    raw_ai_score,
    score_adjustment_reason,
    core_languages_missing,
    role_level_detected,
    candidate_level_estimate,
    level_match,
    breakdown,
    foundKeywords,
    detected_keywords,
    missingKeywords,
    missing_keywords,
    bulletSuggestions,
    sectionFeedback
  } = atsResult;

  const finalScore = ats_score !== undefined ? ats_score : (overallScore !== undefined ? overallScore : 85);
  const matchedList = detected_keywords || foundKeywords || [];
  const missingList = missing_keywords || missingKeywords || [];

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Moderate Match';
    return 'Needs Optimization';
  };

  return (
    <div className="space-y-6">
      
      {/* SCORE TRANSPARENCY BANNER */}
      {score_adjustment_reason && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-card p-4 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-2">
              ATS Score Calibration Notice
              {raw_ai_score && (
                <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                  Raw AI Evaluation: {raw_ai_score}% → Adjusted Final: {finalScore}%
                </span>
              )}
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              {score_adjustment_reason}
            </p>
          </div>
        </div>
      )}

      {/* OVERALL SCORE & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Meter Card */}
        <div className="bg-[#111118] border border-border-subtle rounded-card p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent-primary" /> Overall ATS Compatibility
          </div>
          
          {/* Circular Score Gauge */}
          <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center my-3 shadow-2xl ${getScoreColor(finalScore)}`}>
            <span className="text-4xl font-extrabold tracking-tight font-mono">{finalScore}</span>
            <span className="text-[10px] uppercase font-bold text-text-muted">/ 100</span>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(finalScore)}`}>
            {getScoreBadge(finalScore)}
          </span>

          {level_match && (
            <div className="mt-3 text-[11px] text-text-secondary font-mono flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-accent-primary" /> Seniority Match: <span className="font-bold text-text-primary">{level_match}</span> ({candidate_level_estimate} vs {role_level_detected})
            </div>
          )}
        </div>

        {/* 4 Breakdown Sub-Scores */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-[#111118] border border-border-subtle rounded-card p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
              <span>Formatting & Parser</span>
              <span className="font-mono text-text-primary font-bold">{breakdown?.formattingScore || 85}%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${breakdown?.formattingScore || 85}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted">Standard headers, clean layout structure, and font compatibility.</p>
          </div>

          <div className="bg-[#111118] border border-border-subtle rounded-card p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
              <span>Keyword Match</span>
              <span className="font-mono text-text-primary font-bold">{breakdown?.keywordScore || 75}%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${breakdown?.keywordScore || 75}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted">Direct match count against target job description requirements.</p>
          </div>

          <div className="bg-[#111118] border border-border-subtle rounded-card p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
              <span>Content Quality</span>
              <span className="font-mono text-text-primary font-bold">{breakdown?.contentScore || 80}%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown?.contentScore || 80}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted">Action-oriented verb density and professional tone clarity.</p>
          </div>

          <div className="bg-[#111118] border border-border-subtle rounded-card p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
              <span>Quantified Impact</span>
              <span className="font-mono text-text-primary font-bold">{breakdown?.impactScore || 70}%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] h-2 rounded-full overflow-hidden border border-border-subtle">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown?.impactScore || 70}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted">X-Y-Z metrics density (percentages, revenue, scale).</p>
          </div>
        </div>

      </div>

      {/* MISSING CORE LANGUAGES ALERT */}
      {core_languages_missing && core_languages_missing.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-card p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h5 className="text-xs font-bold text-rose-400">Missing Mandatory Core Languages</h5>
              <p className="text-[11px] text-rose-200/90 mt-0.5">
                The Job Description requires <span className="font-bold font-mono">{core_languages_missing.join(', ')}</span>. Add relevant project experience or coursework for these core languages.
              </p>
            </div>
          </div>
          <span className="bg-rose-500/20 text-rose-300 text-xs font-mono font-bold px-3 py-1 rounded">
            -{core_languages_missing.length * 8} Pts
          </span>
        </div>
      )}

      {/* KEYWORD GAP ANALYSIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Found Keywords */}
        <div className="bg-[#111118] border border-border-subtle rounded-card p-5 space-y-3">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Matched Keywords ({matchedList.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedList.map((kw, idx) => (
              <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-xs font-mono font-medium">
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-[#111118] border border-border-subtle rounded-card p-5 space-y-3">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Missing Job Keywords ({missingList.length})
          </h4>
          <p className="text-[11px] text-text-secondary">Consider incorporating these relevant skills into your experience or skills section.</p>
          <div className="flex flex-wrap gap-2">
            {missingList.map((kw, idx) => (
              <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded text-xs font-mono font-medium">
                + {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* BULLET SUGGESTIONS & IMPROVEMENTS */}
      {bulletSuggestions && bulletSuggestions.length > 0 && (
        <div className="bg-[#111118] border border-border-subtle rounded-card p-5 space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> High-Impact Bullet Rewrites
          </h4>
          <div className="space-y-3">
            {bulletSuggestions.map((sug, idx) => (
              <div key={idx} className="bg-[#0A0A0F] border border-border-subtle rounded-card p-4 space-y-2 text-xs">
                <div className="text-rose-400/90 line-through leading-relaxed">
                  <span className="font-bold font-mono text-[10px] text-text-muted uppercase mr-2">[Before]</span> {sug.original}
                </div>
                <div className="text-emerald-400 font-semibold leading-relaxed flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-mono text-[10px] uppercase mr-2">[Improved]</span> {sug.improved}
                  </div>
                </div>
                {sug.reason && <p className="text-[10px] text-text-muted italic pt-1">{sug.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION FEEDBACK */}
      {sectionFeedback && (
        <div className="bg-[#111118] border border-border-subtle rounded-card p-5 space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-primary" /> Section-by-Section Coaching
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(sectionFeedback).map(([section, feedback]) => (
              <div key={section} className="bg-[#0A0A0F] border border-border-subtle p-3 rounded space-y-1">
                <span className="font-bold uppercase text-[10px] text-accent-primary font-mono">{section}</span>
                <p className="text-text-secondary leading-relaxed">{feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
