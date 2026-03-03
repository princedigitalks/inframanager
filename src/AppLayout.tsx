"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Server, Briefcase, FileText, LogOut, Search, Bell, Settings, Shield } from "lucide-react";
import { motion } from "motion/react";
import { api } from "@/src/lib/api";
import { Login } from "@/src/components/Login";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D31A6]"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(u: any) => setUser(u)} />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: "servers", label: "Servers", icon: Server, path: "/servers" },
    { id: "projects", label: "Projects", icon: Briefcase, path: "/projects" },
    { id: "logs", label: "Logs", icon: FileText, path: "/logs" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-[#1A1C1E] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D31A6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">InfraManager</h1>
            <p className="text-xs text-[#64748B]">Management Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-[#F1F5FF] text-[#2D31A6] font-semibold"
                    : "text-[#64748B] hover:bg-[#F8F9FB] hover:text-[#1A1C1E]"
                )}
              >
                <item.icon size={20} className={isActive ? "text-[#2D31A6]" : "text-[#94A3B8] group-hover:text-[#64748B]"} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2D31A6]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E2E8F0]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Support</p>
            <button className="w-full bg-[#2D31A6] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#1E217A] transition-colors shadow-md shadow-indigo-100">
              Contact Admin
            </button>
          </div>
          <button
            onClick={() => { localStorage.removeItem("token"); setUser(null); }}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search resources, projects or logs..."
              className="w-full bg-[#F1F5F9] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2.5 text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-all">
                <Settings size={20} />
              </button>
            </div>

            <div className="h-8 w-px bg-[#E2E8F0]"></div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#1A1C1E]">{user.name}</p>
                <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
