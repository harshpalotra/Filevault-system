import {File} from '../models/File.js';
import {AuditLog} from '../models/AuditLog.js';
import fs from 'fs';

// Upload File Controller
export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, path: filePath } = req.file;

    const file = new File({
      originalName: originalname,
      mimeType: mimetype,
      size,
      filePath,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    });

    await file.save();

    // Create audit log for upload
    await AuditLog.create({
      action: 'upload',
      file: file._id,
      user: req.user._id,
      timestamp: new Date(),
    });

    res.status(201).json({ message: 'File uploaded successfully', fileId: file._id });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const downloadFileController = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increase download count
    file.downloadCount = (file.downloadCount || 0) + 1;
    await file.save();

    // Create audit log for download
    await AuditLog.create({
      action: 'download',
      file: file._id,
      user: req.user._id,
      timestamp: new Date(),
    });

    
    res.download(file.filePath, file.originalName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading file' });
        }
      }
    });
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
