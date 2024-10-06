import Chart from "chart.js/auto"; // Import Chart.js
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import axios from "axios";

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
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
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

  //   try {
  //     const creator = localStorage.getItem("email");
  //     const response = await axios.get('http://localhost:5000/api/invoices', {
  //       headers: {
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       params: { creator },
  //     });
  //     monthWiseCollection(response.data);
  //   } catch (error) {
  //     console.log("Error fetching invoices:", error);
  //   }
  };


  const createChart = (monthlyExpensesData) => {
    const ctx = document.getElementById("myChart").getContext("2d");
    
    const labels = monthlyExpensesData.map(item => item.month); // Get months
    const data = monthlyExpensesData.map(item => item.total); // Get totals

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Expenses",
            data: data,
            borderWidth: 1,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
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
          <canvas
            id="myChart"
            style={{ width: "100%", height: "400px" }}
          ></canvas>
        </div>

        <div className="recent-invoice-list">
          <h1>Recent Invoice List</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>

          {invoices.slice(0, 6).map((data) => (
            <div key={data.id}>
              <p>{data.to}</p>
              <p>
                {new Date(data.date.seconds * 1000).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
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
