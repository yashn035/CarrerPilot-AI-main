/**
 * Advanced Keyword Matcher & NLP Utility for ATS Engine
 * Preserves compound terms (e.g. PostgreSQL, Node.js, REST API, CI/CD),
 * handles case-insensitivity, synonym normalization, and list deduplication.
 */

export const COMPOUND_TERMS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Perl', 'R', 'MATLAB', 'Dart', 'Elixir',
  // Frameworks & Libraries
  'Node.js', 'Next.js', 'React.js', 'React', 'Express.js', 'Express', 'Vue.js', 'Angular', 'Svelte', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails', 'Ruby on Rails', 'ASP.NET', '.NET Core', 'Laravel',
  // Databases
  'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'SQLite', 'Oracle', 'SQL Server', 'Supabase', 'Firebase', 'Elasticsearch', 'Neo4j', 'MariaDB',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Heroku', 'Render', 'Vercel', 'Netlify', 'DigitalOcean',
  // Concepts
  'REST API', 'RESTful API', 'GraphQL', 'gRPC', 'CI/CD', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'System Design', 'Design Patterns', 'Object-Oriented Programming', 'Data Structures', 'Algorithms', 'Microservices', 'Serverless', 'Event-Driven Architecture', 'Test-Driven Development', 'TDD', 'SDLC', 'Agile', 'Scrum', 'Kanban',
  // Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'VS Code', 'Postman', 'Figma', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Sass', 'Less',
];

export const SYNONYMS = {
  'JS': 'JavaScript',
  'TS': 'TypeScript',
  'NODE': 'Node.js',
  'NODEJS': 'Node.js',
  'NODE.JS': 'Node.js',
  'REACTJS': 'React',
  'REACT.JS': 'React',
  'VUEJS': 'Vue.js',
  'VUE.JS': 'Vue.js',
  'POSTGRES': 'PostgreSQL',
  'POSTGRESQL': 'PostgreSQL',
  'CPP': 'C++',
  'C PLUS PLUS': 'C++',
  'CSHARP': 'C#',
  'C SHARP': 'C#',
  'ML': 'Machine Learning',
  'DL': 'Deep Learning',
  'AI': 'Artificial Intelligence',
  'K8S': 'Kubernetes',
  'GHA': 'GitHub Actions',
};

export const CORE_LANGUAGES = [
  'Java', 'Python', 'C++', 'JavaScript', 'Go', 'Rust', 'TypeScript', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin'
];

/**
 * Clean & normalize raw input text
 */
export function normalizeText(text = '') {
  if (typeof text !== 'string') return '';
  return text
    .replace(/https?:\/\/\S+/gi, ' ') // Remove URLs
    .replace(/[\r\n\t]+/g, ' ')       // Collapse whitespace & newlines
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escape regular expression special characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if a term exists in text using word boundaries and case-insensitivity
 */
export function containsKeyword(text, keyword) {
  if (!text || !keyword) return false;

  // Resolve synonym if available
  const normKey = keyword.trim().toUpperCase();
  const canonicalName = SYNONYMS[normKey] || keyword;
  
  // Special boundary handling for terms containing +, #, ., /
  const escaped = escapeRegex(canonicalName);
  
  // Custom boundary check handling symbols like C++, C#, Node.js, CI/CD
  let regex;
  if (/^[a-zA-Z0-9]+$/.test(canonicalName)) {
    regex = new RegExp(`\\b${escaped}\\b`, 'i');
  } else {
    // Lookbehind / lookahead or space/punctuation boundary
    regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'i');
  }

  if (regex.test(text)) return true;

  // Check alias synonyms
  for (const [alias, canonical] of Object.entries(SYNONYMS)) {
    if (canonical.toLowerCase() === canonicalName.toLowerCase()) {
      const aliasEscaped = escapeRegex(alias);
      const aliasRegex = /^[a-zA-Z0-9]+$/.test(alias)
        ? new RegExp(`\\b${aliasEscaped}\\b`, 'i')
        : new RegExp(`(?:^|[^a-zA-Z0-9_])${aliasEscaped}(?:$|[^a-zA-Z0-9_])`, 'i');
      if (aliasRegex.test(text)) return true;
    }
  }

  return false;
}

/**
 * Extract all matching compound terms & single terms from text
 */
export function extractKeywordsWithCompounds(text = '', compoundDict = COMPOUND_TERMS) {
  const norm = normalizeText(text);
  const found = new Set();

  compoundDict.forEach((term) => {
    if (containsKeyword(norm, term)) {
      found.add(term);
    }
  });

  return Array.from(found);
}

/**
 * Deduplicate: Ensure no keyword in detected appears in missing.
 * Normalizes case and resolves canonical names.
 */
export function syncKeywordLists(detected = [], missing = []) {
  const detectedSet = new Set(detected.map(k => (SYNONYMS[k.toUpperCase()] || k).trim()));
  const detectedLower = new Set(Array.from(detectedSet).map(k => k.toLowerCase()));

  const cleanDetected = Array.from(detectedSet);
  const cleanMissing = [];

  missing.forEach(rawKey => {
    const canonical = (SYNONYMS[rawKey.toUpperCase()] || rawKey).trim();
    const lowerKey = canonical.toLowerCase();

    if (!detectedLower.has(lowerKey) && !cleanMissing.some(m => m.toLowerCase() === lowerKey)) {
      cleanMissing.push(canonical);
    }
  });

  return {
    detected: cleanDetected,
    missing: cleanMissing
  };
}

/**
 * Deterministically match resume text against JD text using Compound Dictionary
 */
export function matchKeywords(resumeText = '', jdText = '') {
  const normResume = normalizeText(resumeText);
  const normJd = normalizeText(jdText);

  const jdKeywords = extractKeywordsWithCompounds(normJd);
  const detected = [];
  const missing = [];

  jdKeywords.forEach(kw => {
    if (containsKeyword(normResume, kw)) {
      detected.push(kw);
    } else {
      missing.push(kw);
    }
  });

  return syncKeywordLists(detected, missing);
}

export default {
  COMPOUND_TERMS,
  SYNONYMS,
  CORE_LANGUAGES,
  normalizeText,
  containsKeyword,
  extractKeywordsWithCompounds,
  syncKeywordLists,
  matchKeywords
};
