import { Route, Routes, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<div>Sign In</div>} />
        <Route path="/sign-up" element={<div>Sign Up</div>} />
        <Route path="/products/category/:category" element={<div>Products By Category</div>} />
        <Route path="/products/:id" element={<div>Product Details</div>} />
        <Route path="/cart" element={<div>Cart</div>} />
      </Route>
    </Routes>
  );
}
