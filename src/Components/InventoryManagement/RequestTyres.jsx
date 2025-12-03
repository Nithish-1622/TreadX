import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestTyres = ({ setShowAdd }) => {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null); // tyreId of expanded row
  const [requestList, setRequestList] = useState([]); // {tyreId, size, quantity}
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [qtyInputs, setQtyInputs] = useState({}); // {`${tyreId}_${size}`: value}
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(5); // Items per page

  // Fetch tyres
  const fetchData = async (pageNum, pageLimit, searchParam) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Please login.");
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/shops/tyres/getall?page=${pageNum}&limit=${pageLimit}${searchParam}`,
        { headers }
      );
      console.log("API Response:", response);
      // The tyres are in response.data.data (not response.data)
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setStock(data);
      setQtyInputs(
        Object.fromEntries(
          data.flatMap((item) =>
            (item.stock || []).map((s) => [
              `${item._id}_${s.size}`,
              2, // default quantity
            ])
          )
        )
      );
      setTotalPages(response.data.totalPages || 1);
      if (response.status === 200) {
        toast.success("Data loaded successfully!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Failed to load data: ${errorMsg}`);
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageLimit, "");
  }, [currentPage, pageLimit]);

  // Search filter
  const filteredStock = stock.filter(
    (tyre) =>
      tyre._id?.toLowerCase().includes(search.toLowerCase()) ||
      tyre.brand?.toLowerCase().includes(search.toLowerCase()) ||
      tyre.model?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle input change for quantity
  const handleQtyChange = (tyreId, size, value) => {
    setQtyInputs((prev) => ({
      ...prev,
      [`${tyreId}_${size}`]: value,
    }));
  };

  // Add a request to the list (no duplicates, update quantity)
  const handleAddRequest = (tyreId, size, maxQty) => {
    const key = `${tyreId}_${size}`;
    const quantity = parseInt(qtyInputs[key], 10);

    if (!quantity || quantity < 1) {
      toast.error("Enter a valid quantity");
      return;
    }
    if (quantity > maxQty) {
      toast.error("Quantity exceeds available stock");
      return;
    }

    setRequestList((prev) => {
      const idx = prev.findIndex(
        (item) => item.tyreId === tyreId && item.size === size
      );
      if (idx !== -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity = quantity;
        return updated;
      }
      return [...prev, { tyreId, size, quantity }];
    });
    toast.success("Added to request list");
    setQtyInputs((prev) => ({ ...prev, [key]: "" }));
  };

  // Remove a request from the list
  const handleRemoveRequest = (idx) => {
    setRequestList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit all requests
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (requestList.length === 0) {
      toast.error("Add at least one tyre to request");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        comments,
        specification: requestList,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/tyres/createorder`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("request response : ", response);
      toast.success("Request submitted!");
      setRequestList([]);
      setComments("");
      setExpanded(null);
      setQtyInputs({});
    } catch (err) {
      console.error(err);
      toast.error("Error submitting request");
    }
    setLoading(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#00000084] bg-opacity-40">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-6xl relative flex flex-col"
          style={{
            maxHeight: "calc(100vh - 60px)",
            marginTop: 30,
            marginBottom: 30,
            padding: 24,
            overflow: "hidden",
          }}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            onClick={() => setShowAdd(false)}
          >
            <FaTimes className="text-2xl" />
          </button>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaPlus /> Request Tyre
          </h2>
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by Tyre ID / Brand / Model"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {/* Tyre Table */}
          <div
            className="overflow-y-auto mb-6"
            style={{
              maxHeight: 220, // Show about 3 rows, rest scroll
              marginBottom: 24,
            }}
          >
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="text-gray-500 border-b bg-gray-50">
                  <th className="py-2 px-3 text-left">Tyre ID</th>
                  <th className="py-2 px-3 text-left">Brand</th>
                  <th className="py-2 px-3 text-left">Model</th>
                  <th className="py-2 px-3 text-left">Type</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No tyres found.
                    </td>
                  </tr>
                )}
                {filteredStock.map((tyre) => (
                  <React.Fragment key={tyre._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{tyre._id}</td>
                      <td
                        className="py-2 px-3 cursor-pointer text-blue-700 font-semibold hover:underline"
                        onClick={() =>
                          setExpanded(expanded === tyre._id ? null : tyre._id)
                        }
                        style={{ minWidth: 120 }}
                      >
                        {tyre.brand}{" "}
                        {expanded === tyre._id ? (
                          <FaChevronUp className="inline ml-1" />
                        ) : (
                          <FaChevronDown className="inline ml-1" />
                        )}
                      </td>
                      <td className="py-2 px-3">{tyre.model}</td>
                      <td className="py-2 px-3">{tyre.type}</td>
                      <td className="py-2 px-3">
                        {/* Only show "Request" if not expanded */}
                        {expanded !== tyre._id && (
                          <button
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                            onClick={() => setExpanded(tyre._id)}
                          >
                            Request
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded === tyre._id && (
                      <tr>
                        <td colSpan={5}>
                          <div className="bg-blue-50 rounded-lg mt-2 mb-4 p-4 shadow-inner">
                            <div className="font-semibold mb-2 text-blue-900">
                              Available Stock for{" "}
                              <span className="text-blue-700">
                                {tyre.brand} {tyre.model}
                              </span>
                              :
                            </div>
                            <div className="flex flex-wrap gap-4">
                              {(tyre.stock || []).map((s, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-start min-w-[180px]"
                                >
                                  <div className="font-bold text-blue-700 mb-1">
                                    {s.size}
                                  </div>
                                  <div className="text-xs text-gray-600 mb-1">
                                    Qty:{" "}
                                    <span className="font-semibold">
                                      {s.quantity}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 mb-2">
                                    Price:{" "}
                                    <span className="font-semibold">
                                      ₹{s.price}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min={1}
                                      max={s.quantity}
                                      placeholder="Qty"
                                      className="border rounded px-2 py-1 w-16 text-sm"
                                      value={
                                        qtyInputs[`${tyre._id}_${s.size}`] || ""
                                      }
                                      onChange={(e) =>
                                        handleQtyChange(
                                          tyre._id,
                                          s.size,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center gap-1"
                                      onClick={() =>
                                        handleAddRequest(
                                          tyre._id,
                                          s.size,
                                          s.quantity
                                        )
                                      }
                                      type="button"
                                    >
                                      <FaPlus /> Add
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls - Add this section */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          {/* Request List Summary */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Request List</h3>
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: 120, // Show about 2-3 rows, rest scroll
                marginBottom: 8,
              }}
            >
              {requestList.length === 0 ? (
                <div className="text-gray-400 text-sm">No tyres added yet.</div>
              ) : (
                <table className="min-w-full text-sm border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-1 px-2 text-left">Tyre ID</th>
                      <th className="py-1 px-2 text-left">Size</th>
                      <th className="py-1 px-2 text-left">Quantity</th>
                      <th className="py-1 px-2 text-left">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestList.map((req, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-1 px-2">{req.tyreId}</td>
                        <td className="py-1 px-2">{req.size}</td>
                        <td className="py-1 px-2">{req.quantity}</td>
                        <td className="py-1 px-2">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveRequest(idx)}
                            type="button"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Comments and Submit */}
          <form onSubmit={handleSubmitAll}>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">
                Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Any comments or requirements..."
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-semibold"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestTyres;
