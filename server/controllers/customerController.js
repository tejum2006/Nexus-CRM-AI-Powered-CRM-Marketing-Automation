const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

// @desc    Get all customers with pagination, sort, search, filter
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sort = '-createdAt', 
      status, 
      segments, 
      tags,
      industry
    } = req.query;

    const query = {};

    // 1. Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Filters
    if (status) query.status = status;
    if (industry) query.industry = industry;
    
    // Convert comma-separated string to array for segments/tags if provided
    if (segments) {
      const segmentsArray = segments.split(',');
      query.segments = { $in: segmentsArray };
    }
    
    if (tags) {
      const tagsArray = tags.split(',');
      query.tags = { $in: tagsArray };
    }

    // Role-based scoping (optional: e.g. Sales Exec only sees their own customers?)
    // Based on user request, Sales Executive manages customers. Let's assume everyone sees all customers for now unless specified otherwise.
    
    // Execute query with pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const customers = await Customer.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    const total = await Customer.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: {
        customers,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer and their activities
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('notes.author', 'name');

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Fetch timeline activities
    const activities = await Activity.find({ customer: req.params.id })
      .sort('-createdAt')
      .limit(50); // Get last 50 activities

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: {
        customer,
        activities
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const customer = await Customer.create(req.body);

    // Log Activity
    await Activity.create({
      type: 'customer_created',
      title: 'Customer Created',
      description: `Customer profile for ${customer.name} was created.`,
      customer: customer._id,
      user: req.user.id,
      userName: req.user.name
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Check if status changed for activity log
    const statusChanged = req.body.status && customer.status !== req.body.status;
    const oldStatus = customer.status;

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Log update activity
    if (statusChanged) {
      await Activity.create({
        type: 'status_changed',
        title: 'Status Updated',
        description: `Status changed from ${oldStatus} to ${customer.status}.`,
        customer: customer._id,
        user: req.user.id,
        userName: req.user.name
      });
    } else {
      await Activity.create({
        type: 'customer_updated',
        title: 'Customer Updated',
        description: `Customer profile was updated.`,
        customer: customer._id,
        user: req.user.id,
        userName: req.user.name
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Delete customer
    await customer.deleteOne();
    
    // Also delete all activities for this customer
    await Activity.deleteMany({ customer: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a note to a customer
// @route   POST /api/customers/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, error: 'Note content is required' });
    }

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const newNote = {
      content,
      author: req.user.id,
      authorName: req.user.name,
    };

    // Add note to array (adds to beginning so newest is first, or we can just push)
    customer.notes.push(newNote);
    await customer.save();

    // Log Activity
    await Activity.create({
      type: 'note_added',
      title: 'Note Added',
      description: `A new note was added.`,
      customer: customer._id,
      user: req.user.id,
      userName: req.user.name
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: customer.notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique tags used across all customers
// @route   GET /api/customers/tags/all
// @access  Private
exports.getTags = async (req, res, next) => {
  try {
    const tagsAggregation = await Customer.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $sort: { _id: 1 } }
    ]);
    
    const tags = tagsAggregation.map(t => t._id);

    res.status(200).json({
      success: true,
      message: 'Tags retrieved successfully',
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export customers to CSV
// @route   GET /api/customers/export
// @access  Private
exports.exportCustomers = async (req, res, next) => {
  try {
    const { search = '', status, segments, tags, industry } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (industry) query.industry = industry;
    if (segments) query.segments = { $in: segments.split(',') };
    if (tags) query.tags = { $in: tags.split(',') };

    const customers = await Customer.find(query).sort('-createdAt');

    // Generate CSV string
    const headers = ['name', 'email', 'phone', 'company', 'industry', 'location', 'status', 'segments', 'tags', 'createdAt'];
    
    // Helper to safely format CSV fields and prevent CSV Injection
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      let str = String(val);
      // Prevent formula injection
      if (/^[=\-+@]/.test(str)) {
        str = "'" + str;
      }
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    let csv = headers.join(',') + '\n';
    
    customers.forEach(customer => {
      const row = [
        escapeCsv(customer.name),
        escapeCsv(customer.email),
        escapeCsv(customer.phone),
        escapeCsv(customer.company),
        escapeCsv(customer.industry),
        escapeCsv(customer.location),
        escapeCsv(customer.status),
        escapeCsv((customer.segments || []).join(';')),
        escapeCsv((customer.tags || []).join(';')),
        escapeCsv(customer.createdAt.toISOString())
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers_export.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Import customers from CSV
// @route   POST /api/customers/import
// @access  Private
exports.importCustomers = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a CSV file' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    
    // Very basic CSV parser
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      return res.status(400).json({ success: false, error: 'CSV file is empty or missing headers' });
    }
    
    // Add row limit
    if (lines.length > 5001) { // 5000 rows + 1 header
      return res.status(400).json({ success: false, error: 'Maximum row limit of 5000 exceeded. Please split your file.' });
    }

    // Parse headers, ignoring quotes
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');

    if (nameIdx === -1 || emailIdx === -1) {
      return res.status(400).json({ success: false, error: 'CSV must contain "name" and "email" columns' });
    }

    let inserted = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];

    // Process rows
    for (let i = 1; i < lines.length; i++) {
      // Basic split that doesn't handle commas inside quotes perfectly, but is lightweight
      // A more robust parser would use regex or a library, but this meets simple requirements
      const rawCols = lines[i].split(',');
      const cols = rawCols.map(c => c.replace(/^"|"$/g, '').trim());
      
      const name = cols[nameIdx];
      // Normalize email
      const email = cols[emailIdx] ? cols[emailIdx].trim().toLowerCase() : '';

      if (!name || !email) {
        failed++;
        errors.push(`Row ${i + 1}: Missing name or email`);
        continue;
      }

      // Build customer object
      const customerData = {
        name,
        email,
        createdBy: req.user.id
      };

      // Map other optional fields if present
      const mapField = (colName, objField) => {
        const idx = headers.indexOf(colName);
        if (idx !== -1 && cols[idx]) {
          customerData[objField] = cols[idx];
        }
      };

      mapField('phone', 'phone');
      mapField('company', 'company');
      mapField('industry', 'industry');
      mapField('location', 'location');
      mapField('status', 'status');

      // Arrays (split by semicolon)
      const segIdx = headers.indexOf('segments');
      if (segIdx !== -1 && cols[segIdx]) {
        customerData.segments = cols[segIdx].split(';').map(s => s.trim()).filter(Boolean);
      }

      const tagIdx = headers.indexOf('tags');
      if (tagIdx !== -1 && cols[tagIdx]) {
        customerData.tags = cols[tagIdx].split(';').map(t => t.trim()).filter(Boolean);
      }

      try {
        // Upsert by email
        const existing = await Customer.findOne({ email });
        
        if (existing) {
          await Customer.findByIdAndUpdate(existing._id, customerData, { runValidators: true });
          updated++;
          
          await Activity.create({
            type: 'customer_updated',
            title: 'Customer Updated via Import',
            description: `Customer profile was updated from CSV import.`,
            customer: existing._id,
            user: req.user.id,
            userName: req.user.name
          });
        } else {
          const newCustomer = await Customer.create(customerData);
          inserted++;
          
          await Activity.create({
            type: 'customer_created',
            title: 'Customer Created via Import',
            description: `Customer profile was created from CSV import.`,
            customer: newCustomer._id,
            user: req.user.id,
            userName: req.user.name
          });
        }
      } catch (err) {
        if (err.code === 11000) {
          failed++;
          errors.push(`Row ${i + 1} (${email}): Duplicate email encountered during concurrent insertion`);
        } else {
          failed++;
          errors.push(`Row ${i + 1} (${email}): ${err.message}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Import completed',
      data: {
        inserted,
        updated,
        failed,
        errors
      }
    });

  } catch (error) {
    next(error);
  }
};
