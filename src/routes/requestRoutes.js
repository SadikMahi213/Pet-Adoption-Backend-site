const express = require('express');
const router = express.Router();
const { 
  createAdoptionRequest, 
  getMyRequests, 
  getReceivedRequests, 
  updateRequestStatus, 
  deleteRequest 
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createAdoptionRequest);

router.get('/my-requests', protect, getMyRequests);
router.get('/received', protect, getReceivedRequests);

router.route('/:id/status')
  .put(protect, updateRequestStatus);

router.route('/:id')
  .delete(protect, deleteRequest);

module.exports = router;
