const formidable = require('formidable');
const _ = require("lodash"); //for update the product ....extend()
const fs = require("fs");

const {errorHandler} = require('../Helpers/DbEroor_Message.js');


const Product = require("../schema_models/product.js");

//1) Create a product
exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req, (err,fields, files)=> {
        if(err)
        {
            return res.status(400). json({error : "image could not be uploaded"});
        }

        //Validation : Now check for all fields 
        const {name, description,price, category, quantity,shipping} = fields;
        if(!name ||  !description ||  !price ||  !category ||  !quantity ||  !shipping)
        {
            return res.status(400). json({error : "sorry....!all fields are required"});

        }

        let product = new Product(fields);
        //Validation : restrict user to upload the image within size...1 KB =1ooo, 1 MB = 100000

        if(files.photo)
        {
            //console.log("FILES PHOTO : ", files.photo);
            if(files.photo.size > 200000)
            {
            return res.status(400). json({error : "image should be upto 2MB size "});
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err,result) => {
            if(err)
            {
                return res.status(400). json({error : errorHandler(err)})
            }
            res.json(result);
        });
    });
};

//2)Fetch product by the id
exports.productById = (req, res,next, id) => {
    Product.findById(id).exec( (err,product) => {
        if(err || !product)
        {
            return res.status(400). json({error : "sorry...!.....Product not found"});
        }
        req.product = product
        next();

    });
};

//3)Read the product
exports.read = (req,res) => {
    req.product.photo = undefined;
    return res.status(400).json(req.product);
}

//4) Deleting the product
exports.remove = (req,res) =>{
    let product = req.product
    product.remove( (err,deletedProduct) => {
        if(err)
        {
        return res.status(400). json({error : errorHandler(err)});
        }
        res.json({"message" : "Product deleted sucessfully"});

    })
}

//5)update the product
exports.update = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req, (err,fields, files)=> {
        if(err)
        {
            return res.status(400). json({error : "image could not be uploaded"});
        }

        //Validation : Now check for all fields 
        const {name, description,price, category, quantity,shipping} = fields;
        if(!name ||  !description ||  !price ||  !category ||  !quantity ||  !shipping)
        {
            return res.status(400). json({error : "sorry....!all fields are required"});

        }

        let product = req.product
        product = _.extend(product,fields);
        //Validation : restrict user to upload the image within size...1 KB =1ooo, 1 MB = 100000

        if(files.photo)
        {
            //console.log("FILES PHOTO : ", files.photo);
            if(files.photo.size > 200000)
            {
            return res.status(400). json({error : "image should be upto 2MB size "});
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err,result) => {
            if(err)
            {
                return res.status(400). json({error : errorHandler(err)})
            }
            res.json(result);
        });
    });
};
//-------------------------------------------------------------------------------------------------------------
//Product sell //New Arrival ..................return to the front-End client....we can display most popular product

//6)By sell = /product?sortBy = sold & Order = desc&Limit=4.....Query
//if no params are send, then all products are return
exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 7;

    Product.find()
            .select("-photo")
            .populate("Category")
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,products) => {
                if(err)
                {
                    return res.status(400).json({error : "Product not found"});
                }
                res.json(products);
            });

};
//7)By Arrival = /product?sortBy = CreatedAt & Order = desc&Limit=4
//if no params are send, then all products are return

//8) List Related Product..........................it will the find the product based on product category
//others product that has same category ......will be returned
exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 7;

    Product.find({_id : {$ne : req.product}, category: req.product.category })
            .limit(limit)
            .populate("Category", "_id name")
            .exec((err,products) => {
                if(err)
                {
                    return res.status(400).json({error : "Product not found"});
                }
                res.json(products);
            });
}; 


//9) List Related category..........................it will the find the product based on product category
//others product that has same category ......will be returned
exports.listCategory = (req,res) =>{
    Product.distinct("category", {}, (err,category) => {
        if(err)
        {
            return res.status(400).json({error : "category not found"});
        }
        res.json(category);
    });
};


    /**
     * list products by search
     * we will implement product search in react frontend
     * we will show categories in checkbox and price range in radio buttons
     * as the user clicks on those checkbox and radio buttons
     *    | |  |   |   |   | | | 
     * we will make api request and show the products to users based on what he wants
     */
     
    // route - make sure its post
    //router.post("/products/by/search", listBySearch);
     
    exports.listBySearch = (req, res) => {
        let order = req.body.order ? req.body.order : "desc";
        let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
     
        // console.log(order, sortBy, limit, skip, req.body.filters);
        // console.log("findArgs", findArgs);
     
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === "price") 
                {
                    findArgs[key] = 
                    {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } 
                else 
                {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }
     
        Product.find(findArgs)
            .select("-photo")
            .populate("Category")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, data) => {
                if (err) 
                {
                    return res.status(400).json({error: "Products not found"});
                }
                res.json({size: data.length,data});
            });
    };

    //10) Bring a photo based on the Product ID
    
    exports.photo = (req,res,next) => {
        if(req.product.photo.data)
        {
            res.set("Content-Type",req.product.photo.contentType)
            return res.send(req.product.photo.data)
        }
        next();
    }

