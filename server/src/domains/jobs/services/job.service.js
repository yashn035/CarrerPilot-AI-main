import jobsRepository from '../repository/jobs.repository.js';
import { awardXp } from '../../../shared/services/xp.service.js';
import { updateUserState } from '../../../shared/state/user.state.js';
import eventBus from '../../../shared/events/eventBus.js';
import { getDb, saveDb } from '../../../infrastructure/db/mongo.js';

/**
 * Normalizes stage string to lowercase standard enum values: applied, oa, interview, offer, rejected.
 */
export function normalizeStage(stageStr) {
  if (!stageStr) return 'applied';
  const s = String(stageStr).toLowerCase().trim();
  if (['applied', 'oa', 'interview', 'offer', 'rejected'].includes(s)) {
    return s;
  }
  return 'applied';
}

/**
 * Retrieve filtered + sorted job applications for a user.
 * @param {string} userId 
 * @param {object} query - { search, stage, sort }
 */
export async function getApplications(userId, { search = '', stage = 'all', sort = 'newest' } = {}) {
  let apps = await jobsRepository.getJobApplications(userId);

  // Normalize stages in retrieved applications for consistency
  apps = apps.map(app => ({
    ...app,
    stage: normalizeStage(app.stage)
  }));

  // Search filter (company or role, case-insensitive)
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    apps = apps.filter(app => 
      (app.company && app.company.toLowerCase().includes(q)) ||
      (app.role && app.role.toLowerCase().includes(q))
    );
  }

  // Stage filter
  if (stage && stage.toLowerCase() !== 'all') {
    const targetStage = normalizeStage(stage);
    apps = apps.filter(app => app.stage === targetStage);
  }

  // Sorting
  const sortMode = (sort || 'newest').toLowerCase();
  apps.sort((a, b) => {
    const dateA = new Date(a.appliedDate || a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.appliedDate || b.createdAt || b.updatedAt || 0).getTime();

    if (sortMode === 'oldest') {
      return dateA - dateB;
    } else if (sortMode === 'company' || sortMode === 'company_asc' || sortMode === 'company a-z') {
      return (a.company || '').localeCompare(b.company || '');
    } else {
      // Default: newest
      return dateB - dateA;
    }
  });

  return apps;
}

/**
 * Create a new application entry with initial history.
 */
export async function createApplication(userId, data) {
  const { company, role, stage, salary, location, jobUrl, appliedDate, notes } = data;

  if (!company || !company.trim() || !role || !role.trim()) {
    throw new Error('Company and Role are required');
  }

  const initialStage = normalizeStage(stage);
  const nowISO = new Date().toISOString();
  const appDate = appliedDate ? new Date(appliedDate).toISOString() : nowISO;

  const newApp = {
    id: 'app-' + Math.random().toString(36).substring(2, 11),
    userId,
    company: company.trim(),
    role: role.trim(),
    stage: initialStage,
    salary: salary ? String(salary).trim() : '',
    location: location ? String(location).trim() : '',
    jobUrl: jobUrl ? String(jobUrl).trim() : '',
    appliedDate: appDate,
    notes: notes ? String(notes).trim() : '',
    history: [
      {
        stage: initialStage,
        movedAt: nowISO
      }
    ],
    updatedAt: nowISO,
    createdAt: nowISO
  };

  await jobsRepository.saveJobApplication(newApp);

  // Award XP for creating application
  let leveledUp = false;
  try {
    const db = await getDb();
    const user = db.users ? db.users.find(u => u.id === userId) : null;
    if (user) {
      const reward = await awardXp(userId, 20, `Created application for ${newApp.company}`, db);
      leveledUp = reward?.leveledUp || false;
      await saveDb(db);
      await updateUserState(userId, { xp: user.xp, level: user.level });
    }
  } catch (err) {
    // Non-blocking for application creation
    console.error('Failed to award XP on application create:', err);
  }

  eventBus.emit('job_stage_changed', {
    userId,
    company: newApp.company,
    role: newApp.role,
    stage: newApp.stage
  });

  return { application: newApp, leveledUp };
}

/**
 * Update general application fields.
 */
