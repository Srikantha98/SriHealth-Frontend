import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { isAuthenticated } from "./services/auth";

function AppWrapper() {
  const location = useLocation();
  const auth = isAuthenticated();

  // Hide Navbar on login/register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  // Automatic redirect logic for public pages
  const publicRedirect = (element) => auth ? <Navigate to="/dashboard" replace /> : element;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Home: redirect to dashboard if logged in */}
        <Route path="/" element={publicRedirect(<Home />)} />

        {/* Auth pages: redirect to dashboard if logged in */}
        <Route path="/login" element={publicRedirect(<Login />)} />
        <Route path="/register" element={publicRedirect(<Register />)} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
