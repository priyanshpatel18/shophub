"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      // Detect scroll direction
      setScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`sticky bg-primary w-full h-16 flex items-center justify-between px-4 py-2 top-0 z-[100] transition-transform duration-300 ease-in-out ${
        scrollingDown ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link to="/">
        <Image src="/assets/logo.png" alt="logo" className="w-12 h-12" />
      </Link>

      <div className="flex gap-4 items-center">
        <Link
          to="/sign-in"
          className="px-8 py-1 bg-secondary rounded-lg uppercase sm:text-md text-lg font-light tracking-wide"
        >
          login
        </Link>

        <Link to="/cart">
          {/* <Image
          src="/assets/shoppingCart.png"
          alt="shopping cart"
          className="w-8 h-8"
          /> */}
          <ShoppingCart className="w-8 h-8 text-white" />
        </Link>
      </div>
    </div>
  );
}