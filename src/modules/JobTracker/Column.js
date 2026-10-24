import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import JobCard from './JobCard';

const STAGE_CONFIGS = {
  applied: {
    title: 'Applied',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/20',
    headerDot: 'bg-blue-400',
    headerBorder: 'border-t-2 border-t-blue-500'
  },
  oa: {
    title: 'OA / Assessment',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    badgeBorder: 'border-purple-500/20',
    headerDot: 'bg-purple-400',
    headerBorder: 'border-t-2 border-t-purple-500'
  },
  interview: {
    title: 'Interview',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/20',
    headerDot: 'bg-amber-400',
    headerBorder: 'border-t-2 border-t-amber-500'
  },
  offer: {
    title: 'Offer',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
    headerDot: 'bg-emerald-400',
    headerBorder: 'border-t-2 border-t-emerald-500'
  },
  rejected: {
    title: 'Rejected',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/20',
    headerDot: 'bg-rose-400',
    headerBorder: 'border-t-2 border-t-rose-500'
  }
};

export default function Column({ stageId, jobs = [], onEditJob, onDeleteJob }) {
  const config = STAGE_CONFIGS[stageId] || {
    title: stageId,
    badgeBg: 'bg-gray-500/10',
    badgeText: 'text-gray-400',
    badgeBorder: 'border-gray-500/20',
    headerDot: 'bg-gray-400',
    headerBorder: 'border-t-2 border-t-gray-500'
  };

  return (
    <div className="flex flex-col min-w-[280px] max-w-[340px] w-full bg-[#111118]/80 border border-gray-800/80 rounded-2xl overflow-hidden shadow-lg shrink-0">
      {/* Column Header */}
      <div className={`p-4 bg-[#14141f] border-b border-gray-800/80 flex items-center justify-between ${config.headerBorder}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.headerDot}`} />
          <h3 className="font-bold text-white text-sm tracking-wide">
            {config.title}
          </h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
        >
          {jobs.length}
        </span>
      </div>

      {/* Droppable Card Area */}
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow p-3 min-h-[500px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-500/5' : 'bg-transparent'
            }`}
          >
            {jobs.length === 0 ? (
              <div className="h-44 border-2 border-dashed border-gray-800/80 rounded-xl flex flex-col items-center justify-center text-center p-4 my-2">
                <p className="text-xs text-gray-500 font-medium">No applications yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Drag cards here or add new</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <JobCard
                  key={job.id || job._id}
                  job={job}
                  index={index}
                  onEdit={onEditJob}
                  onDelete={onDeleteJob}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
