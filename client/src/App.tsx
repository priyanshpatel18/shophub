import { Route, Routes } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "/sign-in",
    element: <div>Sign In</div>,
  },
  {
    path: "/sign-up",
    element: <div>Sign Up</div>,
  },
  {
    path: "/products/category/:category",
    element: <div>Products By Category</div>,
  },
  {
    path: "/products/:id",
    element: <div>Product Details</div>,
  },
  {
    path: "/cart",
    element: <div>Cart</div>,
  },
];
export default function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        ></Route>
      ))}
    </Routes>
  );
}
