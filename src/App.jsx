import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminPanel from "./pages/dashboard/AdminPanel";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App; 