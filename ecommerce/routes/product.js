const express = require('express')
const router = express.Router()

const {create, productById,read,remove,update,list,listRelated} = require("../controllers/product.js");
const {requireSignIn, isAdmin, isAuth} = require("../controllers/auth.js");
const {userById} = require("../controllers/user.js");



//CRUD....Create, Read, Update , Delete
router.post("/product/create/:userId",requireSignIn, isAdmin,isAuth, create);
router.get("/product/:productId", read)
router.put("/product/:productId/:userId", requireSignIn, isAdmin,isAuth,update);
router.delete("/product/:productId/:userId", requireSignIn, isAdmin,isAuth,remove);
router.get("/products", list);
router.get("/products/related/:productId", listRelated)



router.param("userId", userById);
router.param("productId", productById);






module.exports = router;