import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditShop() {
  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    name: "",
    password: "",
    adminNotes: "",
    phoneNumber: "",
    businessAddress: "",
    pincode: "",
    region: "",
    noOfStaff: "",
    openingTime: new Date(),
    closingTime: new Date(),
    daysOfOperation: [],
  });

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfOperation: prev.daysOfOperation.includes(day)
        ? prev.daysOfOperation.filter((d) => d !== day)
        : [...prev.daysOfOperation, day],
    }));
  };
  const GetShopData = async () => {
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/shops/getmetadata`,
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
        setFormData({
          _id: data._id,
          email: data.email,
          name: data.name,
          password: data.password,
          adminNotes: data.adminNotes,
          phoneNumber: data.phoneNumber,
          businessAddress: data.businessAddress,

          pincode: data.pincode,
          region: data.region,
          noOfStaff: data.noOfStaff,
          openingTime: new Date(data.openingTime),
          closingTime: new Date(data.closingTime),
          daysOfOperation: data.daysOfOperation,
        });
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };
  useEffect(() => {
    GetShopData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/shops/updateshop`,
        {
          ...formData,
          _id: formData._id,
          openingTime: formData.openingTime.toISOString(),
          closingTime: formData.closingTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Shop details updated successfully!");
      } else {
        toast.error("Failed to update shop details.");
      }
    } catch (error) {
      toast.error("Failed to update shop details.");
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      name: "",
      password: "",
      adminNotes: "",
      phoneNumber: "",
      businessAddress: "",
      pincode: "",
      region: "",
      noOfStaff: "",
      openingTime: new Date(),
      closingTime: new Date(),
      daysOfOperation: [],
    });
    toast.info("Form reset.");
  };

  return (
    <div className=" w-full flex items-center justify-center ">
      <ToastContainer />
      <div className="w-full flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full  xl:mr-4 bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Initial Fields */}
          <div className="space-y-20">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Admin Notes</label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) =>
                  setFormData({ ...formData, adminNotes: e.target.value })
                }
                placeholder="Free text area for remarks"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              ></textarea>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-20">
            <div>
              <label className="block text-sm font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Business Address
              </label>
              <input
                type="text"
                value={formData.businessAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessAddress: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Region/City</label>
              <select
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Enter Region / City</option>
                <option value="Chennai">Chennai</option>
                <option value="Salem">Salem</option>
              </select>
            </div>
          </div>

          {/* Service Capability */}
          <div className="space-y-20">
            <div>
              <label className="block text-sm font-semibold">
                No. of Staff working
              </label>
              <input
                type="text"
                value={formData.noOfStaff}
                onChange={(e) =>
                  setFormData({ ...formData, noOfStaff: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={formData.openingTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":");
                    const newTime = new Date(formData.openingTime);
                    newTime.setHours(parseInt(h, 10), parseInt(m, 10));
                    setFormData({ ...formData, openingTime: newTime });
                  }}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={formData.closingTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":");
                    const newTime = new Date(formData.closingTime);
                    newTime.setHours(parseInt(h, 10), parseInt(m, 10));
                    setFormData({ ...formData, closingTime: newTime });
                  }}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Days of Operation
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-1 rounded-full text-sm border transition ${
                      formData.daysOfOperation.includes(day)
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-gray-800 hover:bg-blue-50"
                    }`}
                    Shop
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                className="border rounded-lg px-3 py-2 font-semibold hover:bg-gray-50 transition"
                onClick={handleReset}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-3 py-2 font-semibold shadow hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
