import * as jobService from '../services/job.service.js';

export async function handleGetJobs(req, res) {
  try {
    const jobs = await jobService.getJobsList();
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleGetApplications(req, res) {
  try {
    const { search, stage, sort } = req.query;
    const apps = await jobService.getApplications(req.userId, { search, stage, sort });
    return res.json(apps);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleCreateApplication(req, res) {
  try {
    const result = await jobService.createApplication(req.userId, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function handleUpdateApplication(req, res) {
  const { id } = req.params;
  try {
    const app = await jobService.updateApplication(id, req.userId, req.body);
    return res.json({ application: app });
  } catch (err) {
    const statusCode = err.message === 'Application not found' ? 404 : 500;
    return res.status(statusCode).json({ message: err.message });
  }
}

export async function handleUpdateStage(req, res) {
  const { id } = req.params;
  const { stage } = req.body;
  try {
    const app = await jobService.updateStage(id, req.userId, stage);
    return res.json({ application: app });
  } catch (err) {
    const statusCode = err.message === 'Application not found' ? 404 : 500;
    return res.status(statusCode).json({ message: err.message });
  }
}

export async function handleDeleteApplication(req, res) {
  const { id } = req.params;
  try {
    await jobService.deleteApplication(id, req.userId);
    return res.json({ success: true });
  } catch (err) {
    const statusCode = err.message === 'Application not found' ? 404 : 500;
    return res.status(statusCode).json({ message: err.message });
  }
}

export async function handleGetStats(req, res) {
  try {
    const stats = await jobService.getStats(req.userId);
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default {
  handleGetJobs,
  handleGetApplications,
  handleCreateApplication,
  handleUpdateApplication,
  handleUpdateStage,
  handleDeleteApplication,
  handleGetStats
};
