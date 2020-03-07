const express = require('express')
const router = express.Router()

const {create,categoryById,read,update,remove,list} = require("../controllers/category.js");
const {requireSignIn, isAdmin, isAuth} = require("../controllers/auth.js");
const {userById} = require("../controllers/user.js");



//CRUD  operations....Create, Read, Update , Delete

router.post("/category/create/:userId",requireSignIn, isAdmin,isAuth, create);
router.get("/category/:categoryId",read);
router.put("/category/:categoryId/:userId",requireSignIn, isAdmin,isAuth,update);
router.delete("/category/:categoryId/:userId", requireSignIn, isAdmin,isAuth, remove);
router.get("/categories",list);


router.param("userId", userById);
router.param("categoryId", categoryById);




module.exports = router;