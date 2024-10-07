import Chart from "chart.js/auto"; // Import Chart.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

const Home = () => {
  const [overallExpenses, setOverallExpenses] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(2456);
  const [monthlyExpense, setMonthlyExpense] = useState(4562);
  const [invoices, setInvoices] = useState([]);
  const [monthlyExpensesData, setMonthlyExpensesData] = useState([]); // New state for monthly expenses

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (monthlyExpensesData.length) {
      createChart(monthlyExpensesData); // Create chart when data is available
    }
  }, [monthlyExpensesData]);

  const getData = async () => {
    try {
      const creator = localStorage.getItem("email");
      const response = await axios.get('http://localhost:5000/api/expense-summary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { creator },
      });

      setOverallExpenses(response.data.overallExpense);
      setTotalInvoice(response.data.totalInvoices);
      setMonthlyExpense(response.data.monthlyExpense);
      setMonthlyExpensesData(response.data.monthlyExpenses); // Set the monthly expenses data
      console.log(response.data);
    } catch (error) {
      console.log("error:", error);
    }

    // Fetch invoices
    try {
      const creator = localStorage.getItem("email");
      const response = await axios.get('http://localhost:5000/api/invoices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { creator },
      });

      // Sort invoices by createdAt in descending order (newest first)
      const sortedInvoices = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setInvoices(sortedInvoices);  // Set sorted invoices
    } catch (error) {
      console.log("Error fetching invoices:", error);
    }
  };

  const createChart = (monthlyExpensesData) => {
    const ctx = document.getElementById("myChart").getContext("2d");

    // Prepare labels and data for the chart
    const labels = monthlyExpensesData.map(item => item.month);
    const data = monthlyExpensesData.map(item => item.total);

    // Destroy previous chart instance if it exists to avoid duplicate charts
    if (window.myChartInstance) {
        window.myChartInstance.destroy();
    }

    // Create the new chart
    window.myChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Monthly Expenses",
                    data: data,
                    borderWidth: 1,
                    backgroundColor: "rgba(75, 192, 192, 0.6)", // Slightly darker for better visibility
                    borderColor: "rgba(75, 192, 192, 1)",
                    hoverBackgroundColor: "rgba(75, 192, 192, 0.8)", // Darker on hover
                    hoverBorderColor: "rgba(255, 99, 132, 1)", // Highlight border on hover
                    barPercentage: 0.3, // Adjust bar width
                    categoryPercentage: 0.6, // Space between bars
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14, // Increase font size for legend
                        },
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
                    titleColor: '#ffffff', // Tooltip title color
                    bodyColor: '#ffffff', // Tooltip body color
                    borderColor: '#ffffff',
                    borderWidth: 1,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false, // Hide gridlines for x-axis
                    },
                    title: {
                        display: true,
                        text: 'Months',
                        font: {
                            size: 16, // Font size for x-axis title
                            weight: 'bold', // Font weight for x-axis title
                        },
                        padding: {
                            top: 10,
                            bottom: 10,
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)', // Lighter gridlines
                        lineWidth: 1,
                    },
                    title: {
                        display: true,
                        text: 'Expenses (Rs)',
                        font: {
                            size: 16, // Font size for y-axis title
                            weight: 'bold', // Font weight for y-axis title
                        },
                        padding: {
                            top: 10,
                            bottom: 10,
                        },
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return `Rs ${value}`; // Format y-axis ticks with Rs
                        },
                    },
                },
            },
        },
    });
};

  return (
    <div>
      <div className="home-first-row">
        <div className="home-box box-1">
          <h1 className="box-header">Rs {overallExpenses}</h1>
          <p className="box-title">Overall</p>
        </div>

        <div className="home-box box-2">
          <h1 className="box-header">Rs {totalInvoice}</h1>
          <p className="box-title">Invoices</p>
        </div>

        <div className="home-box box-3">
          <h1 className="box-header">Rs {monthlyExpense}</h1>
          <p className="box-title">This Month</p>
        </div>
      </div>

      <div className="home-second-row">
        <div className="chart-box">
          <canvas id="myChart" style={{ width: "100%", height: "400px" }}></canvas>
        </div>
        
        {/* Recent Invoice List */}
        <div className="recent-invoice-list">
          <h1>Recent Invoice List</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>

          {/* Display sorted invoices (newest first) */}
          {invoices.slice(0, 8).map((data) => (
            <div key={data._id}>
              <p>{data.to}</p>
              <p>
                {new Date(data.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>Rs. {data.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
