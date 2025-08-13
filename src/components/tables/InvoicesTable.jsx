import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Pencil, Trash2, Printer } from "lucide-react";
import api from "../../api/axiosInstance";
import EditInvoiceModal from "../modals/EditInvoiceModal";
import useScreenWidth from "../../hooks/useScreenWidth";
import { generateInvoicePDF } from "../../utils/pdfUtils";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import PrintedInvoice from "./PrintedInVoice";
import { Link, useNavigate } from "react-router-dom";

const MOBILE_BREAKPOINT = 768;
const DATE_FORMAT = "DD MMM YYYY";

const STATUS_CONFIG = {
  deleted: { label: "محذوف", bgColor: "bg-red-100", textColor: "text-red-600" },
  modified: {
    label: "معدل",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  active: {
    label: "نشط",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
};

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const printableRef = useRef();
  const screenWidth = useScreenWidth();
  const isMobile = useMemo(
    () => screenWidth < MOBILE_BREAKPOINT,
    [screenWidth]
  );
  const navigate = useNavigate();

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoices");
      setInvoices(res.data || []);
    } catch (err) {
      toast.error("حدث خطأ أثناء جلب الفواتير");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const calculateTotal = useCallback((items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) return;
      try {
        setIsDeleting(id);
        await api.delete(`/invoices/${id}`);
        await fetchInvoices();
        toast.success("تم حذف الفاتورة بنجاح");
      } catch {
        toast.error("حدث خطأ أثناء حذف الفاتورة");
      } finally {
        setIsDeleting(null);
      }
    },
    [fetchInvoices]
  );

  const handleEditInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setSelectedInvoice(null);
  }, []);

  const handleGeneratePDF = async (invoice) => {
    try {
      setSelectedInvoice(invoice);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await generateInvoicePDF(invoice, printableRef, setIsGeneratingPDF);
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  const getInvoiceStatus = useCallback((invoice) => {
    if (invoice.isDeleted) return STATUS_CONFIG.deleted;
    if (invoice.isModified) return STATUS_CONFIG.modified;
    return STATUS_CONFIG.active;
  }, []);

  const ActionButton = ({
    onClick,
    color,
    icon: Icon,
    title,
    disabled = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} p-2 rounded-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bgColor} ${status.textColor}`}
    >
      {status.label}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8" dir="rtl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-gray-500 mr-2">جاري تحميل الفواتير...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8" dir="rtl">
        <p className="text-gray-500">لا توجد فواتير متاحة</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="font-arabic">
      {isMobile ? (
        <div className="space-y-4">
          {invoices.map((invoice) => {
            const status = getInvoiceStatus(invoice);
            const total = invoice.totalAmount || calculateTotal(invoice.items);

            return (
              <div
                key={invoice._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`${invoice._id}`)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {invoice.customerName || "عميل غير محدد"}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {dayjs(invoice.date).format(DATE_FORMAT)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">الهاتف:</span>{" "}
                      {invoice.customerPhone || "غير محدد"}
                    </p>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    المجموع: {total.toFixed(2)} جنيه
                  </p>
                </div>

                {/* أزرار الأكشن في الموبايل */}
                <div className="flex justify-start gap-2 mt-3">
                  <ActionButton
                    onClick={() => handleEditInvoice(invoice)}
                    color="text-indigo-600 hover:bg-indigo-50"
                    icon={Pencil}
                    title="تعديل الفاتورة"
                  />
                  <ActionButton
                    onClick={() => handleDelete(invoice._id)}
                    color="text-red-600 hover:bg-red-50"
                    icon={Trash2}
                    title="حذف الفاتورة"
                    disabled={isDeleting === invoice._id}
                  />
                  <ActionButton
                    onClick={() => handleGeneratePDF(invoice)}
                    color="text-green-600 hover:bg-green-50"
                    icon={Printer}
                    title="تحميل PDF"
                    disabled={isGeneratingPDF}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  المجموع الكلي
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const status = getInvoiceStatus(invoice);
                const total =
                  invoice.totalAmount || calculateTotal(invoice.items);

                return (
                  <tr
                    key={invoice._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.customerName || "عميل غير محدد"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customerPhone || "غير محدد"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(invoice.date).format(DATE_FORMAT)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {total.toFixed(2)} جنيه
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="flex justify-start gap-2">
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditInvoice(invoice);
                          }}
                          color="text-indigo-600 hover:bg-indigo-50"
                          icon={Pencil}
                          title="تعديل الفاتورة"
                        />
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(invoice._id);
                          }}
                          color="text-red-600 hover:bg-red-50"
                          icon={Trash2}
                          title="حذف الفاتورة"
                          disabled={isDeleting === invoice._id}
                        />
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGeneratePDF(invoice);
                          }}
                          color="text-green-600 hover:bg-green-50"
                          icon={Printer}
                          title="تحميل PDF"
                          disabled={isGeneratingPDF}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={printableRef}>
          <PrintedInvoice invoice={selectedInvoice} />
        </div>
      </div>
      <EditInvoiceModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        invoice={selectedInvoice}
        onUpdated={fetchInvoices}
      />
    </div>
  );
}
