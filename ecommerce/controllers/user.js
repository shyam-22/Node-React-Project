const User = require("../schema_models/userSchema.js")


exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user) => {
        if(err || !user)
        {
            return res.status(400).json({error : "user not found"});
        }
        req.profile = user;
        next();

    })
}