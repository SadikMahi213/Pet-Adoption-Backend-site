const mongoose = require('mongoose');

const adoptionRequestSchema = mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Pet'
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  petOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  pickupDate: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);
module.exports = AdoptionRequest;
