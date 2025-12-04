import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Components/Auth/Login";
import DashBoard from "../Components/DashBoard/DashBoard";
import EditShop from "../Components/EditShop/EditShop";
import InventoryManagement from "../Components/InventoryManagement/InventoryStock";
import OrderManagement from "../Components/OrderManagement/OrderIndex";
import TyresRequested from "../Components/TyresRequested/TyresRequested";
import BillingInput from "../Components/Billing/BillingInput";
const InitialRouter = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<DashBoard />} />
    <Route path="/editshop" element={<EditShop />} />
    <Route path="/inventory" element={<InventoryManagement />} />
    <Route path="/orders" element={<OrderManagement />} />
  <Route path="/tyrerequested" element={<TyresRequested />} />
  <Route path="/billing" element={<BillingInput />} />
  </Routes>
);

export default InitialRouter;
