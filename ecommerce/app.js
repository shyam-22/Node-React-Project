const express= require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


require('dotenv').config()

//import all routes file below here
const userRoutes = require(`./routes/user.js`)

//app
const app=express()

//db connection
mongoose
    .connect(process.env.DATABASE,{useNewUrlParser: true, useCreateIndex: true})
    .then( () => console.log(`connected to db`));
    //.catch( error => console.log(`something went wrong ${error.message}`))


//middleawares
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())


//routes middleware
app.use("/api",userRoutes);



const port = process.env.PORT || 8000;



app.listen(port, () => { console.log(`server is running on port ${port}`);
    
});