"use client";

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchProducts() {
    try {
      setIsLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        return alert(data.message);
      }

      setProducts(data.products);
      setIsLoading(false);
      return;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Loader isLoading={isLoading} />
      <div>
        <h1>Home</h1>
        <div>
          {products?.map((product, index) => (
            <div key={index}>
              <h2>{product}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
