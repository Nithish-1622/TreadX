import React, { useEffect, useState } from "react";
import axios from "axios";
import NewOrders from "./NewOrders";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("present");
  const [presentOrders, setPresentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetOrderData();
    // eslint-disable-next-line
  }, []);

  const GetOrderData = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/shops/getorders`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response", response);
      if (response.status === 200) {
        const data = response.data;
        // Filter orders based on status
        setPresentOrders(
          (data.pendingOrders || []).filter(
            (o) => o.status === "pending" || o.orderstatus === "Approved"
          )
        );
        setPastOrders(data.completedOrders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pass this to NewOrders for completing an order
  const handleCompleteOrder = async (orderId) => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/tyres/completeorder`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      GetOrderData(); // Refresh orders after completion
    } catch (error) {
      alert("Failed to complete order");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "present"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("present")}
        >
          Present Orders
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Orders
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by ID / Shop Name / Date / Location..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "present" && (
        <NewOrders
          orders={presentOrders}
          searchTerm={searchTerm}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
      {activeTab === "past" && (
        <NewOrders orders={pastOrders} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default OrderManagement;
