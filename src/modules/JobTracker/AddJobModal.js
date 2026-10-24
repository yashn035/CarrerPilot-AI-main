import React, { useState, useEffect } from 'react';
import { X, Trash2, Building, Briefcase, DollarSign, MapPin, Link2, Calendar, FileText } from 'lucide-react';

export default function AddJobModal({ isOpen, onClose, onSave, onDelete, initialData = null }) {
  const isEditMode = Boolean(initialData && (initialData.id || initialData._id));

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    stage: 'applied',
    salary: '',
    location: '',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      let formattedDate = new Date().toISOString().split('T')[0];
      if (initialData.appliedDate) {
        try {
          formattedDate = new Date(initialData.appliedDate).toISOString().split('T')[0];
        } catch {
          formattedDate = new Date().toISOString().split('T')[0];
        }
      }

      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        stage: initialData.stage || 'applied',
        salary: initialData.salary || '',
        location: initialData.location || '',
        jobUrl: initialData.jobUrl || '',
        appliedDate: formattedDate,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        company: '',
        role: '',
        stage: 'applied',
        salary: '',
        location: '',
        jobUrl: '',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id || initialData?._id
    });
  };

  const handleDelete = () => {
    if (isEditMode && onDelete) {
      onDelete(initialData.id || initialData._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111118] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800/80 flex items-center justify-between bg-[#14141f]">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {isEditMode ? 'Edit Application' : 'Add New Job Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className={`w-full bg-[#181824] border ${
                  errors.company ? 'border-red-500' : 'border-gray-800 focus:border-indigo-500'
                } rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors`}
              />
              {errors.company && <p className="text-[10px] text-red-400 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer"
                className={`w-full bg-[#181824] border ${
                  errors.role ? 'border-red-500' : 'border-gray-800 focus:border-indigo-500'
                } rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors`}
              />
              {errors.role && <p className="text-[10px] text-red-400 mt-1">{errors.role}</p>}
            </div>
          </div>

          {/* Stage & Applied Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
              >
                <option value="applied">Applied</option>
                <option value="oa">OA / Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Applied Date
              </label>
              <input
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Salary
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $120k / ₹15 LPA"
                className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Remote"
                className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              Job URL
            </label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="e.g. https://careers.google.com/jobs/..."
              className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add key notes, referral info, interview prep details..."
              className="w-full bg-[#181824] border border-gray-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-800 text-gray-300 hover:bg-gray-800 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
              >
                {isEditMode ? 'Save Changes' : 'Create Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
