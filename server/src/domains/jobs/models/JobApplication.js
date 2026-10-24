import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  stage: { 
    type: String, 
    enum: ['applied', 'oa', 'interview', 'offer', 'rejected'], 
    default: 'applied' 
  },
  salary: { type: String, default: '' },
  location: { type: String, default: '' },
  jobUrl: { type: String, default: '' },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  history: [
    {
      stage: { type: String, required: true },
      movedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export const JobApplicationModel = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
export default JobApplicationModel;
