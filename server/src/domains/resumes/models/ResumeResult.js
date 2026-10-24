import mongoose from 'mongoose';

const ResumeResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  jobTitle: {
    type: String,
    default: 'General Software Engineer'
  },
  jobDescription: {
    type: String,
    default: ''
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  raw_ai_score: {
    type: Number,
    default: 0
  },
  score_adjustment_reason: {
    type: String,
    default: ''
  },
  core_languages_missing: [{
    type: String
  }],
  role_level_detected: {
    type: String,
    default: 'Mid'
  },
  candidate_level_estimate: {
    type: String,
    default: 'Mid'
  },
  level_match: {
    type: String,
    default: 'Strong'
  },
  breakdown: {
    formattingScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    contentScore: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 }
  },
  foundKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  bulletSuggestions: [{
    original: { type: String },
    improved: { type: String },
    reason: { type: String }
  }],
  sectionFeedback: {
    summary: { type: String, default: '' },
    experience: { type: String, default: '' },
    skills: { type: String, default: '' },
    education: { type: String, default: '' }
  },
  rawParsedText: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const ResumeResult = mongoose.models.ResumeResult || mongoose.model('ResumeResult', ResumeResultSchema);
export default ResumeResult;
