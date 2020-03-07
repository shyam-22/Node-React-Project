const express = require('express')
const router = express.Router()

const {signup,signIn,signOut} = require("../controllers/auth.js");
//const {signIn} = require("../controllers/user.js");
//const {signOut} = require("../controllers/user.js");
//const {requireSignIn} = require("../controllers/user.js")

const {userSignupValidator} = require('../Validator/signup_Validator.js')

router.post("/signup", userSignupValidator, signup);
router.post("/signIn", signIn);
router.get("/signOut", signOut);

//router.get("/hello",requireSignIn);


module.exports = router;