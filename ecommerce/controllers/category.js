const Category = require("../schema_models/category.js");
const {errorHandler} = require('../Helpers/DbEroor_Message.js');




//1)Create a category
exports.create = (req,res) => {
    const category = new Category (req.body)
    category.save((err,data) => {
            if(err)
            {
                return res.status(400). json({error : errorHandler(err) })
            }
            res.json({data});
    });
};

//2)Fetch category By Id
exports.categoryById = (req,res,next,id) =>{
    Category.findById(id).exec((err,category) => {
        if(err || !category)
        {
            return res.status(400).json({error : "sorry...!!!....category not found"});
        }
        req.category = category;
        next();
    })
}

//3) Read the category
exports.read = (req,res) => {
    return res.json(req.category);
}

//4) Update the category
exports.update = (req,res) =>{
    const category = req.category
    category.name =req.body.name
    category.save((err,data) => {
        if(err)
        {
            return res.status(400).json({error : errorHandler(err)});
        }
        res.json(data);
    });
};

//5)delete an category 
exports.remove = (req,res) =>{
    const category = req.category
    category.remove((err,data) => {
        if(err)
        {
            return res.status(400).json({error : errorHandler(err)});
        }
        res.json({message : "category deleted successfully"});
    });
};


//6)List of category
exports.list = (req,res) =>{
    Category.find().exec((err,data) => {
        if(err)
        {
            return res.status(400).json({error : errorHandler(err)});
        }
        res.json(data);
    });
};