"use client";

import { Users, Plus, Shield, Mail, MoreHorizontal } from "lucide-react";

const users = [
  { id: 1, name: "Admin User", email: "admin@inframanager.com", role: "Administrator", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "John Developer", email: "john@company.com", role: "Developer", status: "Active", lastLogin: "5 hours ago" },
  { id: 3, name: "Sarah Manager", email: "sarah@company.com", role: "Manager", status: "Active", lastLogin: "1 day ago" },
  { id: 4, name: "Mike Viewer", email: "mike@company.com", role: "Viewer", status: "Inactive", lastLogin: "3 days ago" },
];

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">User Management</h2>
          <p className="text-[#64748B] mt-1">Manage team members and access permissions</p>
        </div>
        <button className="bg-[#2D31A6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-[#1E217A] transition-all flex items-center gap-2">
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "24", color: "bg-blue-50 text-blue-600" },
          { label: "Active", value: "18", color: "bg-green-50 text-green-600" },
          { label: "Administrators", value: "3", color: "bg-purple-50 text-purple-600" },
          { label: "Pending", value: "2", color: "bg-orange-50 text-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
            <p className="text-sm font-semibold text-[#64748B] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#1A1C1E]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Email</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Last Login</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#F8F9FB] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold text-[#1A1C1E]">{user.name}</p>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <Mail size={14} />
                    {user.email}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#2D31A6]" />
                    <span className="text-sm font-medium text-[#64748B]">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  {user.status === "Active" ? (
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-50 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 text-sm text-[#64748B]">{user.lastLogin}</td>
                <td className="px-8 py-5">
                  <button className="p-2 text-[#94A3B8] hover:text-[#1A1C1E] hover:bg-white rounded-lg transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
