const express= require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
cosnt cors = require('cors')


require('dotenv').config()

//import all routes file below here
const authRoutes = require(`./routes/auth.js`);
const userRoutes = require(`./routes/user.js`);
const categoryRoutes = require(`./routes/category.js`);
const productRoutes = require(`./routes/product.js`);




//app
const app=express()

//db connection
mongoose
    .connect(process.env.DATABASE,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology : true})
    .then( () => console.log(`connected to db`));
    //.catch( error => console.log(`something went wrong ${error.message}`))


//middleawares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());



//routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);






const port = process.env.PORT || 8000;



app.listen(port, () => { console.log(`server is running on port ${port}`);
    
});