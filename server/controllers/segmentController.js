const Segment = require('../models/Segment');

// @desc    Get all segments
// @route   GET /api/segments
// @access  Private
exports.getSegments = async (req, res, next) => {
  try {
    const segments = await Segment.find().sort({ isDefault: -1, name: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Segments retrieved successfully',
      data: segments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new segment
// @route   POST /api/segments
// @access  Private
exports.createSegment = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const existing = await Segment.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Segment already exists' });
    }

    const segment = await Segment.create({
      name,
      color,
      isDefault: false
    });

    res.status(201).json({
      success: true,
      message: 'Segment created successfully',
      data: segment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a segment
// @route   PUT /api/segments/:id
// @access  Private
exports.updateSegment = async (req, res, next) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({ success: false, error: 'Segment not found' });
    }

    const updatedSegment = await Segment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Segment updated successfully',
      data: updatedSegment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a segment
// @route   DELETE /api/segments/:id
// @access  Private
exports.deleteSegment = async (req, res, next) => {
  try {
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res.status(404).json({ success: false, error: 'Segment not found' });
    }

    if (segment.isDefault) {
      return res.status(400).json({ success: false, error: 'Cannot delete default segments' });
    }

    await segment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Segment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
