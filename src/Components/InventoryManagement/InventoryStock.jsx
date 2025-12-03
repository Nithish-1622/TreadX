import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaPlus,
  FaFileExcel,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import AddProduct from "./RequestTyres";
import EditStock from "./EditStock";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddownInventory from "./Owninventory";
const InventoryStock = () => {
  const [stock, setStock] = useState([]);
  const [ownInventory, setOwnInventory] = useState([]);
  const [activeTab, setActiveTab] = useState("partner"); // "partner" or "own"
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState("");
  const [excelMsg, setExcelMsg] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const fileInput = useRef();
  const [loading, setLoading] = useState(false);
  const [showAddOwnInventory, setShowAddOwnInventory] = useState(false);

  const fetchData = async () => {
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
        `${import.meta.env.VITE_API_URL}/shops/getshopstocks`,
        { headers }
      );
      const shopStocks = response.data?.shopStocks || [];
      setStock(shopStocks);
      if (response.status === 200) {
        toast.success("Data loaded successfully!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Failed to load data: ${errorMsg}`);
      console.error("API Error:", err);
    }
  };

  const fetchOwnInventory = async () => {
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
        `${import.meta.env.VITE_API_URL}/shops/owninventory/getall`,
        { headers }
      );
      setOwnInventory(response.data || []);
    } catch (err) {
      toast.error("Failed to load own inventory.");
    }
  };

  useEffect(() => {
    if (activeTab === "partner") {
      fetchData();
    } else {
      fetchOwnInventory();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const openEditModal = (item) => setEditingItem(item);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleExcelImport = async (e) => {
    setExcelMsg("");
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const importedStock = rows.map((row) => ({
        sku: row.sku || `TYR-${Math.floor(100 + Math.random() * 900)}`,
        model: row.model,
        size: row.size,
        left: Number(row.quantity) || 0,
        partner: row.partner || "Imported Partner",
        price: Number(row.price) || 0,
      }));

      setStock([...stock, ...importedStock]);
      setExcelMsg("Excel imported successfully!");
    } catch (err) {
      setExcelMsg("Error importing Excel.");
    }
    setLoading(false);
  };

  // Filtered data for search (for both tabs)
  const filteredPartnerStock = stock.filter((row) =>
    [row.tyreId, ...(row.sizes || []).map((s) => s.size), ...(row.sizes || []).map((s) => s.quantity)]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredOwnInventory = ownInventory.filter((item) =>
    [
      item.brand,
      item.model,
      item.type,
      item.vehicleType,
      item.stock?.map((s) => s.size).join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex bg-gray-50 min-h-screen p-4">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6 mr-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all duration-200 text-lg ${
                activeTab === "partner"
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-transparent bg-gray-100 text-gray-500 hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("partner")}
            >
              Partner Tyre Stock
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all duration-200 text-lg ${
                activeTab === "own"
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-transparent bg-gray-100 text-gray-500 hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("own")}
            >
              Own Inventory
            </button>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 flex items-center">
              <div className="relative w-full">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder={
                    activeTab === "partner"
                      ? "Search by Tyre Name / SKU / Size"
                      : "Search by Brand / Model / Size"
                  }
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button className="ml-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500">
                <FaSyncAlt />
              </button>
            </div>
            <div className="flex gap-2 ml-4">
              {activeTab === "partner" && (
                <>
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => fileInput.current.click()}
                    title="Import Excel"
                  >
                    <FaFileExcel /> Excel
                  </button>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInput}
                    onChange={handleExcelImport}
                    className="hidden"
                  />
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowAdd(true)}
                    title="Add Tyre"
                  >
                    <FaPlus /> Add Tyre
                  </button>
                </>
              )}
              <button
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => setShowAddOwnInventory(true)}
                title="Add Own Inventory"
              >
                <FaPlus /> Add Own Inventory
              </button>
            </div>
          </div>
          {msg && <div className="mb-2 text-green-600 text-sm">{msg}</div>}
          {excelMsg && (
            <div className="mb-2 text-green-600 text-sm">{excelMsg}</div>
          )}
          {/* Table */}
          <div className="overflow-y-auto" style={{ maxHeight: 400 }}>
            {activeTab === "partner" ? (
              <table className="min-w-full text-sm border rounded-xl overflow-hidden shadow">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 text-left border border-gray-200">Tyre ID</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Brand</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Model</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Type</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Vehicle</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Tyre Size</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Stock Left</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartnerStock.map((row) =>
                    (row.sizes || []).map((s, idx) => (
                      <tr
                        key={`${row.tyreId || row._id}_${s.size}_${idx}`}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="py-2 px-4 font-mono text-blue-700 font-bold border border-gray-200">{row.tyreId || row._id || "-"}</td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.tyreDetails?.brand || row.brand || "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.tyreDetails?.model || "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.tyreDetails?.type  || "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {row.tyreDetails?.vehicleType || "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {s.size || "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {s.quantity ?? "-"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                            ₹{s.price ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full text-sm border rounded-xl overflow-hidden shadow">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-400 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 text-left border border-gray-200">Brand</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Model</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Type</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Vehicle</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Size</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Qty</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Price (₹)</th>
                    <th className="py-3 px-4 text-left border border-gray-200">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwnInventory.map((item, idx) =>
                    (item.stock || []).map((s, sidx) => (
                      <tr
                        key={item._id + "_" + s.size}
                        className="hover:bg-purple-50 transition"
                      >
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {item.brand}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {item.model}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {item.vehicleType}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {s.size}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {s.quantity}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                            ₹{s.price}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <button
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded shadow"
                            onClick={() =>
                              openEditModal({
                                ...item,
                                stock: [s],
                              })
                            }
                          >
                            <FaEdit /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-56 flex flex-col space-y-4">
          <div className="bg-blue-100 rounded-xl p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-700">2k</span>
            <span className="text-gray-600 mt-1 text-sm">
              Tyres in inventory
            </span>
          </div>
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="bg-red-100 rounded-xl p-4 flex flex-col items-center"
            >
              <span className="text-xs font-bold text-red-700">MRF ZVTV</span>
              <span className="text-3xl font-bold text-red-700">60</span>
              <span className="text-xs text-red-600 mt-1">
                units only left!
              </span>
              <span className="text-xs text-red-500">
                Low stock in Inventory
              </span>
            </div>
          ))}
        </div>

        {showAdd && <AddProduct setShowAdd={setShowAdd} />}
        {showAddOwnInventory && (
          <AddownInventory setShowAdd={setShowAddOwnInventory} />
        )}
        {editingItem && (
          <EditStock
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            stock={activeTab === "partner" ? stock : ownInventory}
            setStock={activeTab === "partner" ? setStock : setOwnInventory}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryStock;