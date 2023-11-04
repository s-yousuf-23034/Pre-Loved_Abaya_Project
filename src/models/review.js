// review.model.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,   
    max: 5,  
  },
  title: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  
},
{timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
