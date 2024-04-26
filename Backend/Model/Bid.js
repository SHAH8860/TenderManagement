const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  time: { type: Date, required: true },
  cost: { type: Number, required: true },
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender' },
});

const Bid = mongoose.model('Bid', BidSchema)
module.exports=Bid