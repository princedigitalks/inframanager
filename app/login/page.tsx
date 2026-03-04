"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/store/hooks";
import { login } from "@/src/store/authSlice";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(login(formData)).unwrap();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-[#E2E8F0]">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-[#2D31A6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Shield size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#1A1C1E] mb-2 text-center">Welcome Back</h2>
        <p className="text-[#64748B] text-center mb-8">Sign in to InfraManager Console</p>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#1A1C1E] mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1C1E] mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D31A6] text-white py-3.5 rounded-xl font-bold hover:bg-[#1E217A] transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
