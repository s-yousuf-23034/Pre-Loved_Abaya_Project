const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";
const fs = require('fs');
const nodemailer = require("nodemailer"); //for random string to generate token we use nodemailer
const randomstring = require("randomstring");




const isEmailValid = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Password pattern: At least 8 characters, one uppercase, one lowercase, one digit, and one special character (@ or ?)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@?])[A-Za-z\d@?]{8,20}$/;
    return passwordRegex.test(password);
  };
  
  


const signup = async (req, res) =>{
    // res.send("From SignUp") 

     const {username, email, password, role} = req.body;
     try {
        if (!isEmailValid(email)) {
            return res.status(400).json({ message: "Invalid email format" });
          }
      
          if (!isPasswordValid(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and at least one letter and one number and one special character" });
          }
          const existingUser = await userModel.findOne({ email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

         
        const hashedPassword = await bcryptjs.hash(password, 10);

          const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            role: role,
        });

         const token = jwt.sign({email : result.email, id : result._id, role: result.role }, SECRET_KEY);
         res.status(201).json({user: result, token: token});
        
     } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong in Signing Up"});
     }

}

const signin = async (req, res)=>{
    // res.send("From SignIn")
    
     const {email, password} = req.body;

     try {
        if (!isEmailValid(email)) {
            return res.status(400).json({ message: "Invalid email format" });
          }
        
        const existingUser = await userModel.findOne({ email : email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }

        const matchPassword = await bcryptjs.compare(password, existingUser.password);

        if(!matchPassword){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email, id : existingUser._id }, SECRET_KEY);
        res.status(200).json({user: existingUser, token: token});


    } catch (error) {
      console.error(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, contactNumber, username } = req.body;
  try { 
  if (!firstName || !lastName || !username) {
    return res.status(400).json({ message: 'First name and last name cannot be null' });
  }
  
  if (firstName.length < 3 || lastName.length < 3) {
    return res.status(400).json({ message: 'First name and last name should contain at least 3 characters.' });
  }

  if (contactNumber) {
    const phoneRegex = /^\+923[0-9]{9}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({ message: 'Invalid contact number' });
    }
  }

    if (req.file) {
      console.log('Uploaded file:', req.file);
      // Read the image file and convert it to binary data
      const userImage = fs.readFileSync(req.file.path);
    
      const updatedFields = {
        username,
        firstName,
        lastName,
        userImage,
        contactNumber,
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedFields, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      } 

      res.status(200).json(updatedUser);
    } else {
      const updatedFields = {
        username,
        firstName,
        lastName,
        contactNumber,
      };

      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedFields, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while updating the user profile' });
  }
} 

const getUserProfile = async (req, res) => {
  try{
    const userId = req.userId;
    const userProfile = await userModel.findById(userId);

    if(!userProfile){
      return res.status(404).json({ message: 'User profile not found' });
    }
     // Return the user's profile
     res.status(200).json(userProfile);

  } catch (error){
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while fetching the user profile' });
  }
}

const forgotPassword = async (req, res) => {
  try{
    const userData = await userModel.findOne({email: req.body.email});
    

  } catch (error){

  }
}

module.exports = { signup, signin, updateUserProfile, getUserProfile };  