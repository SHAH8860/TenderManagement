
require('dotenv').config()
const express = require('express')
const app = express()
const port=process.env.PORT||5000
const mongoose=require("mongoose")
const  bodyParser = require('body-parser');
const cors=require("cors")
const tender=require('./Routes/Tender.route')
const bid=require('./Routes/Bid.route')
mongoose.connect("mongodb://localhost:27017/Tender").then(()=>{
  console.log("Connected to database")
}).catch((error)=>{
  console.log("Error",error)
})
app.use(
  express.urlencoded({ extended: true })
);
app.use(bodyParser.json())
app.use(cors())
app.use('/tender',tender)
app.use('/bid',bid)
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})