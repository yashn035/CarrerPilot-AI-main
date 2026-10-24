import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { createRequire } from 'module';
import { authenticateToken } from '../../../middlewares/auth.js';
import { LLMRouter } from '../../../infrastructure/ai/llm.router.js';
import ResumeResult from '../models/ResumeResult.js';
import { generateSummaryAI, polishBulletAI } from '../services/resume.service.js';
import { matchKeywords, syncKeywordLists } from '../utils/keywordMatcher.js';
import { postProcessATSScore } from '../utils/scoreAdjuster.js';

const require = createRequire(import.meta.url);

/**
 * Universal PDF Buffer Parser Helper
 * Compatible with pdf-parse v1 (function) & v2 (PDFParse class)
 */
async function parsePdfBuffer(buffer) {
  try {
    const pdfModule = require('pdf-parse');
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      return data.text || '';
    }
    if (pdfModule && pdfModule.PDFParse) {
      const uint8 = new Uint8Array(buffer);
      const parser = new pdfModule.PDFParse(uint8);
      const result = await parser.getText();
      return typeof result === 'string' ? result : (result.text || JSON.stringify(result));
    }
  } catch (e) {
    console.warn('[PDF Parser Warning] Library extraction error, falling back to ASCII stream reader:', e.message);
  }

  const rawStr = buffer.toString('utf-8');
  const cleanText = rawStr.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
  return cleanText.length > 30 ? cleanText : 'Resume document content extracted';
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = Router();
router.use(authenticateToken);

/**
 * Core LLM + Deterministic NLP ATS Analysis Helper
 */
async function performATSAnalysis(resumeText, jobDescription, jobTitle = 'Software Engineer') {
  // 1. Deterministic NLP Keyword Matching (Case-insensitive, Compound-aware)
  const nlpMatch = matchKeywords(resumeText, jobDescription);

  // 2. Groq AI Assessment Prompt
  const prompt = `You are a veteran ATS (Applicant Tracking System) recruiter and NLP parser. Evaluate this candidate's resume against the Job Description.

JOB TITLE: ${jobTitle}
JOB DESCRIPTION:
${jobDescription || 'Standard software engineering role requiring technical proficiency, modern frameworks, clean code, and software development lifecycle knowledge.'}

RESUME TEXT:
${resumeText.slice(0, 4500)}

Perform an in-depth candidate analysis.
STRICT INSTRUCTIONS:
1. Do NOT duplicate keywords across detected_keywords and missing_keywords. No term can be in both.
2. Return a raw_ai_score from 0 to 100 based strictly on candidate qualification.
3. Identify core programming languages required by the JD (e.g. Java, Python, C++, JavaScript, Go, Rust, TypeScript, C#).
4. Estimate JD role seniority (Senior, Mid, Entry-Level) and Candidate seniority.

Respond STRICTLY in JSON format matching this schema:
{
  "raw_ai_score": 88,
  "breakdown": {
    "formattingScore": 85,
    "keywordScore": 80,
    "contentScore": 82,
    "impactScore": 80
  },
  "detected_keywords": ["JavaScript", "React", "Node.js", "MongoDB"],
  "missing_keywords": ["Python", "C++", "Docker"],
  "role_level_detected": "Mid-Senior",
  "candidate_level_estimate": "Entry-Level",
  "level_match": "Partial",
  "bulletSuggestions": [
    {
      "original": "Worked on web app",
      "improved": "Engineered responsive React web application serving 10,000+ monthly active users",
      "reason": "Quantified impact and tech stack."
    }
  ],
  "sectionFeedback": {
    "summary": "Highlight target role core competencies.",
    "experience": "Quantify outcomes using metrics.",
    "skills": "Group technical skills by category.",
    "education": "Clear degree format."
  }
}`;

  let rawAiResult = {
    raw_ai_score: 85,
    breakdown: { formattingScore: 85, keywordScore: 80, contentScore: 82, impactScore: 80 },
    detected_keywords: nlpMatch.detected,
    missing_keywords: nlpMatch.missing,
    role_level_detected: 'Mid',
    candidate_level_estimate: 'Entry-Level',
    level_match: 'Partial',
    bulletSuggestions: [],
    sectionFeedback: {}
  };

  try {
    const aiRes = await LLMRouter.route(prompt, 'fast', false, 'You are an expert ATS evaluator.');
    const text = aiRes.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedJson = JSON.parse(jsonMatch[0]);
      rawAiResult = {
        ...rawAiResult,
        ...parsedJson,
        // Merge NLP deterministic matches with AI detected/missing keywords
        detected_keywords: Array.from(new Set([...(parsedJson.detected_keywords || []), ...nlpMatch.detected])),
        missing_keywords: Array.from(new Set([...(parsedJson.missing_keywords || []), ...nlpMatch.missing]))
      };
    }
  } catch (err) {
    console.warn('[ATS Engine] Groq AI call skipped or failed, using NLP Heuristic engine:', err.message);
  }

  // 3. Sync keyword lists to guarantee ZERO overlap
  const synced = syncKeywordLists(rawAiResult.detected_keywords, rawAiResult.missing_keywords);
  rawAiResult.detected_keywords = synced.detected;
  rawAiResult.missing_keywords = synced.missing;

  // 4. Apply Post-Processing Rules (Penalties, Caps, Deduplication, Transparency)
  const finalAnalysis = postProcessATSScore(rawAiResult, jobDescription, resumeText);

  // Debug Logging
  console.log(`[ATS] Raw Groq score: ${finalAnalysis.raw_ai_score}`);
  console.log(`[ATS] Detected: ${finalAnalysis.detected_keywords.length} keywords, Missing: ${finalAnalysis.missing_keywords.length} keywords`);
  console.log(`[ATS] Adjustments: ${finalAnalysis.score_adjustment_reason}`);
  console.log(`[ATS] Final score: ${finalAnalysis.ats_score}`);

  return finalAnalysis;
}

