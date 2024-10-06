const express = require('express');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new invoice (POST method)
router.post('/invoices', auth, async (req, res) => {
    const { to, phone, address, products,creator} = req.body;

    const total = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

    const newInvoice = new Invoice({
        to,
        phone,
        address,
        products,
        creator
    });

    try {
        const savedInvoice = await newInvoice.save(); // Save the invoice to the database
        res.status(201).json(savedInvoice); // Return the saved invoice as a response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all invoices (GET method)
router.get('/invoices', auth, async (req, res) => {
    try {
        const {creator} = req.query; // Extract the creator query parameter from the request
        let invoices;

        if(creator){
            invoices = await Invoice.find({creator: creator});
        }else{
            invoices = await Invoice.find();
        }

        const invoicesWithTotal = invoices.map(invoice => {
            const total = invoice.products.reduce(
              (acc, product) => acc + product.price * product.quantity,
              0
            );
      
            return {
              ...invoice.toObject(),
              total,  // Include total in the response
            };
          });

        res.status(200).json(invoicesWithTotal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific invoice by ID (GET method)
router.get('/invoices/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id); // Find invoice by ID
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice); // Send the retrieved invoice as a response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific invoice by ID (DELETE method)
router.delete('/invoices/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id); // Find and delete the invoice by ID
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' }); // Send success message
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an invoice by ID
router.put('/invoices/:id', auth, async (req, res) => {
  const { to, phone, address, products,creator } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { to, phone, address, products, creator},
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;