const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String,
        country: String,
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            enum: ["online", "cash"], // Allowed values: "online" or "cash"
            required: true, // Payment method is required
        },
        cardNumber: String,
    },
});

module.exports = mongoose.model("Order", OrderSchema);