import React, { useState } from "react";
import { FaTimes, FaCheckCircle, FaSearch } from "react-icons/fa";

const TyreSelectPopup = ({
  partnerTyres = [],
  ownTyres = [],
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("partner");
  console.log("partner stocks : ",partnerTyres)
  console.log("own inventory stocks : ",ownTyres)
  const filterTyres = (tyres) =>
    tyres.filter(
      (tyre) =>
        (tyre.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (tyre.model?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (tyre.type?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (tyre.vehicleType?.toLowerCase() || "").includes(search.toLowerCase())
    );

  const tyresToShow =
    activeTab === "partner" ? filterTyres(partnerTyres) : filterTyres(ownTyres);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000086] bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full xl:w-[80%] p-6 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
          Select Tyre to Add
        </h2>
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-t-lg font-bold border-b-4 transition-all duration-200 text-lg ${
              activeTab === "partner"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-transparent bg-gray-100 text-gray-500 hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab("partner")}
          >
            Partner Stock
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
        {/* Search */}
        <div className="flex items-center mb-4">
          <span className="mr-2 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Brand / Model / Type / Vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        {/* Tyre List */}
        <div className="overflow-y-auto max-h-[350px]">
          {tyresToShow.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-lg">
              No tyres found.
            </div>
          ) : (
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="py-2 px-3 text-left">Brand</th>
                  <th className="py-2 px-3 text-left">Model</th>
                  <th className="py-2 px-3 text-left">Type</th>
                  <th className="py-2 px-3 text-left">Vehicle</th>
                  <th className="py-2 px-3 text-left">Warranty</th>
                  <th className="py-2 px-3 text-left">Stock</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tyresToShow.map((tyre) =>
                  (tyre.stock || []).map((stock, idx) => (
                    <tr
                      key={tyre._id + stock.size}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="py-2 px-3 font-semibold">{tyre.brand}</td>
                      <td className="py-2 px-3">{tyre.model}</td>
                      <td className="py-2 px-3">{tyre.type}</td>
                      <td className="py-2 px-3">{tyre.vehicleType}</td>
                      <td className="py-2 px-3">{tyre.warranty}</td>
                      <td className="py-2 px-3">
                        <div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold mr-2">
                            Size: {stock.size}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold mr-2">
                            Qty: {stock.quantity}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                            ₹{stock.price}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1"
                          onClick={() =>
                            onSelect({
                              description: `${tyre.brand} ${tyre.model} (${stock.size})`,
                              hsn: "",
                              qty: 1,
                              unit: "No.",
                              price: stock.price,
                              cgstRate: "",
                              sgstRate: "",
                              tyreId: tyre._id,
                              size: stock.size,
                            })
                          }
                        >
                          <FaCheckCircle /> Add
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
    </div>
  );
};

export default TyreSelectPopup;