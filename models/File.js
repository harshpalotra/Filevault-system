import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: String,
  storageName: String,
  path: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

export const File = mongoose.model('File', fileSchema);
