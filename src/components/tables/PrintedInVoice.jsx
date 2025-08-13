import React from "react";
import dayjs from "dayjs";

const PrintedInvoice = ({ invoice }) => {
  if (!invoice) return null;

  const total =
    invoice.totalAmount ||
    invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className="invoice-template"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "5mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}
        >
          فاتورة
        </h1>
        {invoice.invoiceNumber && (
          <p style={{ color: "#666" }}>
            رقم الفاتورة: #{invoice.invoiceNumber}
          </p>
        )}
      </div>

      {/* Seller & Customer Info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div style={{ width: "48%" }}>
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            معلومات العميل:
          </h2>
          <div
            style={{
              display: "flex",

              gap: "10px",
              justifyContent: "sart",
            }}
          >
            <p>الاسم :</p>
            <p>{invoice.customerName || "عميل غير محدد"}</p>
          </div>
          <div
            style={{
              display: "flex",

              gap: "10px",
              justifyContent: "sart",
            }}
          >
          <p>رقم الهاتف</p>
          <p>{invoice.customerPhone || "غير محدد"}</p>
        </div>
          <p>تاريخ: {dayjs(invoice.date).format("YYYY/MM/DD")}</p>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              #
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              المنتج
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              الكمية
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              السعر
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              المجموع
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
              }}
            >
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {index + 1}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {item.name}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {item.price.toFixed(2)} جنيه
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                {(item.price * item.quantity).toFixed(2)} جنيه
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "300px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>المجموع:</span>
            <span>{total.toFixed(2)} جنيه</span>
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>الخصم:</span>
            <span>0.00 جنيه</span>
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #ddd",
              paddingTop: "10px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <span>الإجمالي النهائي:</span>
            <span>{total.toFixed(2)} جنيه</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <p>شكراً لتعاملك معنا</p>
        <p>للاستفسارات: هاتف المتجر</p>
      </div>
    </div>
  );
};

export default PrintedInvoice;
