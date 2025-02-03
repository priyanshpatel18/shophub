"use client";

import Image from "@/components/Image";
import { Eye, EyeOff } from "lucide-react";
import { useSnackbar } from "notistack";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (!form.email || !form.password) {
      return enqueueSnackbar("Please fill all the fields", {
        variant: "error",
      });
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        return enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
      
      if (data.role) {
        localStorage.setItem("role", data.role);
      }
      enqueueSnackbar(data.message, {
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 bg-background rounded-lg px-6 sm:px-12 py-12">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <Link to="/" className="inline-flex self-center">
              <Image
                src="/assets/logo.png"
                alt="logo"
                className="w-24 h-24 sm:w-32 sm:h-32"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-center">
              Welcome to Shophub
            </h1>

            <label htmlFor="email" className="flex flex-col gap-1 w-full">
              <span className="capitalize text-sm font-semibold">Email</span>
              <input
                id="email"
                className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black"
                placeholder="example@xyz.com"
                type="email"
                autoFocus
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label
              htmlFor="password"
              className="flex flex-col gap-1 w-full relative"
            >
              <span className="capitalize text-sm font-semibold">Password</span>
              <div className="relative">
                <input
                  id="password"
                  className="border border-gray-600 rounded-sm p-3 bg-transparent text-lg sm:text-xl focus:outline-black w-full pr-10"
                  placeholder="At least 8 characters"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600 hover:text-black" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600 hover:text-black" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="p-3 bg-secondary w-full rounded-md uppercase cursor-pointer hover:bg-muted-secondary"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm">
            Don&lsquo;t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-700 hover:text-blue-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