export async function updateApplication(id, userId, data) {
  const existing = await jobsRepository.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error('Application not found');
  }

  const nowISO = new Date().toISOString();
  const nextStage = data.stage ? normalizeStage(data.stage) : normalizeStage(existing.stage);

  // Maintain history array
  let updatedHistory = Array.isArray(existing.history) ? [...existing.history] : [];
  if (data.stage && nextStage !== normalizeStage(existing.stage)) {
    updatedHistory.push({
      stage: nextStage,
      movedAt: nowISO
    });
  }

  const updatedApp = {
    ...existing,
    company: data.company !== undefined ? String(data.company).trim() : existing.company,
    role: data.role !== undefined ? String(data.role).trim() : existing.role,
    stage: nextStage,
    salary: data.salary !== undefined ? String(data.salary).trim() : (existing.salary || ''),
    location: data.location !== undefined ? String(data.location).trim() : (existing.location || ''),
    jobUrl: data.jobUrl !== undefined ? String(data.jobUrl).trim() : (existing.jobUrl || ''),
    appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString() : (existing.appliedDate || existing.createdAt || nowISO),
    notes: data.notes !== undefined ? String(data.notes).trim() : (existing.notes || ''),
    history: updatedHistory,
    updatedAt: nowISO
  };

  await jobsRepository.saveJobApplication(updatedApp);

  if (data.stage && nextStage !== normalizeStage(existing.stage)) {
    eventBus.emit('job_stage_changed', {
      userId,
      company: updatedApp.company,
      role: updatedApp.role,
      stage: nextStage
    });
  }

  return updatedApp;
}

/**
 * Update only application stage (drag and drop).
 */
export async function updateStage(id, userId, newStage) {
  if (!newStage) throw new Error('New stage is required');
  const normalizedNewStage = normalizeStage(newStage);

  const existing = await jobsRepository.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error('Application not found');
  }

  const nowISO = new Date().toISOString();
  let updatedHistory = Array.isArray(existing.history) ? [...existing.history] : [];
  if (normalizedNewStage !== normalizeStage(existing.stage)) {
    updatedHistory.push({
      stage: normalizedNewStage,
      movedAt: nowISO
    });
  }

  const updatedApp = {
    ...existing,
    stage: normalizedNewStage,
    history: updatedHistory,
    updatedAt: nowISO
  };

  await jobsRepository.saveJobApplication(updatedApp);

  eventBus.emit('job_stage_changed', {
    userId,
    company: updatedApp.company,
    role: updatedApp.role,
    stage: normalizedNewStage
  });

  return updatedApp;
}

/**
 * Delete an application.
 */
export async function deleteApplication(id, userId) {
  const success = await jobsRepository.deleteJobApplication(userId, id);
  if (!success) {
    throw new Error('Application not found');
  }
  return true;
}

/**
 * Calculate stats:
 * Total Applications
 * Response Rate = (# apps that moved past `applied` / total) * 100
 * Interview Rate = (# apps that reached `interview` / total) * 100
 * Offer Rate = (# apps with `offer` / total) * 100
 */
export async function getStats(userId) {
  const allApps = await jobsRepository.getJobApplications(userId);

  const total = allApps.length;
  if (total === 0) {
    return {
      total: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0
    };
  }

  let movedPastAppliedCount = 0;
  let reachedInterviewCount = 0;
  let offerCount = 0;

  allApps.forEach(app => {
    const currentStage = normalizeStage(app.stage);
    const historyStages = Array.isArray(app.history) 
      ? app.history.map(h => normalizeStage(h.stage))
      : [];

    const allStagesSeen = new Set([currentStage, ...historyStages]);

    // Moved past applied = current stage != 'applied' OR saw any of oa, interview, offer, rejected
    if (currentStage !== 'applied' || Array.from(allStagesSeen).some(s => s !== 'applied')) {
      movedPastAppliedCount++;
    }

    // Interview rate = reached interview or offer
    if (allStagesSeen.has('interview') || allStagesSeen.has('offer')) {
      reachedInterviewCount++;
    }

    // Offer rate = reached offer
    if (allStagesSeen.has('offer')) {
      offerCount++;
    }
  });

  const responseRate = Math.round((movedPastAppliedCount / total) * 100);
  const interviewRate = Math.round((reachedInterviewCount / total) * 100);
  const offerRate = Math.round((offerCount / total) * 100);

  return {
    total,
    responseRate,
    interviewRate,
    offerRate
  };
}

// Aliases for legacy compatibility
export const getJobsList = async () => jobsRepository.getJobsList();
export const getJobApplications = getApplications;
export const createJobApplication = createApplication;
export const updateJobApplication = updateApplication;
export const deleteJobApplication = deleteApplication;

export default {
  getApplications,
  createApplication,
  updateApplication,
  updateStage,
  deleteApplication,
  getStats,
  getJobsList,
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  normalizeStage
};
