const User = require("../schema_models/userSchema.js")

//1)Find User Profile by ID
exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user) => {
        if(err || !user)
        {
            return res.status(400).json({error : "user not found"});
        }
        req.profile = user;
        next();

    });
};
//2)Read the User Profile
exports.read = (req,res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);

};

//3)update the User profile
exports.update = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id}, 
        {$set : req.body}, 
        {new : true},
        (err,user) => {
            if(err)
            {
            return res.status(400).json({error : "You are not Autharised to perform this action"});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
        
};