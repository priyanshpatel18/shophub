"use client";

import { useUser } from "@/hooks/useUser";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";

export default function Navbar() {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, setUser } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      setScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  async function logout() {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-out`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      credentials: "include",
    });
  }

  return (
    <div
      className={`sticky bg-primary w-full h-16 flex items-center justify-between px-4 py-2 top-0 z-[100] transition-transform duration-300 ease-in-out ${scrollingDown ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <Link to="/">
        <Image src="/assets/logo.png" alt="logo" className="w-12 h-12" />
      </Link>

      <div className="flex gap-4 items-center relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="px-8 py-1 bg-secondary rounded-lg uppercase sm:text-md text-lg font-light tracking-wide flex items-center justify-center cursor-pointer hover:bg-muted-secondary"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.userName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2) || user.userName.slice(0, 2)}
            </button>

            {showDropdown && (
              <div className="absolute top-14 right-0 rounded-lg bg-background border-border border-2 shadow-lg">
                <Link to="/orders" className="px-4 py-2 block hover:bg-secondary hover:text-primary">
                  Orders
                </Link>
                <div className="border-border border-t-2" />
                <button
                  className="px-4 py-2 block w-full text-left hover:bg-secondary hover:text-primary"
                  onClick={async () => {
                    await logout();
                    setUser(null);
                    setShowDropdown(false);
                    localStorage.removeItem("role");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in" className="px-8 py-1 bg-secondary rounded-lg uppercase sm:text-md text-lg font-light tracking-wide">
            Login
          </Link>
        )}

        <Link to="/cart" className="relative text-white">
          <ShoppingCart className="w-8 h-8" />
          <p className="absolute text-lg -top-1/2 left-2/3 -translate-x-2/3 font-bold">{user?.cart?.cartProducts.length}</p>
        </Link>
      </div>
    </div>
  );
}
