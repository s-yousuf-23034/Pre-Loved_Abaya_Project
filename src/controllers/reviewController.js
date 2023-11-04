const express = require('express');
const reviewModel = require('../models/review');
const userModel = require("../models/user");
const productModel = require("../models/product");

const createProductReview = async (req, res) => {
    const userId = req.userId;
    const productId = req.productId;
    const hasPurchased = checkUserPurchase(userId, productId);
        if (hasPurchased) {
            const { rating, title, reviewText } = req.body; 

            // Create a new review
    const review = new reviewModel({
        abayaId: productId,
        userId: userId,
        rating: rating,
        title: title,
        review: reviewText,
      });

       try {
      // Save the review to the database
      const savedReview = await review.save();

      res.status(201).json({ message: 'Review saved successfully', review: savedReview });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while saving the review.' });
    }
  } else {
    // Return an error message indicating that the user needs to purchase the product
    res.status(403).json({ message: 'You need to purchase the product before leaving a review.' });
  }
};

async function checkUserPurchase(userId, productId) {
    try {
      // Here, you would typically query your database to check if the user has purchased the product.
      // You need to implement this logic based on your data structure.
      const user = await userModel.findById(userId);
      const product = await productModel.findById(productId);
  
      if (user && product) {
        // Check if the user has a record of purchasing the product
        // Return true if the purchase is found, else return false
        // You may need to add your own logic for tracking purchases.
        return user.purchases.includes(productId);
      }
  
      return false;
    } catch (error) {
      console.error('Error checking user purchase:', error);
      return false;
    }
  }
  
  module.exports = {
    createProductReview,
  };