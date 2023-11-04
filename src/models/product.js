const mongoose = require('mongoose');

const ProductSizes = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
};

const ProductConditions = {
  NEW: "New",
  LIKE_NEW: "Like New",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
};

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productImages: {
    type: Array, 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: Object.values(ProductSizes),
    required: true,
  },
  condition: {
    type: String,
    enum: Object.values(ProductConditions),
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const productModel = mongoose.model("Product", ProductSchema);

module.exports = {
  ProductSizes,
  ProductConditions,
  productModel,
};