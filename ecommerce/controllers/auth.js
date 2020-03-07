
const User = require('../schema_models/userSchema.js')
const jwt = require('jsonwebtoken') // to generate signed token
const expressJwt = require('express-jwt') //for authorization check

const {errorHandler} = require('../Helpers/DbEroor_Message.js')

exports.signup = (req,res) => {
     console.log("req.body", req.body);
     
    const user = new User(req.body);
    user.save((err,user) => {
        if(err)
        {
            return res.status(400).json({err : errorHandler(err)});

        }

        user.salt = undefined
        user.hashed_password = undefined

        res.json({user});

    });
}

exports.signIn = (req,res) => {
    //fiNd the user base on email-id

    const{email,password} = req.body;
    User.findOne({email},(err,user) => {
        if(err || !user)
        {
            return res.status(400).json({err: "user does not exist....plzz signup first"});
        }  

        //else authenticate the user.....user found means email-password match
        //create authenticate method in user model
        //generate the signed token with user-id and secret

        if(!user.authenticate(password))
        {
            return res.status(401).json({err: "email and password does not match"});
        }
        
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)
             //here we persist the token as "t" in cookie with expiry date
        res.cookie('t',token,{expire: new Date() + 9999})
            //return response with user and token to frontend user
        const {_id,name,email,role} = user
        return res.json({token,user : {_id,name,email,role}})
    });

};

exports.signOut = (req,res) => {
    res.clearCookie("t");
    res.json({message : "signOut successfully"});
};

//protecting routs
//only sign in user will have access

exports.requireSignIn = expressJwt({

    secret : process.env.JWT_SECRET,
    userProperty : "auth"
});


//this is for the user 
//user authentication-------isAuth middleware
exports.isAuth =(req,res,next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user)
    {
        return res.status(403).json({error : "Access denied"});
    }
    next();
};

//this is for the admin 
//admin authentication------isAdmin middleware
exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0)
    {
        return res.status(403).json({error : "Sorry u r not an admin...!Access denied"});
    }
    next();
};