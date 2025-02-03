import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/auth/SignUp";
import CartPage from "./pages/Cart";

function Layout() {
  const authPages = ["/sign-in", "/sign-up"];
  const location = useLocation();

  if (authPages.includes(location.pathname)) {
    return <Outlet />;
  }
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
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/products/category/:category"
          element={<div>Products By Category</div>}
        />
        <Route path="/products/:id" element={<div>Product Details</div>} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}
