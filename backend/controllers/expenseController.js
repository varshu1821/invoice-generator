const Invoice = require('../models/Invoice');

// Function to get expense summary
const getExpenseSummary = async (req, res) => {
  try {
    // Get today's date and the first day of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate the total number of invoices
    const totalInvoices = await Invoice.countDocuments();

    // Calculate the overall expense (sum of all product prices * quantity)
    const overallExpense = await Invoice.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
        },
      },
    ]);

    // Calculate the total expense for the current month
    const monthlyExpense = await Invoice.aggregate([
      {
        $match: {
          // Assuming there's a 'createdAt' field in invoices
          createdAt: { $gte: startOfMonth, $lte: today },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
        },
      },
    ]);

    
    // Calculate monthly expenses for the current year
    const monthlyExpenses = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), 0, 1), // Start of the year
            $lte: today,
          },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by year and month
          totalAmount: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
        },
      },
      {
        $project: {
          month: '$_id',
          total: '$totalAmount',
          _id: 0,
        },
      },
      { $sort: { month: 1 } }, // Sort by month
    ]);

    res.json({
      totalInvoices,
      overallExpense: overallExpense[0]?.totalAmount || 0,
      monthlyExpense: monthlyExpense[0]?.totalAmount || 0,
      monthlyExpenses,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExpenseSummary,
};
