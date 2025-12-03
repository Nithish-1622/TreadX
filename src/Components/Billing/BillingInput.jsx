import React, { useState, useEffect } from "react";
import Invoice from "./Invoice";
import TyreSelectPopup from "./TyreSelectPopup";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultShop = {
  gstin: "09AADCT9146L1ZQ",
  name: "TYRE SHOPPE INDIA PVT LTD",
  address: "B-54 Sector-5, Noida (201301), U.P.",
  pan: "AADCT9146L",
  phone: "8882808080",
  email: "mail@tyresshoppe.com",
};

const BillingInput = () => {
  const [shop, setShop] = useState(defaultShop);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    gstin: "",
    phoneNumber: "",
    vehicleNumber: "",
    customerPurchaseType: "owncustomer", // Default value
    addressProof: "Aadhar Card", // Default value
    pincode: "", 
  });
  // Start with no items
  const [items, setItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showTyrePopup, setShowTyrePopup] = useState(false);
  const [partnerTyres, setPartnerTyres] = useState([]);
  const [ownTyres, setOwnTyres] = useState([]);
  const [activeTyreTab, setActiveTyreTab] = useState("partner");
  // GST/CST as a single input
  const [gstPercent, setGstPercent] = useState("");
  const [cstPercent, setCstPercent] = useState("");
  // Calculated totals
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [showFinalizePopup, setShowFinalizePopup] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false); // Lock form after finalize
  const [showCompleted, setShowCompleted] = useState(false); // Show completed button after download

  // Fetch partner/admin stock
  const fetchPartnerTyres = async () => {
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
      // Transform shopStocks to TyreSelectPopup format
      const shopStocks = response.data?.shopStocks || [];
      const formattedTyres = shopStocks.map((item) => ({
        _id: item.tyreId,
        brand: item.tyreDetails?.brand,
        model: item.tyreDetails?.model,
        type: item.tyreDetails?.type,
        vehicleType: item.tyreDetails?.vehicleType,
        warranty: item.tyreDetails?.warranty,
        stock: (item.sizes || []).map((s) => ({
          size: s.size,
          quantity: s.quantity,
          price: s.price,
        })),
      }));
      setPartnerTyres(formattedTyres);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Failed to load data: ${errorMsg}`);
    }
  };

  // Fetch own inventory
  const fetchOwnTyres = async () => {
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
      setOwnTyres(response.data || []);
    } catch (err) {
      toast.error("Failed to load own inventory.");
    }
  };

  useEffect(() => {
    fetchPartnerTyres();
    fetchOwnTyres();
  }, []);

  // Calculate totals whenever items or GST/CST change
  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.qty) > 0 && parseFloat(item.price) > 0
          ? parseFloat(item.qty) * parseFloat(item.price)
          : 0),
      0
    );
    setTotalAmount(subtotal);

    // GST/CST calculation
    const gst = gstPercent ? (subtotal * parseFloat(gstPercent)) / 100 : 0;
    const cst = cstPercent ? (subtotal * parseFloat(cstPercent)) / 100 : 0;
    setFinalAmount(subtotal + gst + cst);
  }, [items, gstPercent, cstPercent]);

  // Handler to add selected tyre to billing items
  const handleTyreSelect = (tyreItem) => {
    setItems([...items, { ...tyreItem, qty: 1 }]);
    setShowTyrePopup(false);
  };

  const handleShopChange = (e) =>
    setShop({ ...shop, [e.target.name]: e.target.value });
  const handleCustomerChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleItemChange = (idx, e) => {
    const newItems = [...items];
    newItems[idx][e.target.name] = e.target.value;
    setItems(newItems);
  };

  // Remove item
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  // Add empty item (no default product field)
  const addItem = () =>
    setItems([...items, { description: "", qty: 1, unit: "No.", price: "" }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowInvoice(true);
  };

  // Save finalized invoice to DB
  const handleFinalize = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      // Construct payload as per new DB structure
      const payload = {
        name: customer.name,
        addressProof: customer.addressProof || "Aadhar Card",
        pincode: customer.pincode || "",
        address: customer.address,
        phoneNumber: customer.phoneNumber || "",
        orderHistory: 
          {
            // You may generate a unique id here if needed, or let backend handle it
            // _id: generateUniqueId(), // optional
            items: items.map(item => ({
              tyreid: item?.tyreId,
              invoiceUrl: "http://example.com/invoice1.pdf", // Replace with actual invoice URL if available
              size: item?.size,
              quantity: item?.qty,
              vehicleNumber: customer.vehicleNumber || "",
              customerPurchaseType: customer.customerPurchaseType || "Retail"
            })),
            totalAmount: finalAmount,
            orderDate: new Date().toISOString()
          }
        
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/owncustomers`,
        payload,
        { headers }
      );
      setIsFinalized(true);
      setShowFinalizePopup(false);
      setShowInvoice(true); // Show PDF
      toast.success("Invoice finalized and saved!");
    } catch (err) {
      toast.error("Failed to save invoice.");
    }
    setSaving(false);
  };
  if (showInvoice) {
    return (
      <Invoice
        shop={shop}
        customer={customer}
        items={items}
        gstPercent={gstPercent}
        cstPercent={cstPercent}
        totalAmount={totalAmount}
        finalAmount={finalAmount}
        onBack={() => setShowInvoice(false)}
      />
    );
  }

  // Function to POST customer data to /shops/owncustomers
  const handleFinalizeCustomer = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      // Prepare the payload as per your sample
      const payload = {
        name: customer.name,
        addressProof: customer.addressProof || "Aadhar Card",
        pincode: customer.pincode || "636007",
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        orderHistory: items.map(item => ({
          tyreid: item?.tyreId || "6650039ff3faac0c0e5a7e12",
          invoiceUrl: "https://example.com/invoice/inv1234.pdf",
          size: item?.size,
          quantity: item?.qty,
          vehicleNumber: customer.vehicleNumber || "TN30AB1234", 
          customerPurchaseType: customer.customerPurchaseType || "Retail",
        })),
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shops/owncustomers`,
        payload,
        { headers }
      );
      toast.success("Customer data saved successfully!");
      setIsFinalized(true);
      setLocked(true);
      setShowInvoice(true); // Show Preview Invoice
    } catch (err) {
      toast.error("Failed to save customer data.");
    }
    setSaving(false);
  };

  // Handler for when invoice is downloaded or completed
  const handleCompleted = () => {
    // Reset all fields
    setShop(defaultShop);
    setCustomer({ name: "", address: "", gstin: "" });
    setItems([]);
    setGstPercent("");
    setCstPercent("");
    setTotalAmount(0);
    setFinalAmount(0);
    setShowInvoice(false);
    setIsFinalized(false);
    setLocked(false);
    setShowCompleted(false);
    toast.info("Billing session reset.");
  };

  // Pass handleCompleted to Invoice for download/completed
  if (showInvoice) {
    return (
      <div>
        <Invoice
          shop={shop}
          customer={customer}
          items={items}
          gstPercent={gstPercent}
          cstPercent={cstPercent}
          totalAmount={totalAmount}
          finalAmount={finalAmount}
          onBack={locked ? null : () => setShowInvoice(false)}
        />
        {locked && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-600 text-white px-8 py-3 rounded text-lg"
              onClick={handleCompleted}
            >
              Completed
            </button>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  return (
    <div className=" h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full h-full max-w-none bg-white rounded-none shadow-none p-0 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center pt-8">
          Create Invoice
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 w-full xl:px-3">
          {/* Shop Details */}
          <div>
            <h3 className="font-semibold mb-4">Shop Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <input
                name="gstin"
                value={shop.gstin}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="GSTIN"
                required
              />
              <input
                name="name"
                value={shop.name}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="Shop Name"
                required
              />
              <input
                name="address"
                value={shop.address}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="Address"
                required
              />
              <input
                name="pan"
                value={shop.pan}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="PAN"
                required
              />
              <input
                name="phone"
                value={shop.phone}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="Phone"
                required
              />
              <input
                name="email"
                value={shop.email}
                onChange={handleShopChange}
                className="border p-3 rounded"
                placeholder="Email"
                required
              />
            </div>
          </div>
          {/* Customer Details */}
          <div>
            <h3 className="font-semibold mb-4">Customer Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <input
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="Customer Name"
                required
              />
              <input
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="Address"
                required
              />
              <input
                name="gstin"
                value={customer.gstin}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="GSTIN/UIN"
              />
              <input
                name="phoneNumber"
                value={customer.phoneNumber}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="Phone Number"
                required
              />
              <input
                name="vehicleNumber"
                value={customer.vehicleNumber}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="Vehicle Number"
              />
              <input
                name="pincode"
                value={customer.pincode}
                onChange={handleCustomerChange}
                className="border p-3 rounded"
                placeholder="Pincode"
              />
            </div>
          </div>
          {/* Tyres Purchased */}
          <div>
            <h3 className="font-semibold mb-4">Tyres Purchased</h3>
            {items.length === 0 && (
              <div className="text-gray-400 mb-2">No items added.</div>
            )}
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-6 gap-4 mb-2 items-center"
              >
                <input
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, e)}
                  className="border p-3 rounded xl:text-[82%]"
                  placeholder="Description"
                  required
                />
                <input
                  name="qty"
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => handleItemChange(idx, e)}
                  className="border p-3 rounded"
                  placeholder="Qty"
                  required
                />
                <input
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleItemChange(idx, e)}
                  className="border p-3 rounded"
                  placeholder="Unit"
                  required
                />
                <input
                  name="price"
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(idx, e)}
                  className="border p-3 rounded"
                  placeholder="Price"
                  required
                />
                <div className="p-2 text-right font-semibold">
                  ₹
                  {parseFloat(item.qty) > 0 && parseFloat(item.price) > 0
                    ? (parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)
                    : "0.00"}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-100 px-4 py-2 rounded mt-2"
            >
              Add Tyre
            </button>
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-2 rounded mb-2"
              onClick={() => setShowTyrePopup(true)}
            >
              Add Tyre from Stock
            </button>
          </div>
          {/* GST/CST as single input at the end */}
          <div className="grid grid-cols-3 gap-6">
            <input
              name="gstPercent"
              type="number"
              min="0"
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
              className="border p-3 rounded"
              placeholder="GST % (all items)"
            />
            <input
              name="cstPercent"
              type="number"
              min="0"
              value={cstPercent}
              onChange={(e) => setCstPercent(e.target.value)}
              className="border p-3 rounded"
              placeholder="CST % (all items)"
            />
          </div>
          {/* Show totals */}
          <div className="mt-6 p-4 bg-gray-50 rounded text-right">
            <div>
              <span className="font-semibold">Subtotal: </span>₹
              {totalAmount.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">GST: </span>₹
              {gstPercent
                ? ((totalAmount * parseFloat(gstPercent)) / 100).toFixed(2)
                : "0.00"}
            </div>
            <div>
              <span className="font-semibold">CST: </span>₹
              {cstPercent
                ? ((totalAmount * parseFloat(cstPercent)) / 100).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-lg font-bold mt-2">
              Total Amount: ₹{finalAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex xl:mb-3 gap-6 mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded text-lg"
            >
              Preview Invoice
            </button>
            {!isFinalized && (
              <button
                type="button"
                className="bg-red-600 text-white px-8 py-3 rounded text-lg flex items-center gap-2"
                onClick={() => setShowFinalizePopup(true)}
              >
                <FaExclamationTriangle className="text-yellow-300" />
                Finalize Invoice
              </button>
            )}
          </div>
        </form>
        {/* Finalize Confirmation Popup */}
        {showFinalizePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000094] bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Finalize Invoice?
              </h2>
              <p className="text-center text-gray-700 mb-4">
                <span className="font-semibold text-red-600">Warning:</span>{" "}
                Once finalized, the invoice will be saved to the database and{" "}
                <span className="font-bold">cannot be changed</span>.<br />
                Are you sure you want to proceed?
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowFinalizePopup(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={handleFinalize}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Yes, Finalize"}
                  <FaExclamationTriangle className="text-yellow-300" />
                </button>
              </div>
            </div>
          </div>
        )}
        {showTyrePopup && (
          <TyreSelectPopup
            partnerTyres={partnerTyres}
            ownTyres={ownTyres}
            activeTab={activeTyreTab}
            setActiveTab={setActiveTyreTab}
            onSelect={handleTyreSelect}
            onClose={() => setShowTyrePopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BillingInput;
