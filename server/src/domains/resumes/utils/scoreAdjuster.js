import { syncKeywordLists, containsKeyword, CORE_LANGUAGES } from './keywordMatcher.js';

/**
 * Post-processes Groq / Heuristic ATS results to eliminate score inflation,
 * penalize missing core programming languages, and enforce strict keyword cross-validation.
 * 
 * @param {Object} rawAiResult - Raw output from AI model or heuristic score engine
 * @param {String} jdText - Job Description text
 * @param {String} resumeText - Resume text
 * @returns {Object} Adjusted ATS analysis object
 */
export function postProcessATSScore(rawAiResult = {}, jdText = '', resumeText = '') {
  const rawScore = Number(rawAiResult.raw_ai_score || rawAiResult.overallScore || 85);
  
  // 1. Cross-validate & Deduplicate Keyword Lists
  const rawDetected = Array.isArray(rawAiResult.detected_keywords || rawAiResult.foundKeywords)
    ? (rawAiResult.detected_keywords || rawAiResult.foundKeywords)
    : [];
  const rawMissing = Array.isArray(rawAiResult.missing_keywords || rawAiResult.missingKeywords)
    ? (rawAiResult.missing_keywords || rawAiResult.missingKeywords)
    : [];

  const { detected, missing } = syncKeywordLists(rawDetected, rawMissing);

  // 2. Identify missing required core programming languages
  const coreLanguagesMissing = [];
  CORE_LANGUAGES.forEach(lang => {
    // If JD requires this core language but resume does not contain it
    if (containsKeyword(jdText, lang) && !containsKeyword(resumeText, lang)) {
      if (!coreLanguagesMissing.includes(lang)) {
        coreLanguagesMissing.push(lang);
      }
    }
  });

  // Calculate penalties
  let adjustmentPenalties = 0;
  const reasons = [];

  // Core language penalty: -8 points per missing core language
  if (coreLanguagesMissing.length > 0) {
    const langPenalty = coreLanguagesMissing.length * 8;
    adjustmentPenalties += langPenalty;
    reasons.push(`${coreLanguagesMissing.join(' and ')} required by JD but missing from resume (-${langPenalty} pts)`);
  }

  // Calculate missing ratio
  const totalKeywordsCount = detected.length + missing.length;
  const missingRatio = totalKeywordsCount > 0 ? (missing.length / totalKeywordsCount) : 0;

  // 3. Seniority level estimation & level mismatch check
  const jdUpper = jdText.toUpperCase();
  const resUpper = resumeText.toUpperCase();

  const isSeniorJd = /\b(SENIOR|LEAD|PRINCIPAL|ARCHITECT|STAFF|5\+ YEARS|6\+ YEARS|7\+ YEARS)\b/.test(jdUpper);
  const isEntryResume = /\b(INTERN|INTERNSHIP|STUDENT|FRESHER|ENTRY|JUNIOR|GRADUATING|2026|2027)\b/.test(resUpper);

  let roleLevelDetected = isSeniorJd ? 'Senior / Lead' : 'Mid';
  let candidateLevelEstimate = isEntryResume ? 'Entry-Level' : 'Mid-Senior';
  let levelMatch = 'Strong';

  if (isSeniorJd && isEntryResume) {
    adjustmentPenalties += 5;
    reasons.push('Seniority gap detected between Senior role requirements and Entry-Level candidate experience (-5 pts)');
    levelMatch = 'Weak';
  } else if (missingRatio > 0.25) {
    levelMatch = 'Partial';
  }

  // Compute tentative adjusted score
  let adjustedScore = rawScore - adjustmentPenalties;

  // 4. Missing ratio cap: if > 30% of required keywords missing, cap score at 85
  let ratioCapApplied = false;
  if (missingRatio > 0.30 && adjustedScore > 85) {
    adjustedScore = 85;
    ratioCapApplied = true;
    reasons.push('High missing keyword ratio (>30% of required terms missing, capped score at 85)');
  }

  // 5. Final clamp [0, 100]
  const finalAtsScore = Math.max(0, Math.min(100, Math.round(adjustedScore)));

  // Format adjustment summary string
  const pointsReduced = Math.max(0, rawScore - finalAtsScore);
  let scoreAdjustmentReason = '';
  if (reasons.length > 0) {
    if (pointsReduced > 0) {
      scoreAdjustmentReason = `Calibrated score reduced by ${pointsReduced} pts: ${reasons.join('. ')}.`;
    } else {
      scoreAdjustmentReason = `Score calibrated: ${reasons.join('. ')}.`;
    }
  } else {
    scoreAdjustmentReason = 'Score fully verified with high ATS keyword alignment.';
  }

  // Synchronize breakdown scores with keyword density and penalties
  const verifiedKeywordScore = totalKeywordsCount > 0
    ? Math.round((detected.length / totalKeywordsCount) * 100)
    : 80;

  const baseBreakdown = rawAiResult.breakdown || {};
  const calibratedBreakdown = {
    formattingScore: Number(baseBreakdown.formattingScore || 85),
    keywordScore: verifiedKeywordScore,
    contentScore: Math.max(0, Math.min(100, Number(baseBreakdown.contentScore || 82) - (coreLanguagesMissing.length * 5))),
    impactScore: Math.max(0, Math.min(100, Number(baseBreakdown.impactScore || 80) - (isSeniorJd && isEntryResume ? 5 : 0)))
  };

  // Return complete standardized output object
  return {
    ats_score: finalAtsScore,
    overallScore: finalAtsScore, // Maintain backwards compatibility
    raw_ai_score: rawScore,
    score_adjustment_reason: scoreAdjustmentReason,
    detected_keywords: detected,
    foundKeywords: detected, // Maintain backwards compatibility
    missing_keywords: missing,
    missingKeywords: missing, // Maintain backwards compatibility
    core_languages_missing: coreLanguagesMissing,
    missing_ratio: Number(missingRatio.toFixed(2)),
    role_level_detected: roleLevelDetected,
    candidate_level_estimate: candidateLevelEstimate,
    level_match: levelMatch,
    breakdown: calibratedBreakdown,
    bulletSuggestions: rawAiResult.bulletSuggestions || rawAiResult.bullet_suggestions || [],
    sectionFeedback: rawAiResult.sectionFeedback || rawAiResult.section_feedback || {}
  };
}

export default {
  postProcessATSScore
};
