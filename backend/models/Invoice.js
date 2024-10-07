const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  to: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  creator: { type: String, required: true },
  products: [{
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }]
}, { timestamps: true }); // This adds `createdAt` and `updatedAt` automatically

module.exports = mongoose.model('Invoice', invoiceSchema);
