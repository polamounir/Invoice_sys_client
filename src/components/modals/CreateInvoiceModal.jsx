import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function CreateInvoiceModal({ onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);

  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    };
    fetchCustomers();
  }, []);

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
    setItems(updated);
  };

  // Add item
  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate total
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Submit invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return alert("Please select a customer");
    if (items.length === 0) return alert("Please add at least one item");

    setLoading(true);
    try {
      await api.post("/invoices", {
        customerId,
        items,
      });
      onSuccess(); // refresh table
      onClose(); // close modal
    } catch (err) {
      console.error("Error creating invoice", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create Invoice</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium mb-2">Items</label>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => handleItemChange(i, "name", e.target.value)}
                  className="flex-1 border rounded p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                  className="w-20 border rounded p-2"
                  required
                  min={1}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(i, "price", e.target.value)}
                  className="w-24 border rounded p-2"
                  required
                  min={0}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="px-2 text-red-600 hover:text-red-800"
                  disabled={items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              + Add Item
            </button>
          </div>

          {/* Total */}
          <div className="text-right font-semibold">
            Total: ${totalAmount.toFixed(2)}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
