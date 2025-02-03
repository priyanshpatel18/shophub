"use client";

import { useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  userName: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  companyName?: string;
  vendor?: Vendor;
  customer?: Customer;
  cart?: Cart;
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
  cartProducts: {
    id: string;
    quantity: number;
    productId: string;
    product: Product;
    price: number;
  }[]
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

    const user = {
      id: data.user.id,
      email: data.user.email,
      userName: data.user.userName,
      role: data.user.role,
      companyName: data.user.vendor[0] ? data.user.vendor[0].companyName : undefined,
      vendor: data.user.vendor[0] ? data.user.vendor[0] : undefined,
      customer: data.user.customer[0] ? data.user.customer[0] : undefined,
      cart: data.user.cart
    }

    setUser(user);
  }

  useEffect(() => {
    getUser();
  }, []);

  return { user, setUser };
}