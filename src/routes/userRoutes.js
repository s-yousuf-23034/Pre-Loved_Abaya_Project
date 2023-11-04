const express = require("express");
const auth = require("../middlewares/auth");
const { signup, signin, updateUserProfile, getUserProfile } = require("../controllers/userController");
const userRouter = express.Router();
const upload = require("../userMulterConfig");
const bodyParser = require("body-parser");


userRouter.use(bodyParser.json());
//userRouter.use(bodyParser.urlencoded({ encoded: false}))


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post('/signin/update-profile',auth, upload.single('userImage'),  updateUserProfile)
userRouter.get('/signin/get-profile', auth, getUserProfile);
module.exports = userRouter;