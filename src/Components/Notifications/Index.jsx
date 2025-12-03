import React, { useState } from "react";
import { FiMoreVertical, FiSettings, FiBell } from "react-icons/fi";

const notifications = [
  {
    id: 1,
    user: "Ravi Kumar",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "Tyre Order",
    message: "requested approval for a new tyre order (Michelin 205/55R16)",
    time: "5 min ago",
    details:
      "Order #TYR-2024-0012 for 20 Michelin 205/55R16 tyres. Requested by Ravi Kumar for Chennai branch.",
  },
  {
    id: 2,
    user: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "Inventory",
    message: "added 10 Bridgestone tyres to Salem inventory",
    time: "28 min ago",
    details:
      "Inventory updated: 10 Bridgestone Ecopia tyres added to Salem warehouse by Priya Sharma.",
  },
  {
    id: 3,
    user: "Suresh Das",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    type: "Service Request",
    message: "assigned a new service request for wheel alignment",
    time: "2 hours ago",
    details:
      "Service Request #SR-2024-0098 assigned to technician Suresh Das for wheel alignment at Chennai branch.",
  },
  {
    id: 4,
    user: "Anita George",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    type: "Vendor",
    message: "added a new vendor: JK Tyres",
    time: "3 days ago",
    details: "Vendor JK Tyres added to approved vendor list by Anita George.",
  },
  {
    id: 5,
    user: "Vikram Singh",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    type: "Feedback",
    message: "left feedback: 'Quick and professional tyre replacement!'",
    time: "1 week ago",
    details:
      "Customer feedback from Vikram Singh: 'Quick and professional tyre replacement!'. Rated 5 stars.",
  },
  {
    id: 6,
    user: "Meena Iyer",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    type: "Tyre Order",
    message: "requested approval for a bulk order (MRF 185/65R15)",
    time: "2 weeks ago",
    details:
      "Order #TYR-2024-0007 for 50 MRF 185/65R15 tyres. Requested by Meena Iyer for Salem branch.",
  },
];

const Index = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-3xl xl:max-w-4xl flex gap-8">
        {/* Notifications List */}
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div className="flex items-center gap-2">
              <FiBell className="text-blue-500 w-6 h-6" />
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            </div>
            <button className="text-gray-400 hover:text-blue-500">
              <FiSettings className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "32rem" }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-6 py-5 cursor-pointer transition hover:bg-blue-50 border-b ${
                  selected === n.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelected(n.id)}
              >
                <img
                  src={n.avatar}
                  alt={n.user}
                  className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{n.user}</span>{" "}
                  <span className="text-gray-700">{n.message}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {n.type} &bull; {n.time}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiMoreVertical />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Details */}
        <div className="flex-1">
          {selected ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[20rem] flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={notifications.find((n) => n.id === selected)?.avatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-full border-2 border-blue-100 object-cover"
                />
                <div>
                  <div className="font-bold text-lg text-gray-800">
                    {notifications.find((n) => n.id === selected)?.user}
                  </div>
                  <div className="text-xs text-gray-400">
                    {notifications.find((n) => n.id === selected)?.type} &bull;{" "}
                    {notifications.find((n) => n.id === selected)?.time}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 text-base mb-4">
                {notifications.find((n) => n.id === selected)?.details}
              </div>
              <div className="mt-auto flex justify-end">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[20rem] flex flex-col items-center justify-center text-gray-400">
              <FiBell className="w-12 h-12 mb-4" />
              <div className="font-semibold text-lg">
                Select a notification to view details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
