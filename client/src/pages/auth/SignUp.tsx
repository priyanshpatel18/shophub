"use client";

import Image from "@/components/Image";
import { useSnackbar } from "notistack";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [isVendor, setIsVendor] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/sign-up`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            isVendor,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
      return enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Something went wrong, Please try again", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 bg-background rounded-lg px-6 sm:px-12 py-12">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
            <Link to="/" className="inline-flex self-center">
              <Image
                src="/assets/logo.png"
                alt="logo"
                className="w-24 h-24 sm:w-32 sm:h-32"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-center">
              Create Account
            </h1>

            <label htmlFor="userName" className="flex flex-col gap-1 w-full">
              <span className="capitalize text-sm font-semibold">
                Your name
              </span>
              <input
                id="userName"
                className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black"
                placeholder="Enter your name"
                type="text"
                autoFocus
                required
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
            </label>

            <label htmlFor="email" className="flex flex-col gap-1 w-full">
              <span className="capitalize text-sm font-semibold">Email</span>
              <input
                id="email"
                className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black"
                placeholder="example@xyz.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label htmlFor="password" className="flex flex-col gap-1 w-full">
              <span className="capitalize text-sm font-semibold">Password</span>
              <input
                id="password"
                className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black"
                placeholder="At least 8 characters"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <label className="flex items-center cursor-pointer gap-2">
              <span>Are you a vendor?</span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isVendor}
                onChange={() => setIsVendor(!isVendor)}
              />
              <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>

            {isVendor && (
              <label
                htmlFor="companyName"
                className="flex flex-col gap-1 w-full"
              >
                <span className="capitalize text-sm font-semibold">
                  Company Name
                </span>
                <input
                  id="companyName"
                  className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black"
                  placeholder="Enter your company name"
                  type="text"
                  required
                  autoFocus
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </label>
            )}

            <button
              className="p-3 bg-secondary w-full rounded-md uppercase cursor-pointer hover:bg-muted-secondary"
              type="submit"
              disabled={isLoading}
            >
              Create Account
            </button>
          </form>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-blue-700 hover:text-blue-800 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
