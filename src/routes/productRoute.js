const express = require("express");
const auth = require("../middlewares/auth");
const productRouter = express.Router();
const {getProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
     searchProducts} = require("../controllers/productController");
const userModel = require('../models/user');
const {addToCart, removeFromCart, getUserCart, calculateTotalPrice} = require('../controllers/cartController')
const {createProductReview} = require('../controllers/reviewController');
const {
    placeOrder,
    updateOrder,
    getOrderDetails,
    getOrderHistory
} = require("../controllers/orderController");

const orderRouter = express.Router();

const upload = require("../productMulterConfig");
const bodyParser = require("body-parser");
// const objectId = mongoose.Types.ObjectId(); // Generate a new ObjectID

productRouter.use(bodyParser.json());


//restriction for user role
const checkRole = (roles) => {
    return async (req, res, next) => {
        try{
            const user = await userModel.findById(req.userId);
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
    
            if(roles.includes(user.role)){
                next();
            }
            else{
                return res.status(403).json({message: "Access denied. You donot have a permission to access this action."})
            }

        }catch(error){
            console.error(error)
            res.status(500).json({message: "Something went wrong while checking user role"})
        }


    };
};

productRouter.get("/", auth, getProducts);
productRouter.get("/product-details/:productId", auth, getProductDetails);

productRouter.post("/create-product", auth, checkRole(["seller"]),upload.array('productImages', 3), createProduct);

productRouter.delete("/delete-product/:id", auth, checkRole(["seller"]), deleteProduct);
productRouter.get("/search-products", searchProducts);

productRouter.put("/update-product/:id", auth, checkRole(["seller"]), updateProduct);

//add to cart
productRouter.post('/add-to-cart/:productId', auth, addToCart);
productRouter.delete('/remove-from-cart/:productId', auth, removeFromCart);
productRouter.get('/cart', auth, getUserCart);
productRouter.get('/cart/total-price', auth, calculateTotalPrice);


//review
productRouter.post('/reviews/leave', createProductReview)


//order
productRouter.post('/add-to-cart/place-order', auth, placeOrder);
productRouter.put('/add-to-cart/update-order', auth, updateOrder);
productRouter.get('/order/:orderId', auth, getOrderDetails);
productRouter.get('/order-history', auth, getOrderHistory);
module.exports = productRouter;