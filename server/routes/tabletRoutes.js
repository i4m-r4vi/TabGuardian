const express = require('express');
const router = express.Router();
const tabletController = require('../controllers/tabletController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/add', authMiddleware, tabletController.addTablet);
router.get('/list', authMiddleware, tabletController.getTablets);
router.delete('/:id', authMiddleware, tabletController.deleteTablet);
router.post('/upload-proof', authMiddleware, upload.single('image'), tabletController.uploadProof);
router.get('/today-logs', authMiddleware, tabletController.getTodayLogs);
router.get('/list-history', authMiddleware, tabletController.getAllLogs);
router.delete('/history/report-and-clear', authMiddleware, tabletController.reportAndClearHistory);

module.exports = router;
