import React, { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const NewInvoice = () => {
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [creator,setCreator] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const navigation = useNavigate();

  const addProduct = () => {
    setProducts([
      ...products,
      { productName: name, price: price, quantity: qty },
    ]);
    const t = qty * price;
    setTotal(total + t);
    setName("");
    setPrice("");
    setQty(1);
  };

  const saveData = async () => {
    setLoading(true);
    console.log(to, phone, address);
    console.log(products);
    console.log(total);
    // const data = await addDoc(collection(db, "invoices"), {
    //   to: to,
    //   phone: phone,
    //   address: address,
    //   product: product,
    //   total: total,
    //   uid: localStorage.getItem("uid"),
    //   date: Timestamp.fromDate(new Date()),
    // });
    const invoiceData = {
      to,
      phone,
      address,
      creator: localStorage.getItem('email'),
      products
    };

    try {
      const response = await axios.post("http://localhost:5000/api/invoices", invoiceData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
      });

      console.log(response.data); // Log the saved invoice data
      navigation("/dashboard/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
      // Handle error (show a notification or an error message)
    } finally {
      setLoading(false);
    }

    // console.log(data);
    // navigation("/dashboard/invoices");
    // setLoading(false);
  };


  return (
    <div>
      <div className="header-row">
        <p className="new-invoice-heading">New Invoice</p>
        <button onClick={saveData} className="add-btn" type="button">
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
          Save Data
        </button>
      </div>
      <form className="new-invoice-form">
        <div className="first-row">
          <input
            onChange={(e) => {
              setTo(e.target.value);
            }}
            placeholder="To"
            value={to}
          />
          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="phone"
            value={phone}
          />
          <input
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="Address"
            value={address}
          />
        </div>
        <div className="first-row">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="product name"
            value={name}
          />
          <input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            placeholder="price"
            value={price}
          />
          <input
            onChange={(e) => {
              setQty(e.target.value);
            }}
            type="number"
            placeholder="quantity"
            value={qty}
          />
        </div>
        <button onClick={addProduct} className="add-btn" type="button">
          Add Product
        </button>
      </form>

      {products.length > 0 && (
        <div className="product-wrapper">
          <div className="product-list">
            <p>S . No</p>
            <p>Product Name</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total Price</p>
          </div>
          {products.map((data, index) => (
            <div className="product-list" key={index}>
              <p>{index + 1}</p>
              <p>{data.productName}</p>
              <p>{data.price}</p>
              <p>{data.quantity}</p>
              <p>{data.quantity * data.price}</p>
            </div>
          ))}
          <div className="total-wrapper">
            <p> Total : {total}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInvoice;
