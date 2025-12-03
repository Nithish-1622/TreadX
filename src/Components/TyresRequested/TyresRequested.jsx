import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const STATUS_TABS = ["Pending", "Approved", "Rejected"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Approved: "bg-green-100 text-green-800 border-green-400",
  Rejected: "bg-red-100 text-red-800 border-red-400",
};

const statusIcons = {
  Pending: <FaHourglassHalf className="inline mr-1 text-yellow-500" />,
  Approved: <FaCheckCircle className="inline mr-1 text-green-500" />,
  Rejected: <FaTimesCircle className="inline mr-1 text-red-500" />,
};

const TyresRequested = () => {
  const [tyreRequests, setTyreRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTyreRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/shops/requestedtyres-all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTyreRequests(res.data?.tyreRequests || []);
      } catch (err) {
        setTyreRequests([]);
      }
      setLoading(false);
    };
    fetchTyreRequests();
  }, []);

  const filteredRequests = tyreRequests
    .filter((req) => req.status === activeTab)
    .filter((req) =>
      req.requestId.toLowerCase().includes(search.trim().toLowerCase())
    );

  return (
    <div className="p-6 bg-gradient-to-br  min-h-screen">
      <h2 className="text-3xl font- mb-8 text-blue-800 tracking-tight drop-shadow">
        Tyre Requests
      </h2>
      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-80">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full shadow"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            className={`px-7 py-2 rounded-t-xl font-bold border-b-4 transition-all duration-200 text-lg shadow-sm ${
              activeTab === tab
                ? "border-blue-600 bg-gradient-to-r from-blue-200 to-blue-50 text-blue-800 shadow-lg scale-105"
                : "border-black border-opacity-20 bg-gray-100 text-gray-500 hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {statusIcons[tab]} {tab}
          </button>
        ))}
      </div>
      {/* Card Table */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-400 py-16 text-lg font-semibold bg-white rounded-2xl shadow-inner">
            Loading...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg font-semibold bg-white rounded-2xl shadow-inner">
            No {activeTab} requests found.
          </div>
        ) : (
          filteredRequests.map((req, idx) => (
            <div
              key={req.requestId}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col md:flex-row gap-6 hover:scale-[1.015]"
            >
              {/* Left: Main Info */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <span className="font-mono text-blue-700 font-bold text-lg">
                    {req.requestId}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${
                      statusColors[req.status]
                    }`}
                  >
                    {statusIcons[req.status]} {req.status}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-2xl font-bold text-green-700 bg-green-50 px-4 py-1 rounded-full shadow border border-green-200">
                    <FaRupeeSign className="inline mb-0.5" />
                    {req.price ? (
                      req.price.toLocaleString()
                    ) : (
                      <span className="text-gray-400 text-base">N/A</span>
                    )}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">
                  <span className="font-semibold">Comments:</span>{" "}
                  {req.comments}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">
                    Specifications:
                  </span>
                  <div className="flex flex-col gap-3 mt-2">
                    {req.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-3 shadow flex flex-wrap gap-2"
                      >
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Size: {spec.size}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Qty: {spec.quantity}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Brand: {spec.tyreDetails.brand}
                        </span>
                        <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Model: {spec.tyreDetails.model}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Type: {spec.tyreDetails.type}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Vehicle: {spec.tyreDetails.vehicleType}
                        </span>
                        <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Load: {spec.tyreDetails.loadIndex}
                        </span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-semibold">
                          Speed: {spec.tyreDetails.speedRating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: Date/Meta (optional, can add more info here) */}
              <div className="flex flex-col items-end justify-between min-w-[120px]">
                <span className="text-xs text-gray-400">
                  {req.createdAt && (
                    <>
                      <span className="font-semibold text-gray-500">
                        Created:
                      </span>{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {req.updatedAt && (
                    <>
                      <span className="font-semibold text-gray-500">
                        Updated:
                      </span>{" "}
                      {new Date(req.updatedAt).toLocaleDateString()}
                    </>
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TyresRequested;
