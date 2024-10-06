import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './component/login/Login'
import Register from './component/register/Register';
import Dashboard from './component/dashboard/Dashboard';
import Invoices from './component/dashboard/Invoices';
import Home from './component/dashboard/Home';
import NewInvoice from './component/dashboard/NewInvoice';
import Setting from './component/dashboard/Setting';
import InvoiceDetail from './component/dashboard/InvoiceDetail';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';

function App() {
  const myRouter = createBrowserRouter([
    {path: '', Component:Login},
    {path: '/login', Component:Login},
    {path: '/register', Component:Register},
    {path: '/dashboard', Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component: Home},
      {path:'invoices',Component:Invoices},
      {path:'new-invoices',Component: NewInvoice},
      {path:'setting',Component:Setting},
      {path:'invoice-detail',Component:InvoiceDetail}

    ]}

  ])
  return (
    <div>
      <RouterProvider router = {myRouter}> </RouterProvider> 
    </div>
  );
}

export default App;
