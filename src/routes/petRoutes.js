const express = require('express');
const router = express.Router();
const { getPets, getPetById, createPet, updatePet, deletePet, getMyListings } = require('../controllers/petController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getPets)
  .post(protect, createPet);

router.get('/my-listings', protect, getMyListings);

router.route('/:id')
  .get(protect, getPetById)
  .put(protect, updatePet)
  .delete(protect, deletePet);

module.exports = router;
