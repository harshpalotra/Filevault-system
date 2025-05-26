import mongoose from 'mongoose';


const auditLogSchema = new mongoose.Schema({
  action: { type: String, enum: ['upload', 'download'], required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
