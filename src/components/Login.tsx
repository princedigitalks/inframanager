import React, { useState } from "react";
import { Shield, Lock, Mail, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { motion } from "motion/react";

export function Login({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState("admin@inframanager.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await api.auth.login(email, password);
      localStorage.setItem("token", token);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100 p-10 border border-[#E2E8F0]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#2D31A6] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1C1E] mb-2">Welcome Back</h2>
            <p className="text-[#64748B] text-center">Enter your credentials to access the management console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1C1E] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 focus:border-[#2D31A6] transition-all outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1C1E] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 focus:border-[#2D31A6] transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2D31A6] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1E217A] transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 group"
            >
              {loading ? "Authenticating..." : "Sign In to Console"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#94A3B8]">
              Don't have access? <a href="#" className="text-[#2D31A6] font-bold hover:underline">Contact System Admin</a>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[#94A3B8] text-xs font-medium uppercase tracking-[0.2em]">
          &copy; 2024 InfraManager Pro &bull; v2.4.0
        </p>
      </motion.div>
    </div>
  );
}
