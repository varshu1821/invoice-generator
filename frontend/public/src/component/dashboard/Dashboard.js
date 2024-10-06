import React from "react";
import "../../component/dashboard/dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="side-nav">
        <div className="profile-info">
          <img src={localStorage.getItem("photoURL")} />
          <div>
            <p>{localStorage.getItem("cName")}</p>
           <button onClick={logout}>logout</button>
          </div>
        </div>
        <hr />
        <div className="menu">
          <Link to="/dashboard/home" className="menu-link">
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link to="/dashboard/invoices" className="menu-link">
            <i className="fa-solid fa-file-invoice"></i> Invoices
          </Link>
          <Link to="/dashboard/new-invoices" className="menu-link">
            <i className="fa-solid fa-file-circle-plus"></i> New Invoice
          </Link>
          <Link to="/dashboard/setting" className="menu-link">
            <i className="fa-solid fa-gear"></i> Settings
          </Link>
        </div>

        <button onClick={logout}>logout</button>

      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
