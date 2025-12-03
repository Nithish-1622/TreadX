import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import qrcode from "../../assets/qr code.png";
import logo from "../../assets/logo.png";

const Invoice = ({
  shop,
  customer,
  items,
  gstPercent,
  cstPercent,
  totalAmount,
  finalAmount,
  onBack,
}) => {
  const invoiceRef = useRef(null);

  const handleDownload = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to convert number to words (simple version)
  const numberToWords = (num) => {
    if (!num) return "";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const g = [
      "",
      "Thousand",
      "Lakh",
      "Crore"
    ];
    let str = "";
    let n = Math.floor(num);
    let i = 0;
    while (n > 0) {
      let rem = n % 1000;
      if (rem !== 0) {
        let hundreds = Math.floor(rem / 100);
        let tens = rem % 100;
        let part = "";
        if (hundreds > 0) part += a[hundreds] + " Hundred ";
        if (tens > 0) {
          if (tens < 20) part += a[tens] + " ";
          else
            part +=
              b[Math.floor(tens / 10)] +
              " " +
              a[tens % 10] +
              " ";
        }
        str = part + g[i] + " " + str;
      }
      n = Math.floor(n / 1000);
      i++;
    }
    return str.trim() + " Only";
  };
  const gstAmt = gstPercent ? (totalAmount * parseFloat(gstPercent)) / 100 : 0;
  const cstAmt = cstPercent ? (totalAmount * parseFloat(cstPercent)) / 100 : 0;

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Print
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
          >
            Back
          </button>
        )}
      </div>

      <div
        ref={invoiceRef}
        className="w-[210mm] min-h-[297mm] bg-white text-black p-6 text-sm font-poppins mx-auto border"
      >
        {/* Top Logo Centered */}
        <div className="w-full flex justify-center mb-2">
          <img src={logo} alt="Logo" className="h-16 object-contain" />
        </div>

        {/* Header */}
        <div className="flex justify-between border-b pb-2">
          <div>
            <p className="font-bold">GSTIN : {shop.gstin}</p>
            <p className="text-xs">
              (Input Tax Credit is available to a taxable person against this copy)
            </p>
            <h2 className="text-center font-bold text-lg underline mt-1">
              TAX INVOICE
            </h2>
            <p className="font-bold mt-1">{shop.name}</p>
            <p>{shop.address}</p>
            <p>PAN : {shop.pan} Tel. : {shop.phone}</p>
            <p>Email : {shop.email}</p>
          </div>
          <img src={qrcode} alt="QR Code" className="h-24 w-24" />
        </div>

        {/* e-Invoice Details and More Stuffing */}
        <div className="grid grid-cols-2 gap-4 border-b py-2">
          <div>
            <p>IRN : 1234ABCD5678EFGH</p>
            <p>Ack. No. : 9876543210</p>
            <p>Ack Date : 2024-06-01</p>
            <p>Transporter Name : ABC Logistics</p>
            <p>Mode/Terms of Payment : Online</p>
            <p>Delivery Note : 2024-06-01</p>
            <p>Supplier's Ref : SUPP12345</p>
            <p>Buyer's Order No. : ORD67890</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>Invoice No. : INV-2024-001</p>
              <p>Dated : {new Date().toLocaleDateString()}</p>
              <p>Place of Supply : Uttar Pradesh (09)</p>
              <p>Reverse Charge : N</p>
              <p>Vehicle No. : UP16AB1234</p>
              <p>Dispatch Document No. : DOC1234</p>
              <p>Delivery Note Date : 2024-06-01</p>
            </div>
            <div>
              <p>K.M. : 120</p>
              <p>Job Card No. : JC-2024-001</p>
              <p>Approval No. : APPR-2024-001</p>
              <p>Booking No. : BK-2024-001</p>
              <p>Dispatch Through : Road</p>
              <p>Destination : Noida</p>
              <p>Terms of Delivery : Immediate</p>
            </div>
          </div>
        </div>

        {/* Bill to / Ship to */}
        <div className="grid grid-cols-2 gap-4 border-b py-2">
          <div>
            <h3 className="font-bold">Billed to :</h3>
            <p>{customer.name}</p>
            <p>{customer.address}</p>
            <p className="mt-1">GSTIN / UIN : {customer.gstin}</p>
          </div>
          <div>
            <h3 className="font-bold">Shipped to :</h3>
            <p>{customer.name}</p>
            <p>{customer.address}</p>
            <p className="mt-1">GSTIN / UIN : {customer.gstin}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left border mt-2 text-xs">
          <thead>
            <tr>
              <th className="border px-1 py-1">S.N</th>
              <th className="border px-1 py-1">Description of Goods</th>
              <th className="border px-1 py-1">Qty.</th>
              <th className="border px-1 py-1">Unit</th>
              <th className="border px-1 py-1">Price</th>
              <th className="border px-1 py-1">Amount(Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-1 py-1">{idx + 1}</td>
                <td className="border px-1 py-1">{item.description}</td>
                <td className="border px-1 py-1">{item.qty}</td>
                <td className="border px-1 py-1">{item.unit}</td>
                <td className="border px-1 py-1">{parseFloat(item.price).toFixed(2)}</td>
                <td className="border px-1 py-1">
                  {(parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mt-2">
          <table className="text-sm border w-[320px]">
            <tbody>
              <tr>
                <td className="border p-1 font-semibold">Subtotal</td>
                <td className="border p-1">{totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border p-1 font-semibold">GST ({gstPercent || 0}%)</td>
                <td className="border p-1">{gstAmt.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border p-1 font-semibold">CST ({cstPercent || 0}%)</td>
                <td className="border p-1">{cstAmt.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border p-1 font-semibold">Grand Total</td>
                <td className="border p-1">{finalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-sm">Cash - {finalAmount.toFixed(2)}</p>
        <p className="text-sm font-bold">
          Rupees {numberToWords(finalAmount)}
        </p>

        {/* Terms and Footer */}
        <div className="border-t mt-3 pt-2">
          <p className="text-xs leading-4">
            Terms & Conditions: सामान एक बार बिक्री हो जाने के बाद वापिस नहीं होगा। यह चालान गौतम बुद्ध नगर क्षेत्राधिकार में आता है। Our Bank Details: A/C No: 777705377108 IFSC: ICIC0000031, ICICI BANK LTD, Sector-18, Noida
          </p>
          <div className="flex justify-between items-center mt-4">
            <img src={qrcode} alt="Pay QR" className="h-20 w-20" />
            <div className="text-right">
              <p className="text-sm">For {shop.name}</p>
              <p className="font-bold mt-2">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
