"use client";

import { useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  userName: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  imageUrl: string;
  vendorId: string;
}

export interface Cart {
  id: string;
  products: Product[];
  totalPrice: number;
}

export interface Customer {
  id: string;
  email: string;
  userName: string;
  cart: Cart[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  description?: string;
  products: Product[];
  address: Address;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  async function getUser() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    setUser(data.user);
  }

  useEffect(() => {
    getUser();
  }, []);

  return { user };
}