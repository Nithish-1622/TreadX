import React from "react";
import { FaTimes } from "react-icons/fa";

const TyreRequestData = ({ selectedShop, specification, onClose }) => {
  const specs = Array.isArray(specification)
    ? specification
    : specification
    ? [specification]
    : [];

  return (
    <div>
      {/* Shop Meta Info */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-50 to-blue-100 border-b py-6 px-8 rounded-t-lg shadow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700 shadow">
            {selectedShop?.name?.[0]?.toUpperCase() || "-"}
          </div>
          <div>
            <div className="text-xl font-semibold text-blue-900">
              {selectedShop?.name}
            </div>
            <div className="text-sm text-gray-500">{selectedShop?.region}</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="text-blue-500"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                fill="currentColor"
              />
            </svg>
            <span className="text-gray-700">
              {selectedShop?.businessAddress || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="text-blue-500"
            >
              <path
                d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"
                fill="currentColor"
              />
            </svg>
            <span className="text-gray-700">
              {selectedShop?.phoneNumber || "-"}
            </span>
          </div>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tyre ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {specs.map((item, idx) => (
              <tr key={idx}>
                <td className="xl:pt-5">{item.tyreId}</td>
                <td className="xl:pt-5">{item.size}</td>
                <td className="xl:pt-5 xl:pl-10">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {specs.length === 0 && (
          <div className="text-center text-gray-400 py-8 text-lg">
            No Tyre Requests
          </div>
        )}
      </div>
    </div>
  );
};

export default TyreRequestData;
