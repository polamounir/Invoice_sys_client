import React, { useState } from "react";
import InvoicesTable from "../components/tables/InvoicesTable";
import { Plus, X } from "lucide-react";
import api from "../api/axiosInstance";

export default function InvoicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    items: [{ name: "", quantity: 1, price: 0 }],
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    };
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/invoices/", formData);
      console.log("تم إنشاء الفاتورة:", res.data);

      // إعادة تعيين البيانات
      setFormData({
        customerName: "",
        customerPhone: "",
        items: [{ name: "", quantity: 1, price: 0 }],
      });
      setIsCreateModalOpen(false);

      // إعادة تحميل الصفحة
      window.location.reload();
    } catch (error) {
      console.error("خطأ أثناء إنشاء الفاتورة:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  return (
    <div className="p-6">
      {/* العنوان */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">الفواتير</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          إضافة فاتورة
        </button>
      </div>

      {/* جدول الفواتير */}
      <InvoicesTable />

      {/* نافذة إضافة فاتورة */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة فاتورة جديدة</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الزبون
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تليفون الزبون
                  </label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">الأصناف</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + إضافة صنف
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-3 items-end"
                  >
                    <div className="col-span-5">
                      <label className="block text-sm text-gray-700 mb-1">
                        اسم الصنف
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">
                        الكمية
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm text-gray-700 mb-1">
                        السعر
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm text-gray-700 mb-1">
                        الإجمالي
                      </label>
                      <div className="px-3 py-2 text-sm">
                        {(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1 p-2">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      الإجمالي: {calculateTotal().toFixed(2)} ج.م
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "جاري الحفظ..." : "حفظ الفاتورة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
