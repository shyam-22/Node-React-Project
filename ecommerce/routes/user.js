const express = require('express')
const router = express.Router()

const {requireSignIn, isAdmin, isAuth} = require("../controllers/auth.js")


const {userById} = require("../controllers/user.js");
//const {signIn} = require("../controllers/user.js");
//const {signOut} = require("../controllers/user.js");
//const {requireSignIn} = require("../controllers/user.js")

router.get("/secret/:userId", requireSignIn,isAuth,isAdmin, (req,res) => {
    res.json({ user: req.profile });
});


router.param("userId", userById);


module.exports = router;