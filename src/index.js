const express = require ("express"); //import express
const app = express() //app obj
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require('mongoose');


const userRouter = require("./routes/userRoutes");

const productRouter = require("./routes/productRoute");

app.use(express.json());
app.use(cors());

//routes
app.use("/users", userRouter);
app.use("/products", productRouter)


app.get("/", (req, res) => {
    res.send("Welcome to PreLoved Abaya store :) ")
});

const PORT = process.env.PORT || 5000;

//connet to the server
 mongoose.connect("mongodb+srv://admin:saba@cluster0.uczgtiw.mongodb.net", { useNewUrlParser: true,
 useUnifiedTopology: true}) 
.then(()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT, ()=> {
        console.log("Server Started")

    });

}).catch((error) => {
    console.log(error);
})




