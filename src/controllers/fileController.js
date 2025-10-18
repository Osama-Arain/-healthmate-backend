const File = require('../models/File');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { fileType, reportDate } = req.body;

    // Convert buffer to stream for Cloudinary
    const bufferStream = Readable.from(req.file.buffer);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'healthmate_reports',
          resource_type: 'auto',
          type: "upload", // public delivery
          access_mode: "public"  // 👈 Add this
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Save file info to database
    const file = await File.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: fileType || 'other',
      reportDate: reportDate || Date.now(),
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: file
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all files for user
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ reportDate: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single file
exports.getFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Delete from database
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};