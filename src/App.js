import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./user/Register";
import Login from "./user/Login";
//import Profile from "./user/Profile";
import Home from "./pages/Home";
import Companies from "./pages/Companies";
import Reservations from "./pages/Reservations";
import ProductsCompanies from "./pages/ProductsCompanies";
import ReservationForm from "./pages/ReservationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/products/:id" element={<ProductsCompanies />} />
        <Route path="/products/:id/reserve" element={<ReservationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
