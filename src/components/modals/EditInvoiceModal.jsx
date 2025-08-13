import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function EditInvoiceModal({
  isOpen,
  onClose,
  invoice,
  onUpdated,
}) {
  const [formData, setFormData] = useState({
    customerId: "",
    date: "",
    items: [],
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId?._id || "",
        date: invoice.date ? invoice.date.substring(0, 10) : "",
        items: invoice.items || [],
      });
    }
  }, [invoice]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      await api.patch(`/invoices/${invoice._id}`, formData);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating invoice", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>

        {/* Customer */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Customer ID
          </label>
          <input
            type="text"
            value={formData.customerId}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Items */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Items
          </label>
          {formData.items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mt-1 items-center">
              <input
                type="text"
                placeholder="Name"
                value={item.name}
                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2"
              />
              <input
                type="number"
                placeholder="Qty"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", Number(e.target.value))
                }
                className="w-20 border border-gray-300 rounded p-2"
              />
              <input
                type="number"
                placeholder="Price"
                min="0"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(idx, "price", Number(e.target.value))
                }
                className="w-24 border border-gray-300 rounded p-2"
              />
              <button
                onClick={() => handleRemoveItem(idx)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            + Add Item
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
