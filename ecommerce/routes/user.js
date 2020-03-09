const express = require('express')
const router = express.Router()

const {requireSignIn, isAdmin, isAuth} = require("../controllers/auth.js")


const {userById,read,update} = require("../controllers/user.js");
//const {signIn} = require("../controllers/user.js");
//const {signOut} = require("../controllers/user.js");
//const {requireSignIn} = require("../controllers/user.js")

router.get("/secret/:userId", requireSignIn,isAuth,isAdmin, (req,res) => {
    res.json({ user: req.profile });
});


//user Profile read and update
router.get("/user/:userId", requireSignIn,isAuth,read);
router.put("/user/:userId", requireSignIn,isAuth,update);


router.param("userId", userById);


module.exports = router;