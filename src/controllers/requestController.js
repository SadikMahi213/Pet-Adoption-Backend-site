const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');

// @desc    Create an adoption request
// @route   POST /api/requests
// @access  Private
const createAdoptionRequest = async (req, res) => {
  try {
    const { petId, message, pickupDate } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Owner cannot adopt their own pet
    if (pet.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot adopt your own pet' });
    }

    // Check if user already requested this pet
    const existingRequest = await AdoptionRequest.findOne({ pet: petId, requester: req.user._id });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested to adopt this pet' });
    }

    const request = new AdoptionRequest({
      pet: petId,
      requester: req.user._id,
      petOwner: pet.user,
      pickupDate,
      message
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's adoption requests (My Requests)
// @route   GET /api/requests/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ requester: req.user._id })
      .populate('pet', 'petName status imageURL');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests received for user's pets
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ petOwner: req.user._id })
      .populate('pet', 'petName imageURL adoptionFee')
      .populate('requester', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PUT /api/requests/:id/status
// @access  Private (Pet Owner only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AdoptionRequest.findById(req.params.id).populate('pet');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the pet owner
    if (request.petOwner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this request' });
    }

    // If already approved/rejected, cannot change
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = status;
    await request.save();

    if (status === 'approved') {
      // Mark pet as adopted
      const pet = await Pet.findById(request.pet._id);
      pet.status = 'adopted';
      await pet.save();

      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        { pet: request.pet._id, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an adoption request
// @route   DELETE /api/requests/:id
// @access  Private (Requester only)
const deleteRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is the requester
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this request' });
    }

    await request.deleteOne();
    res.json({ message: 'Request cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdoptionRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest
};
