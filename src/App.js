import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./user/Register";
import Login from "./user/Login";
//import Profile from "./user/Profile";
import Home from "./pages/Home";
import Companies from "./pages/Companies";
import ProductsCompanies from "./pages/ProductsCompanies";
import ReservationForm from "./pages/ReservationForm";
import ReservationList from "./pages/ReservationList";
import ReservationDetail from "./pages/ReservationDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/products/:id" element={<ProductsCompanies />} />
        <Route path="/products/:id/reserve" element={<ReservationForm />} />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ReservationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations/:id"
          element={
            <ProtectedRoute>
              <ReservationDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
