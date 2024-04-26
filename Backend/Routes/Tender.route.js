const express = require('express');
const router = express.Router();
const Tender = require('../Model/Tender')

// Get all tenders
router.get('/', async (req, res) => {
  try {
    const tenders = await Tender.find().populate('bids');
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new tender
router.post('/', async (req, res) => {
  const tender = new Tender({
    name: req.body.name,
    description: req.body.description,
    start: req.body.start,
    end: req.body.end,
    buffertime: req.body.buffertime,
  });

  try {
    const newTender = await tender.save();
    res.status(201).json(newTender);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a tender by ID
router.get('/:id', getTender, (req, res) => {
  res.json(res.tender);
});

// Update a tender by ID
router.patch('/:id', getTender, async (req, res) => {
  if (req.body.name != null) {
    res.tender.name = req.body.name;
  }

  if (req.body.description != null) {
    res.tender.description = req.body.description;
  }

  if (req.body.startTime != null) {
    res.tender.startTime = req.body.startTime;
  }

  if (req.body.endTime != null) {
    res.tender.endTime = req.body.endTime;
  }

  if (req.body.bufferTime != null) {
    res.tender.bufferTime = req.body.bufferTime;
  }

  try {
    const updatedTender = await res.tender.save();
    res.json(updatedTender);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a tender by ID
router.delete('/:id', getTender, async (req, res) => {
  try {
    await res.tender.remove();
    res.json({ message: 'Deleted Tender' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTender(req, res, next) {
  let tender;
  try {
    tender = await Tender.findById(req.params.id);
    if (tender == null) {
      return res.status(404).json({ message: 'Cannot find tender' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.tender = tender;
  next();
}
module.exports = router;
