import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStock = ({ editingItem, setEditingItem, stock, setStock }) => {
    console.log(editingItem);
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setStockEntries(
        (
          editingItem.stock || [
            {
              size: editingItem.size,
              price: editingItem.price,
              quantity: editingItem.left,
            },
          ]
        ).map((entry) => ({
          size: entry.size,
          price: entry.price,
          quantity: entry.quantity ?? entry.left,
        }))
      );
    }
  }, [editingItem]);

  const handleStockEntryChange = (index, field, value) => {
    const newEntries = [...stockEntries];
    newEntries[index][field] = value;
    setStockEntries(newEntries);
  };

  const addNewStockEntry = () => {
    setStockEntries([...stockEntries, { size: "", price: "", quantity: "" }]);
  };

  const removeStockEntry = (index) => {
    if (stockEntries.length <= 1) return;
    setStockEntries(stockEntries.filter((_, i) => i !== index));
  };

  const handleSaveStock = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/addtyre/edit`,
        {
        tyreid: editingItem._id,
          stock: stockEntries.map((entry) => ({
            size: entry.size,
            quantity: Number(entry.quantity),
            price: Number(entry.price),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Stock updated successfully!");
        setEditingItem(null);
      } else {
        toast.error("Failed to update stock.");
      }
    } catch (error) {
      toast.error("Error updating stock.");
      console.error(error);
    }
    setLoading(false);
  };

  if (!editingItem) return null;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="fixed inset-0 bg-[#00000089] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Stock</h3>
            <button
              onClick={() => setEditingItem(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              value={editingItem.model}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={editingItem.brand}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          {/* Make stock entries scrollable if too many */}
          <div className="mb-4 flex-1 min-h-[100px] max-h-60 overflow-y-auto pr-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Entries
            </label>
            {stockEntries.map((entry, index) => (
              <div
                key={index}
                className="mb-3 p-3 border rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={entry.size}
                      onChange={(e) =>
                        handleStockEntryChange(index, "size", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={entry.price}
                      onChange={(e) =>
                        handleStockEntryChange(index, "price", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={entry.quantity}
                      onChange={(e) =>
                        handleStockEntryChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    onClick={() => removeStockEntry(index)}
                    className="text-red-500 text-xs flex items-center"
                  >
                    <FaMinus className="mr-1" /> Remove this size
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addNewStockEntry}
              className="text-blue-500 text-sm flex items-center mt-2"
            >
              <FaPlus className="mr-1" /> Add another size
            </button>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStock}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStock;
