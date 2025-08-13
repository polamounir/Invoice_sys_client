import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, selectIsAuthenticated } from "../app/slices/authSlice";
// import {  selectIsAuthenticated } from "../features/auth/authSlice";

export default function AppInit({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setChecking(false);
  }, [dispatch, navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // Prevent rendering until auth check is done
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
