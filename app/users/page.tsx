"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Mail, MoreHorizontal, Edit, Trash2, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchUsers, createUser, updateUser, deleteUser, updateUserStatus } from "@/src/store/userSlice";
import { CreateUserData, UpdateUserData } from "@/src/services/userService";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, total, currentPage, totalPages } = useAppSelector((state) => state.users);
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchUsers({ page: 1, limit: 10, search: searchTerm, status: statusFilter }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData: UpdateUserData = { ...formData };
        if (!formData.password) delete updateData.password;
        await dispatch(updateUser({ id: editingUser._id, data: updateData })).unwrap();
      } else {
        await dispatch(createUser(formData as CreateUserData)).unwrap();
      }
      setShowModal(false);
      resetForm();
      dispatch(fetchUsers({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      department: user.department || "",
      designation: user.designation || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id)).unwrap();
      dispatch(fetchUsers({ page: currentPage, limit: 10 }));
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await dispatch(updateUserStatus({ id, status: newStatus })).unwrap();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", phone: "", department: "", designation: "" });
    setEditingUser(null);
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const inactiveUsers = users.filter(u => u.status === "inactive").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">User Management</h2>
          <p className="text-[#64748B] mt-1">Manage team members and access permissions</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-[#2D31A6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-[#1E217A] transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: total.toString(), color: "bg-blue-50 text-blue-600" },
          { label: "Active", value: activeUsers.toString(), color: "bg-green-50 text-green-600" },
          { label: "Inactive", value: inactiveUsers.toString(), color: "bg-orange-50 text-orange-600" },
          { label: "Departments", value: new Set(users.map(u => u.department)).size.toString(), color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
            <p className="text-sm font-semibold text-[#64748B] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#1A1C1E]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-[#2D31A6] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#1E217A] transition-all"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Department</th>
                <th className="px-8 py-4">Designation</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[#F8F9FB] transition-colors">
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
                  <td className="px-8 py-5 text-sm text-[#64748B]">{user.department || "-"}</td>
                  <td className="px-8 py-5 text-sm text-[#64748B]">{user.designation || "-"}</td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-50 text-gray-600"
                      } text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider cursor-pointer hover:opacity-80`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-[#94A3B8] hover:text-[#1A1C1E]">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <input
                type="password"
                placeholder={editingUser ? "Password (leave blank to keep current)" : "Password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D31A6]"
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-xl font-bold text-sm text-[#64748B] hover:bg-[#F8F9FB] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2D31A6] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#1E217A] transition-all"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
