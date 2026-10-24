import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, MapPin, DollarSign, ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job, index, onEdit, onDelete }) {
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleCardClick = (e) => {
    // Prevent edit modal trigger when clicking external link or delete button
    if (e.target.closest('.no-card-click')) return;
    onEdit(job);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(job.id || job._id);
  };

  return (
    <Draggable draggableId={String(job.id || job._id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`group relative bg-[#181824] hover:bg-[#1f1f2e] border border-gray-800/80 hover:border-indigo-500/40 rounded-xl p-4 mb-3 transition-all duration-200 cursor-pointer shadow-md select-none ${
            snapshot.isDragging
              ? 'shadow-2xl shadow-indigo-500/20 border-indigo-500 scale-[1.02] z-50 bg-[#1e1e2d]'
              : ''
          }`}
          style={{
            ...provided.draggableProps.style
          }}
        >
          {/* Top Bar: Company Name & Actions */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="font-bold text-white text-sm tracking-tight leading-snug group-hover:text-indigo-300 transition-colors truncate">
              {job.company}
            </h4>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-card-click">
              {job.jobUrl && (
                <a
                  href={job.jobUrl.startsWith('http') ? job.jobUrl : `https://${job.jobUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 p-1 rounded hover:bg-gray-800 transition-colors"
                  title="View Job Post"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                title="Delete Application"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Role */}
          <p className="text-xs font-medium text-gray-300 mb-3 truncate">
            {job.role}
          </p>

          {/* Badges: Salary & Location */}
          {(job.salary || job.location) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.salary && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                  <DollarSign className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[120px]">{job.salary}</span>
                </span>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[120px]">{job.location}</span>
                </span>
              )}
            </div>
          )}

          {/* Notes Preview (truncated 2 lines) */}
          {job.notes && (
            <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 mb-3 bg-[#111118]/60 p-2 rounded-lg border border-gray-800/40">
              {job.notes}
            </p>
          )}

          {/* Footer: Date */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800/50">
            <span className="inline-flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3" />
              {getRelativeTime(job.appliedDate || job.createdAt)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
