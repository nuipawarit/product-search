import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/search" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/search"
      element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
