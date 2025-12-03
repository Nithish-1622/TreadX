import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewOrders = ({ orders, searchTerm, getStatusColor }) => {
  const [localOrders, setLocalOrders] = useState(orders || []);

  // Sync localOrders with orders prop
  useEffect(() => {
    setLocalOrders(orders || []);
  }, [orders]);

  // Normalize order object (handles both direct and {orderId: {...}} cases)
  const getOrderObj = (order) => (order.orderId ? order.orderId : order);
  const getOrderStatus = (order) =>
    order.orderstatus ||
    order.status ||
    (order.orderId && order.status) ||
    "N/A";

  // Filter orders by search term
  const filteredNewOrders = localOrders.filter((order) => {
    const o = getOrderObj(order);
    const orderIdMatch = o._id
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const brandMatch = o.orderinfo?.orderItems?.some(
      (item) =>
        (item.tyre?.brand?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (item.tyre?.model?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );
    const dateMatch = (o.date || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const streetMatch = (o.addressId?.street || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const cityMatch = (o.addressId?.city || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return orderIdMatch || brandMatch || dateMatch || streetMatch || cityMatch;
  });

  // Format address
  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.street || ""}, ${address.city || ""}, ${
      address.state || ""
    }, ${address.postalCode || ""}`;
  };

  // Complete order handler
  const handleCompleteOrder = async (order) => {
    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/completeorder`,
        {
          appointmentid: order.appointmentId || order._id, // prefer appointmentId
          orderid: order.orderId?._id || order.orderId || order._id, // prefer orderId._id
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Order marked as completed!");
      setLocalOrders((prev) =>
        prev.filter((ord) => {
          // Remove by appointmentId or orderId
          return (
            (ord.appointmentId || ord._id) !==
            (order.appointmentId || order._id)
          );
        })
      );
    } catch (err) {
      toast.error("Failed to complete order");
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-gray-300">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm uppercase tracking-wider">
            <th className="py-3 px-4 border">#Order ID</th>
            <th className="py-3 px-4 border">Order Details</th>
            <th className="py-3 px-4 border">
              <FaCalendarAlt className="inline-block mr-1" /> Date
            </th>
            <th className="py-3 px-4 border">
              <FaClock className="inline-block mr-1" /> Time
            </th>
            <th className="py-3 px-4 border">
              <FaMapMarkerAlt className="inline-block mr-1" /> Location
            </th>
            {/* <th className="py-3 px-4 border">
              <FaTruck className="inline-block mr-1" /> Partner
            </th> */}
            <th className="py-3 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredNewOrders.length > 0 ? (
            filteredNewOrders.map((order, index) => {
              const o = getOrderObj(order);
              return (
                <tr
                  key={o._id}
                  className={`hover:bg-blue-50 transition duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Order ID */}
                  <td className="py-3 px-4 border text-sm text-blue-700 font-medium truncate max-w-[180px]">
                    {o._id}
                  </td>
                  {/* Order Items */}
                  <td className="py-3 px-4 border">
                    {(o.orderinfo?.orderItems || []).map((item, i) => (
                      <div
                        key={i}
                        className="mb-2 p-2 rounded bg-blue-50 flex flex-wrap items-center gap-2"
                      >
                        {/* <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Tyre ID: {item.tyre?._id || item.tyre}
                        </span> */}
                        <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Brand: {item.tyre?.brand || "-"}
                        </span>
                        <span className="bg-pink-200 text-pink-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Model: {item.tyre?.model || "-"}
                        </span>
                        <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Size: {item.size}
                        </span>
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  {/* Service Type */}

                  {/* Date */}
                  <td className="py-3 px-4 border text-sm text-nowrap">
                    {o.date || "N/A"}
                  </td>
                  {/* Time */}
                  <td className="py-3 px-4 border text-sm text-nowrap">
                    {o.time || "N/A"}
                  </td>
                  {/* Address */}
                  <td className="py-3 px-4 border text-sm min-w-[220px] text-gray-700">
                    {o.addressId ? (
                      <div className="space-y-1">
                        <div>
                          <FaMapMarkerAlt className="inline mr-1 text-blue-500" />
                          <span className="font-semibold">
                            {o.addressId.street}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {o.addressId.city}, {o.addressId.state}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Pincode: {o.addressId.postalCode}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  {/* Partner */}

                  <td className="py-3 px-4 border text-center">
                    {getOrderStatus(order) !== "Completed" && (
                      <button
                        className="ml-2 text-nowrap bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs"
                        onClick={() => handleCompleteOrder(order)}
                      >
                        Complete Order
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="py-6 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewOrders;
