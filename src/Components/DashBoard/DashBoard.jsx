import React from "react";
import {
  FaMoneyBillWave,
  FaBoxOpen,
  FaChartBar,
  FaUserFriends,
  FaFilter,
  FaFileExport,
  FaCheck,
  FaEllipsisV,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea,
  Area,
  AreaChart,
} from "recharts";

const stats = [
  {
    label: "Today Total Sales",
    value: "$11,500",
    icon: <FaMoneyBillWave className="text-blue-500 w-6 h-6" />,
    bg: "bg-blue-100",
  },
  {
    label: "Today Total Orders",
    value: "420",
    icon: <FaBoxOpen className="text-orange-500 w-6 h-6" />,
    bg: "bg-orange-100",
  },
  {
    label: "Today Revenue",
    value: "$2,200",
    icon: <FaChartBar className="text-purple-500 w-6 h-6" />,
    bg: "bg-purple-100",
  },
  {
    label: "Today Visitors",
    value: "$4,320",
    icon: <FaUserFriends className="text-green-500 w-6 h-6" />,
    bg: "bg-green-100",
  },
];

const barData = [
  { date: "11 Jan", Order: 80, Sales: 30 },
  { date: "12 Jan", Order: 60, Sales: 20 },
  { date: "13 Jan", Order: 90, Sales: 40 },
  { date: "14 Jan", Order: 70, Sales: 30 },
  { date: "15 Jan", Order: 95, Sales: 45 },
  { date: "16 Jan", Order: 85, Sales: 35 },
  { date: "17 Jan", Order: 65, Sales: 25 },
];

const lineData = [
  { day: "Sat", income: 60, expenses: 40 },
  { day: "Sun", income: 80, expenses: 50 },
  { day: "Mon", income: 70, expenses: 60 },
  { day: "Tue", income: 90, expenses: 70 },
  { day: "Wed", income: 100, expenses: 80 },
  { day: "Thu", income: 85, expenses: 60 },
  { day: "Fri", income: 60, expenses: 50 },
];

const topProducts = [
  {
    name: "Fastening for the...",
    id: "HK4886",
    qty: 233,
    date: "20 feb 2024",
    customer: "Milan jack",
    status: "Done",
    price: "$872.03",
  },
];

const DashBoard = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Order Statistics</p>
            <button className="border px-2 py-1 rounded text-xs">Year</button>
          </div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Order"
                  stroke="#22c55e"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Sales" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-400 inline-block rounded"></span>
              Order
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 inline-block rounded"></span>
              Sales
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold">Sales Overview</p>
              <p className="text-green-600 font-bold text-lg">$72,445.88</p>
            </div>
            <button className="border px-2 py-1 rounded text-xs">Week</button>
          </div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lineData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="expensesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, borderColor: "#eee" }}
                  formatter={(value, name) => [
                    `$${value}`,
                    name === "income" ? "Total Income" : "Total Expenses",
                  ]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {/* Area for Income */}
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  fill="url(#incomeGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                {/* Area for Expenses */}
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#fbbf24"
                  fill="url(#expensesGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                {/* ReferenceDot for Thursday */}
                <ReferenceDot
                  x="Thu"
                  y={85}
                  r={8}
                  fill="#fff"
                  stroke="#22c55e"
                  strokeWidth={3}
                  isFront
                />
                {/* ReferenceArea for highlight */}
                <ReferenceArea
                  x1="Thu"
                  x2="Thu"
                  y1={0}
                  y2={100}
                  fill="#22c55e"
                  fillOpacity={0.05}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-400 inline-block rounded-full"></span>
              Total Income
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-400 inline-block rounded-full"></span>
              Total Expenses
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Product Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="font-semibold mb-2">Top Selling Product</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">
                  <input type="checkbox" />
                </th>
                <th className="p-2 text-left">Product name</th>
                <th className="p-2 text-left">Product ID</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Order Date</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.id}</td>
                  <td className="p-2">{row.qty}</td>
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.customer}</td>
                  <td className="p-2">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      <FaCheck className="w-3 h-3 mr-1" />
                      {row.status}
                    </span>
                  </td>
                  <td className="p-2">{row.price}</td>
                  <td className="p-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisV className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
