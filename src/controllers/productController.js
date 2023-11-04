const {productModel, ProductSizes, ProductConditions} = require("../models/product");
const mongoose = require('mongoose');

const createProduct = async (req, res) =>{
    try {
        const {productName, description, price, size, condition} = req.body;

    if (!Object.values(ProductSizes).includes(size) || !Object.values(ProductConditions).includes(condition)) {
        return res.status(400).json({ message: "Invalid size or condition" });
    }

    //check if the files were uploaded
    if(!req.files || req.files.length === 0){
        return res.status(400).json({ message: "No product images uploaded" });
    }
    if (req.files.length > 3) {
        return res.status(400).json({ message: "Too many images. Maximum of 3 images allowed" });
      }

    //const productImages = [];
    const productImages = req.files.map((file) => file.filename);


    //process each upload file
    req.files.forEach((file) => {
        productImages.push(file.filename);
    });

    const newProduct = new productModel({
        productName,
        description,
        productImages,
        price,
        size,
        condition,
        seller: req.userId,
    });       
       const savedProduct = await newProduct.save();
       res.status(201).json(savedProduct);

   } catch (error) {
       console.log(error);
       res.status(500).json({message: "Something went wrong in creating the product"});
   }
   
};

const updateProduct = async (req, res) =>{
    const id = req.params.id;
    const {productName, description, productImages, price} = req.body;

    const updatedFields = {
        productName: productName,
        description: description,
        productImages: productImages,
        price: price,
        
    };
   try {
       const updatedProduct = await productModel.findByIdAndUpdate(id, updatedFields, {new : true});
       res.status(200).json(updatedProduct);
       
   } catch (error) {
       console.log(error);
       res.status(500).json({message: "Something went wrong while updating the product"});
   }

}

const deleteProduct = async (req, res) =>{

   const id = req.params.id;
   try {
       
       const product = await productModel.findByIdAndRemove(id);
       res.status(202).json(product);

   } catch (error) {
       console.log(error);
       res.status(500).json({message: "Something went wrong while deleting the product"});
   }
}

//display product
const getProducts = async (req, res) =>{
    try {
       const products = await productModel.find({isDisabled: false}).populate("seller", "username");
       res.status(200).json(products);

    } catch (error) {
       console.log(error);
       res.status(500).json({message: "Something went wrong while retrieving products"});
    }
}

const getProductDetails = async (req, res) => {
    try{
        const productId = req.params.productId;
        console.log('Product ID:', productId);
        // Check if productId is a valid ObjectId before querying the database
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({product})
    } catch (error){
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong while fetching product details' });

    } }

const searchProducts = async (req, res) => {
    try{
        //const { price, condition, size, keywords } = filters
        const filters = req.query;
        const query = {};

        if (filters.price) {
            query.price = parseFloat(filters.price);
        }
        if (filters.condition) {
            query.condition = filters.condition;
        }
        if (filters.size) {
            query.size = filters.size;
        }
        if (filters.keywords) {
            const keywordArray = filters.keywords.toLowerCase().split(' ');
            query.$or = [
                { productName: { $in: keywordArray } },
                { description: { $in: keywordArray } }
            ];
        }

        const products = await productModel.find(query);

        res.json(products);

        
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Something went wrong while searching for products" });

    }

}

module.exports = {
   createProduct,
   updateProduct,
   deleteProduct,
   getProducts, 
   getProductDetails,
   searchProducts,
};