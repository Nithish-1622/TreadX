import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddownInventory = ({ setShowAdd }) => {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "Radial", // Set a default value matching your <option>
    vehicleType: "Car", // Set a default value matching your <option>
    loadIndex: "",
    speedRating: "",
    description: "",
    images: "",
    warranty: "",
    stock: [{ size: "", quantity: "", price: "" }],
  });
  const [loading, setLoading] = useState(false);
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleStockChange = (idx, e) => {
    const newStock = [...form.stock];
    newStock[idx][e.target.name] = e.target.value;
    setForm({ ...form, stock: newStock });
  };
  const addStockRow = () => {
    setForm({
      ...form,
      stock: [...form.stock, { size: "", quantity: "", price: "" }],
    });
  };
  const removeStockRow = (idx) => {
    if (form.stock.length === 1) return;
    setForm({ ...form, stock: form.stock.filter((_, i) => i !== idx) });
  };
  const handleAddTyre = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/owninventory`,
        {
          ...form,
          images: form.images ? [form.images] : [],
          loadIndex: Number(form.loadIndex),
          stock: form.stock.map((s) => ({
            ...s,
            quantity: Number(s.quantity),
            price: Number(s.price),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 201) {
        toast.success("Tyre added successfully!");
        setForm({
          brand: "",
          model: "",
          type: "Radial",
          vehicleType: "Car",
          loadIndex: "",
          speedRating: "",
          description: "",
          images: "",
          warranty: "",
          stock: [{ size: "", quantity: "", price: "" }],
        });
      } else {
        toast.error("Failed to add tyre.");
      }
    } catch (err) {
      toast.error("Error adding tyre.");
    }
    setLoading(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000084] bg-opacity-40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            onClick={() => setShowAdd(false)}
          >
            <FaTimes className="text-2xl" />
          </button>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaPlus /> Add Tyre
          </h2>
          <form onSubmit={handleAddTyre} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="brand"
                value={form.brand}
                onChange={handleFormChange}
                required
                placeholder="Brand"
                className="border rounded px-3 py-2"
              />
              <input
                name="model"
                value={form.model}
                onChange={handleFormChange}
                required
                placeholder="Model"
                className="border rounded px-3 py-2"
              />
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="border rounded px-3 py-2"
              >
                <option value="Tubeless">Tubeless</option>
                <option value="Tube">Tube</option>
                <option value="Radial">Radial</option>
                <option value="Bias">Bias</option>
              </select>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleFormChange}
                className="border rounded px-3 py-2"
              >
                <option>Car</option>
                <option>Bike</option>
                <option>Truck</option>
                <option>Bus</option>
                <option>SUV</option>
                <option>Van</option>
                <option>Tractor</option>
              </select>
              <input
                name="loadIndex"
                value={form.loadIndex}
                onChange={handleFormChange}
                required
                placeholder="Load Index"
                type="number"
                className="border rounded px-3 py-2"
              />
              <input
                name="speedRating"
                value={form.speedRating}
                onChange={handleFormChange}
                required
                placeholder="Speed Rating"
                className="border rounded px-3 py-2"
              />
              <input
                name="warranty"
                value={form.warranty}
                onChange={handleFormChange}
                placeholder="Warranty"
                className="border rounded px-3 py-2"
              />
              <input
                name="images"
                value={form.images}
                onChange={handleFormChange}
                placeholder="Image URL"
                className="border rounded px-3 py-2"
              />
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Description"
              className="border rounded px-3 py-2 w-full"
            />
            <div>
              <label className="font-semibold">Stock Details</label>
              {form.stock.map((s, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    name="size"
                    value={s.size}
                    onChange={(e) => handleStockChange(idx, e)}
                    required
                    placeholder="Size"
                    className="border rounded px-2 py-1 w-1/3"
                  />
                  <input
                    name="quantity"
                    value={s.quantity}
                    onChange={(e) => handleStockChange(idx, e)}
                    required
                    type="number"
                    placeholder="Quantity"
                    className="border rounded px-2 py-1 w-1/3"
                  />
                  <input
                    name="price"
                    value={s.price}
                    onChange={(e) => handleStockChange(idx, e)}
                    required
                    type="number"
                    placeholder="Price"
                    className="border rounded px-2 py-1 w-1/3"
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeStockRow(idx)}
                    title="Remove"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                onClick={addStockRow}
              >
                <FaPlus /> Add Row
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Tyre"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddownInventory;
