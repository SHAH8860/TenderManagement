const mongoose = require('mongoose');
const TenderSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        
    },
    start:{
        type:Date,
        required:true
        
    },
    end:{
        type:Date,
        required:true
        
    },
    buffertime:{
        type:Number
    },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
    


})
 const Tender=new mongoose.model("Tender",TenderSchema)
module.exports=Tender
