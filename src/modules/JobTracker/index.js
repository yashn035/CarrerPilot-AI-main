import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, Search, Filter, ArrowUpDown, RefreshCw, Briefcase } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import StatsBar from './StatsBar';
import Column from './Column';
import AddJobModal from './AddJobModal';

const COLUMNS = [
  { id: 'applied', label: 'Applied' },
  { id: 'oa', label: 'OA' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' }
];

export default function JobTracker() {
  const { addToast } = useUser();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, responseRate: 0, interviewRate: 0, offerRate: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auth header utility
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  // Calculate real-time stats from current applications list
  const calculateRealtimeStats = useCallback((appsList) => {
    const total = appsList.length;
    if (total === 0) {
      return { total: 0, responseRate: 0, interviewRate: 0, offerRate: 0 };
    }

    let movedPastApplied = 0;
    let reachedInterview = 0;
    let offerCount = 0;

    appsList.forEach(app => {
      const stage = (app.stage || 'applied').toLowerCase();
      const historyStages = Array.isArray(app.history)
        ? app.history.map(h => (h.stage || '').toLowerCase())
        : [];
      const allSeen = new Set([stage, ...historyStages]);

      if (stage !== 'applied' || Array.from(allSeen).some(s => s !== 'applied')) {
        movedPastApplied++;
      }
      if (allSeen.has('interview') || allSeen.has('offer')) {
        reachedInterview++;
      }
      if (allSeen.has('offer')) {
        offerCount++;
      }
    });

    return {
      total,
      responseRate: Math.round((movedPastApplied / total) * 100),
      interviewRate: Math.round((reachedInterview / total) * 100),
      offerRate: Math.round((offerCount / total) * 100)
    };
  }, []);

  // Fetch applications & stats from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        fetch('/api/jobs/applications', { headers: getAuthHeaders() }),
        fetch('/api/jobs/stats', { headers: getAuthHeaders() })
      ]);

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          setStats(calculateRealtimeStats(appsData));
        }
      } else {
        addToast('Failed to fetch job applications', 'error');
      }
    } catch (err) {
      console.error('Error fetching job tracker data:', err);
      addToast('Network error while connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, addToast, calculateRealtimeStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtered & sorted applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        app =>
          (app.company && app.company.toLowerCase().includes(q)) ||
          (app.role && app.role.toLowerCase().includes(q))
      );
    }

    // Stage filter
    if (selectedStage !== 'all') {
      result = result.filter(app => (app.stage || 'applied').toLowerCase() === selectedStage);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.appliedDate || b.createdAt || 0).getTime();

      if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      } else {
        // newest
        return dateB - dateA;
      }
    });

    return result;
  }, [applications, debouncedSearch, selectedStage, sortBy]);

  // Group applications by stage column
  const columnsData = useMemo(() => {
    const map = {
      applied: [],
      oa: [],
      interview: [],
      offer: [],
      rejected: []
    };

    filteredApplications.forEach(app => {
      const stageKey = (app.stage || 'applied').toLowerCase();
      if (map[stageKey]) {
        map[stageKey].push(app);
      } else {
        map.applied.push(app);
      }
    });

    return map;
  }, [filteredApplications]);

  // Handle Drag and Drop End
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStage = destination.droppableId;
    const targetJobId = draggableId;

    // Save previous state for rollback
    const previousApps = [...applications];

    // Optimistic UI update
    setApplications(prev => {
      const next = prev.map(job => {
        if (String(job.id || job._id) === String(targetJobId)) {
          return { ...job, stage: newStage };
        }
        return job;
      });
      setStats(calculateRealtimeStats(next));
      return next;
    });

    // Send PATCH to backend
    try {
      const res = await fetch(`/api/jobs/applications/${targetJobId}/stage`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stage: newStage })
      });

      if (!res.ok) {
        throw new Error('Failed to update stage on server');
      }

      const data = await res.json();
      addToast(`Moved application to ${newStage.toUpperCase()}`, 'success');

      // Optionally refresh stats from server
      fetch('/api/jobs/stats', { headers: getAuthHeaders() })
        .then(r => r.ok && r.json())
        .then(newStats => newStats && setStats(newStats))
        .catch(() => {});
    } catch (err) {
      console.error('Drag & drop error:', err);
      // Revert state
      setApplications(previousApps);
      setStats(calculateRealtimeStats(previousApps));
      addToast('Failed to update stage. Reverting card...', 'error');
    }
  };

  // Handle Save (Create or Update)
  const handleSaveJob = async (formData) => {
    const isEdit = Boolean(formData.id);
    const previousApps = [...applications];

    if (isEdit) {
      // Optimistic edit
      const updatedList = applications.map(app =>
        String(app.id || app._id) === String(formData.id) ? { ...app, ...formData } : app
      );
      setApplications(updatedList);
      setStats(calculateRealtimeStats(updatedList));
      setIsModalOpen(false);

      try {
        const res = await fetch(`/api/jobs/applications/${formData.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error('Failed to update application');
        addToast('Application updated successfully!', 'success');
      } catch (err) {
        console.error('Update error:', err);
        setApplications(previousApps);
        setStats(calculateRealtimeStats(previousApps));
        addToast(err.message || 'Failed to update application', 'error');
      }
    } else {
      // Optimistic add
      const tempId = 'temp-' + Date.now();
      const newJob = { ...formData, id: tempId, createdAt: new Date().toISOString() };
      const nextList = [newJob, ...applications];

      setApplications(nextList);
      setStats(calculateRealtimeStats(nextList));
      setIsModalOpen(false);

      try {
        const res = await fetch('/api/jobs/applications', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error('Failed to create application');

        const data = await res.json();
        const createdApp = data.application || data;

        // Replace temp id with real id
        setApplications(prev =>
          prev.map(item => (item.id === tempId ? { ...item, ...createdApp } : item))
        );
        addToast('New job application added!', 'success');
      } catch (err) {
        console.error('Create error:', err);
        setApplications(previousApps);
        setStats(calculateRealtimeStats(previousApps));
        addToast(err.message || 'Failed to create application', 'error');
      }
    }
  };

  // Handle Delete
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    const previousApps = [...applications];

    // Optimistic deletion
    const nextList = applications.filter(app => String(app.id || app._id) !== String(jobId));
    setApplications(nextList);
    setStats(calculateRealtimeStats(nextList));

    if (editingJob && String(editingJob.id || editingJob._id) === String(jobId)) {
      setIsModalOpen(false);
      setEditingJob(null);
    }

    try {
      const res = await fetch(`/api/jobs/applications/${jobId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error('Failed to delete application');
      addToast('Application deleted', 'info');
    } catch (err) {
      console.error('Delete error:', err);
      setApplications(previousApps);
      setStats(calculateRealtimeStats(previousApps));
      addToast(err.message || 'Failed to delete application', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Job Application Tracker
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage and track your placement workflow across stage pipelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-gray-800 bg-[#111118] text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
            title="Refresh applications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Filter and Controls Bar */}
      <div className="bg-[#111118]/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or role..."
            className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Stage Filter */}
          <div className="flex items-center gap-2 bg-[#181824] border border-gray-800 rounded-xl px-3 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-400 font-medium">Stage:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#181824]">All Stages</option>
              <option value="applied" className="bg-[#181824]">Applied</option>
              <option value="oa" className="bg-[#181824]">OA</option>
              <option value="interview" className="bg-[#181824]">Interview</option>
              <option value="offer" className="bg-[#181824]">Offer</option>
              <option value="rejected" className="bg-[#181824]">Rejected</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 bg-[#181824] border border-gray-800 rounded-xl px-3 py-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#181824]">Newest First</option>
              <option value="oldest" className="bg-[#181824]">Oldest First</option>
              <option value="company" className="bg-[#181824]">Company A-Z</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Kanban Columns Container */}
      {loading && applications.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-12">
          {COLUMNS.map((col) => (
            <div key={col.id} className="bg-[#111118]/50 border border-gray-800/40 rounded-2xl h-96 p-4 animate-pulse">
              <div className="h-6 bg-gray-800/60 rounded-md w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-24 bg-gray-800/40 rounded-xl"></div>
                <div className="h-24 bg-gray-800/40 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                stageId={col.id}
                jobs={columnsData[col.id] || []}
                onEditJob={handleOpenEditModal}
                onDeleteJob={handleDeleteJob}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Add / Edit Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        onDelete={handleDeleteJob}
        initialData={editingJob}
      />

    </div>
  );
}
