import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/invoices/${id}`);
        setInvoice(response.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || "حصلت مشكلة في جلب الفاتورة");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "مش متوفر";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "0 ج.م";
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-md mx-auto p-4 bg-yellow-100 text-yellow-700 rounded">
        الفاتورة مش موجودة
      </div>
    );
  }

  const items = Array.isArray(invoice?.items) ? invoice.items : [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );
  
  const total = subtotal;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md" dir="rtl">
      {/* عنوان الفاتورة */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          فاتورة رقم{" "}
          {invoice?._id ? invoice._id.slice(-6).toUpperCase() : "N/A"}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            التاريخ: {formatDate(invoice?.date)}
          </span>
          {invoice?.isModified && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              اتعدلت
            </span>
          )}
        </div>
      </div>

      {/* بيانات الزبون */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-4">
          بيانات العميل
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-medium text-gray-700">الاسم:</span>{" "}
            {invoice?.customerName ?? "مش متوفر"}
          </p>
          <p>
            <span className="font-medium text-gray-700">التليفون:</span>{" "}
            {invoice?.customerPhone ?? "مش متوفر"}
          </p>
        </div>
      </section>

      {/* جدول الأصناف */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-4">
          الأصناف
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصنف
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكمية
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سعر الوحدة
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجمالي
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item?._id ?? Math.random()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item?.name ?? "مش متوفر"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.quantity ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item?.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(
                        (item?.quantity ?? 0) * (item?.price ?? 0)
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    مفيش أصناف
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* الإجماليات */}
      <section className="ml-auto w-full md:w-72 mb-8">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <span className="text-right font-medium">المجموع الفرعي:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 pt-2 mt-2 border-t-2 border-gray-800">
            <span className="text-right font-bold">الإجمالي:</span>
            <span className="font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="pt-4 mt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>الفاتورة اتعملت يوم: {formatDate(invoice?.createdAt)}</p>
        {invoice?.isDeleted && (
          <p className="text-red-500 font-medium mt-2">الفاتورة دي اتشالت</p>
        )}
      </footer>
    </div>
  );
};

export default InvoiceDetails;
