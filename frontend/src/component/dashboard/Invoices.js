import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NewInvoice from "./NewInvoice";
import axios from 'axios';
const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);  // Correct function call to set loading state
    try {
      const creator = localStorage.getItem("email");
      const response = await axios.get('http://localhost:5000/api/invoices',{
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
        params: { creator },
      });

      setInvoices(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Error fetching invoices: ", error);
    } finally {
      setLoading(false);  // Ensure loading state is updated
    }
  };

  const deleteInvoice = async (id) => {
    const isSure = window.confirm("Are you sure you want to delete?");
    if (isSure) {
        try {
          console.log(id)
            // Make a DELETE request to your server
            await axios.delete(`http://localhost:5000/api/invoices/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include the authorization token
                },
            });

            // Refresh the list after deletion
            getData();
        } catch (error) {
            window.alert("Something went wrong");
            console.error("Error deleting invoice: ", error);
        }
    }
};
  return (
    <div>
      {isLoading ? (
        <div style={{ display: "flex", height: '100vh', justifyContent: "center", alignItems: "center" }}>
          <i style={{ fontSize: 30 }} className="fa-solid fa-spinner fa-spin-pulse"></i>
        </div>
      ) : (
        <div>
          {invoices.length > 0 ? (
            invoices.map((data) => (
              <div className="box" key={data.id}>
                <p>{data.to}</p>
                <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                <p>Phone: {data.phone}</p>
                <p>Total: {data.total}</p>
                <button onClick={() => deleteInvoice(data._id)} className="delete-btn">
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
                <button onClick={() => navigate("/dashboard/invoice-detail", { state: data })} className="view-btn">
                  <i className="fa-solid fa-eye"></i> View
                </button>
              </div>
            ))
          ) : (
            <div className="no-invoice-wrapper">
              <p>You have no invoices till now</p>
              <button onClick={()=>{navigate('/dashboard/new-invoices')}}>Create New Invoice</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoices;
