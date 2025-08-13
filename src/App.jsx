import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import AppInit from "./components/AppInit";

import InvoicesPage from "./pages/InvoicesPage";
import CustomersPage from "./pages/CustomersPage";
import InvoiceDetails from "./components/InvoiceDetails";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected dashboard routes */}
          <Route
            element={
              <AppInit>
                <ProtectedRoute />
              </AppInit>
            }
          >
            {/* Dashboard layout with nested routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="invoices" replace />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