// 1. Analyze PDF or Text Resume for ATS Score
router.post('/analyze-ats', upload.single('resumeFile'), async (req, res, next) => {
  try {
    let resumeText = req.body.resumeText || '';
    const jobDescription = req.body.jobDescription || '';
    const jobTitle = req.body.jobTitle || 'Software Engineer';
    const resumeId = req.body.resumeId || null;

    if (req.file) {
      console.log(`[ATS Controller] Parsing uploaded PDF file: ${req.file.originalname} (${req.file.size} bytes)`);
      resumeText = await parsePdfBuffer(req.file.buffer);
    }

    if (!resumeText.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide resume text or upload a valid PDF resume file.'
      });
    }

    console.log(`[ATS Controller] Running performATSAnalysis for title: "${jobTitle}"...`);
    const analysis = await performATSAnalysis(resumeText, jobDescription, jobTitle);

    const rawUserId = req.userId || req.user?.id || req.user?._id || 'demo-user-123';
    let validUserId;
    if (mongoose.Types.ObjectId.isValid(rawUserId)) {
      validUserId = rawUserId;
    } else {
      validUserId = new mongoose.Types.ObjectId();
    }

    let resultId = `ats-${Date.now()}`;

    try {
      const savedResult = new ResumeResult({
        userId: validUserId,
        resumeId: (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) ? resumeId : undefined,
        jobTitle,
        jobDescription,
        overallScore: analysis.ats_score,
        raw_ai_score: analysis.raw_ai_score,
        score_adjustment_reason: analysis.score_adjustment_reason,
        core_languages_missing: analysis.core_languages_missing,
        role_level_detected: analysis.role_level_detected,
        candidate_level_estimate: analysis.candidate_level_estimate,
        level_match: analysis.level_match,
        breakdown: analysis.breakdown,
        foundKeywords: analysis.detected_keywords,
        missingKeywords: analysis.missing_keywords,
        bulletSuggestions: analysis.bulletSuggestions,
        sectionFeedback: analysis.sectionFeedback,
        rawParsedText: resumeText.slice(0, 1000)
      });

      await savedResult.save();
      resultId = savedResult._id;
      console.log(`[ATS Controller] Saved analysis record to database with ID: ${resultId}`);
    } catch (dbErr) {
      console.warn(`[ATS Controller] Database save skipped or failed, returning analysis directly:`, dbErr.message);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id: resultId,
        ...analysis,
        rawParsedText: resumeText
      }
    });
  } catch (err) {
    console.error('[ATS Controller] Critical error in /analyze-ats route:', err);
    next(err);
  }
});

// 2. Extract Keywords from Job Description
router.post('/extract-keywords', async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ status: 'fail', message: 'Job description is required.' });
    }

    const prompt = `Extract top 15 technical skills, frameworks, tools, and soft skills from this job description:
"${jobDescription}"

Respond ONLY with JSON format:
{
  "technical": ["Skill1", "Skill2"],
  "soft": ["Communication", "Leadership"]
}`;

    let keywords = { technical: [], soft: [] };
    try {
      const aiRes = await LLMRouter.route(prompt, 'fast', false);
      const jsonMatch = (aiRes.text || '').match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      keywords = {
        technical: ["JavaScript", "React", "Node.js", "Express", "REST APIs", "SQL", "Git"],
        soft: ["Problem Solving", "Teamwork", "Agile Development"]
      };
    }

    return res.status(200).json({ status: 'success', data: keywords });
  } catch (err) {
    next(err);
  }
});

// 3. Polish / Rewrite Bullet Point
router.post('/polish-bullet', async (req, res, next) => {
  try {
    const { bulletText, targetRole } = req.body;
    if (!bulletText) {
      return res.status(400).json({ status: 'fail', message: 'Bullet text is required.' });
    }

    const result = await polishBulletAI(bulletText, targetRole);
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

// 4. Generate AI Summary
router.post('/generate-summary', async (req, res, next) => {
  try {
    const { personalInfo, targetRole, skills, experience } = req.body;
    const summary = await generateSummaryAI(personalInfo, targetRole, skills, experience);
    return res.status(200).json({ status: 'success', data: { summary } });
  } catch (err) {
    next(err);
  }
});

export default router;
