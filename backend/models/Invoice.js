const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  to: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  creator: {type: String, required:true},
  products: [{
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  createdAt: { type: Date, default: Date.now } // Add createdAt field
});

module.exports = mongoose.model('Invoice', invoiceSchema);
