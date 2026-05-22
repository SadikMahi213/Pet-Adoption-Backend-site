const Pet = require('../models/Pet');
const AdoptionRequest = require('../models/AdoptionRequest');

// @desc    Get all pets (with search and filter)
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
  try {
    const { name, species } = req.query;
    let query = { status: 'available' }; // Only show available pets to public

    if (name) {
      query.petName = { $regex: name, $options: 'i' };
    }
    
    if (species) {
      const speciesArray = species.split(',');
      query.species = { $in: speciesArray };
    }

    const pets = await Pet.find(query).populate('user', 'name email');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Private (as per requirements)
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('user', 'name email');
    
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private
const createPet = async (req, res) => {
  try {
    const {
      petName, species, breed, age, gender, imageURL, 
      healthStatus, vaccinationStatus, location, adoptionFee, description
    } = req.body;

    const pet = new Pet({
      user: req.user._id,
      ownerEmail: req.user.email,
      petName,
      species,
      breed,
      age,
      gender,
      imageURL,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee,
      description
    });

    const createdPet = await pet.save();
    res.status(201).json(createdPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private (Owner only)
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      // Check if user is owner
      if (pet.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this pet' });
      }

      pet.petName = req.body.petName || pet.petName;
      pet.species = req.body.species || pet.species;
      pet.breed = req.body.breed || pet.breed;
      pet.age = req.body.age || pet.age;
      pet.gender = req.body.gender || pet.gender;
      pet.imageURL = req.body.imageURL || pet.imageURL;
      pet.healthStatus = req.body.healthStatus || pet.healthStatus;
      pet.vaccinationStatus = req.body.vaccinationStatus || pet.vaccinationStatus;
      pet.location = req.body.location || pet.location;
      pet.adoptionFee = req.body.adoptionFee || pet.adoptionFee;
      pet.description = req.body.description || pet.description;

      const updatedPet = await pet.save();
      res.json(updatedPet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private (Owner only)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      if (pet.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this pet' });
      }
      
      // Delete associated adoption requests
      await AdoptionRequest.deleteMany({ pet: req.params.id });

      await pet.deleteOne();
      res.json({ message: 'Pet removed' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's listed pets (My Listings)
// @route   GET /api/pets/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user._id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getMyListings
};
