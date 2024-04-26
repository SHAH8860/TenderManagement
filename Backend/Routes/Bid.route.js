const express = require('express');
const router = express.Router();
const Bid = require('../Model/Bid');
const Tender = require('../Model/Tender')

// Get all bids
router.get('/', async (req, res) => {
  try {
    const bids = await Bid.find().sort({ cost: 1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new bid
router.post('/', async (req, res) => {
  const bid = new Bid({
    companyName: req.body.companyName,
    time: req.body.time,
    cost: req.body.cost,
    tender: req.body.tender,
  });

  try {
    const newBid = await bid.save();
    await checkAndExtendTenderEndTime(req.body.tenderId);
    res.status(201).json(newBid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a bid by ID
router.get('/:id', getBid, (req, res) => {
  res.json(res.bid);
});

// Update a bid by ID
router.patch('/:id', getBid, async (req, res) => {
  if (req.body.companyName != null) {
    res.bid.companyName = req.body.companyName;
  }

  if (req.body.time != null) {
    res.bid.time = req.body.time;
  }

  if (req.body.cost != null) {
    res.bid.cost = req.body.cost;
  }

  if (req.body.tender != null) {
    res.bid.tender = req.body.tender;
  }

  try {
    const updatedBid = await res.bid.save();
    res.json(updatedBid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a bid by ID
router.delete('/:id', getBid, async (req, res) => {
  try {
    await res.bid.remove();
    res.json({ message: 'Deleted Bid' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBid(req, res, next) {
  let bid;
  try {
    bid = await Bid.findById(req.params.id);
    if (bid == null) {
      return res.status(404).json({ message: 'Cannot find bid' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.bid = bid;
  next();
}
async function checkAndExtendTenderEndTime(tenderId) {
    const tender = await Tender.findById(tenderId);
    if (!tender) {
        return;
    }

    const currentTime = new Date();
    const endTime = tender.endTime;
    const bufferTime = tender.bufferTime;

    if (endTime - currentTime <= 5 * 60 * 1000) { // Check if less than 5 minutes remaining
        tender.endTime = new Date(endTime.getTime() + bufferTime * 60 * 1000); // Extend end time
        await tender.save();
    }
}
module.exports = router;
