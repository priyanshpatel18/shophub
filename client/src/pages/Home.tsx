"use client";

import Image from "@/components/Image";
import Loader from "@/components/Loader";
import { useUser } from "@/hooks/useUser";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  imageUrl: string;
  vendorId?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();

  async function fetchProducts() {
    try {
      setIsLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/customer/get-products`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return console.error(data.message);
      }

      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStorageChange = () => {
    const role = localStorage.getItem("role");
    setIsCustomer(role === "CUSTOMER");

    if (role === "CUSTOMER") fetchProducts();
  };


  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleStorageChange);

    let role = localStorage.getItem("role");
    if (role) {
      setIsCustomer(role === "CUSTOMER");
    } else {
      localStorage.setItem("role", "CUSTOMER");
      setIsCustomer(true);
      role = "CUSTOMER";
    }

    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleStorageChange);
    };
  }, []);

  async function addToCart(productId: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/add-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return enqueueSnackbar(data.message, {
          variant: "error",
        })
      }

      enqueueSnackbar(data.message, {
        variant: "success",
      })
    } catch (error) {
      console.error(error);
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen">
      {isCustomer && (
        <div className="p-4 lg:p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products?.map((product, index) => (
            <div
              key={index}
              className="flex flex-col border-2 border-border p-2 rounded-md gap-1 cursor-pointer"
              onClick={() => {
                alert("Product Added To Cart");
              }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="self-center w-full h-36 md:h-56 lg:h-64 object-cover"
              />
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-sm">{product.description}</p>
              <div className="flex gap-2 items-end">
                <p className="text-green-500 text-2xl font-bold flex">
                  <span className="text-sm ">₹</span>
                  {((product.price * (100 - product.discount)) / 100).toFixed(2)}
                </p>
                <p className="text-red-500 text-muted-foreground line-through text-sm">
                  ₹{product.price}
                </p>
                <p className="text-sm font-medium">({product.discount}%)</p>
              </div>
              <button className="bg-secondary text-primary p-2 rounded-md hover:bg-muted-secondary z-50" onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}>
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {!isCustomer && (
        <div className="p-4 space-y-4">
          <h1>Welcome {user?.companyName} !</h1>
          <p>Your Products</p>

          <div>
            {user?.vendor?.products.length! > 0 ? user?.vendor?.products.map((product) => (
              <div key={product.id}>

              </div>
            )) : (
              <div>
                <p className="text-gray-500 text-sm">
                  You don't have any products listed
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
