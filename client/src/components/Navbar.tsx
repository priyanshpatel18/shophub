"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useUser();

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
        {user ? (
          <div className="px-8 py-1 bg-secondary rounded-lg uppercase sm:text-md text-lg font-light tracking-wide flex items-center justify-center cursor-pointer hover:bg-muted-secondary">
            {user.userName
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2) || user.userName.slice(0, 2)}
          </div>
        ) : (
          <Link
            to="/sign-in"
            className="px-8 py-1 bg-secondary rounded-lg uppercase sm:text-md text-lg font-light tracking-wide"
          >
            login
          </Link>
        )}

        <Link to="/cart">
          <ShoppingCart className="w-8 h-8 text-white" />
        </Link>
      </div>
    </div>
  );
}
