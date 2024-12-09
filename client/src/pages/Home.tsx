"use client";

import Image from "@/components/Image";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

const products = [
  {
    id: "1",
    name: "Product 1",
    description: "Description 1",
    price: 10,
    discount: 5,
    quantity: 10,
    imageUrl: "https://avatarfiles.alphacoders.com/366/thumb-1920-366278.jpg",
  },
  {
    id: "2",
    name: "Product 2",
    description: "Description 2",
    price: 20,
    discount: 10,
    quantity: 5,
    imageUrl:
      "https://i.pinimg.com/736x/24/bd/ee/24bdeecd546a2c6b7e34857a104afe68.jpg",
  },
  {
    id: "3",
    name: "Product 3",
    description: "Description 3",
    price: 30,
    discount: 15,
    quantity: 3,
    imageUrl:
      "https://i.pinimg.com/736x/61/46/18/614618a4559d83a80e4934179d8eb8e9.jpg",
  },
  {
    id: "4",
    name: "Product 4",
    description: "Description 4",
    price: 40,
    discount: 20,
    quantity: 2,
    imageUrl:
      "https://w0.peakpx.com/wallpaper/294/226/HD-wallpaper-eren-jaeger-aot-attack-on-titan-eren-yeager-fire-season-4-shingeki-on-kyojin.jpg",
  },
  {
    id: "5",
    name: "Product 5",
    description: "Description 5",
    price: 50,
    discount: 25,
    quantity: 1,
    imageUrl: "https://images7.alphacoders.com/673/673499.jpg",
  },
  {
    id: "6",
    name: "Product 6",
    description: "Description 6",
    price: 60,
    discount: 30,
    quantity: 0,
    imageUrl: "https://avatarfiles.alphacoders.com/375/375542.png",
  },
  {
    id: "7",
    name: "Product 7",
    description: "Description 7",
    price: 9230.77,
    discount: 35,
    quantity: 0,
    imageUrl:
      "https://img.freepik.com/premium-photo/hand-drawn-cartoon-anime-cool-swimsuit-girl-illustration-summer_561641-6762.jpg?semt=ais_hybrid",
  },
  {
    id: "8",
    name: "Product 8",
    description: "Description 8",
    price: 80,
    discount: 40,
    quantity: 0,
    imageUrl:
      "https://live.staticflickr.com/65535/53581050678_98072c79e6_c.jpg",
  },
];

export default function Home() {
  // const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  async function fetchProducts() {
    try {
      setIsLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return console.error(data.message);
      }

      // setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    localStorage.getItem("role") === "CUSTOMER"
      ? setIsCustomer(true)
      : setIsCustomer(false);
    if (!localStorage.getItem("role")) {
      localStorage.setItem("role", "CUSTOMER");
      setIsCustomer(true);
    }
    fetchProducts();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen">
      {isCustomer && (
        <div className="p-4 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {products?.map((product, index) => (
            <div
              key={index}
              className="flex flex-col border-2 border-border p-2 rounded-md gap-1"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="self-center w-full h-40 md:h-60 lg:h-72 object-cover"
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
              <button className="bg-secondary text-primary p-2 rounded-md hover:bg-muted-secondary">
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
