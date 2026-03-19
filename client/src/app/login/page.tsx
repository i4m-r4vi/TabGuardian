"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Pill, LogIn, Eye, EyeOff } from "lucide-react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

import Logo from "@/components/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.token, response.data.user);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 group">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-bold mt-3 text-sm uppercase tracking-widest">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-medium transition-all"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 pr-12 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-medium transition-all"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-2xl bg-blue-600 py-4 px-4 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-50">
          <Link href="/register" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
