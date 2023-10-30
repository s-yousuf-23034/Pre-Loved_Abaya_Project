const express = require("express");
const auth = require("../middlewares/auth");
const { signup, signin, updateUserProfile } = require("../controllers/userController");
const userRouter = express.Router();


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.put('/signin/update-profile',auth,  updateUserProfile)

module.exports = userRouter;