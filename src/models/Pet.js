const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  petName: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  healthStatus: {
    type: String,
    required: true
  },
  vaccinationStatus: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  adoptionFee: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'adopted'],
    default: 'available'
  }
}, {
  timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
