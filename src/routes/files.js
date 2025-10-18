const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFile,
  deleteFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect); // All routes protected

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

module.exports = router;