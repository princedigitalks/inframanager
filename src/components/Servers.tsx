import React, { useState, useEffect } from "react";
import { serverService } from "../services/serverService";
import { Server as ServerIcon, MoreVertical, Trash2, Edit2, Plus, HardDrive, Monitor, Shield, Search, Filter, Download, Globe, Briefcase, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

export function Servers() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModalFields, setShowModalFields] = useState(false);
  const [visibleCredentials, setVisibleCredentials] = useState<{[key: string]: {username: string, password: string}}>({});
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    type: "",
    username: "",
    password: "",
    description: "",
    status: "active"
  });

  const fetchServers = async () => {
    setLoading(true);
    try {
      const response = await serverService.getAll();
      setServers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await serverService.update(editingId, formData);
      } else {
        await serverService.create(formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setShowPassword(false);
      setFormData({ name: "", ipAddress: "", type: "", username: "", password: "", description: "", status: "active" });
      fetchServers();
    } catch (err) {
      alert(editingId ? "Failed to update server" : "Failed to create server");
    }
  };

  const handleEdit = async (server: any) => {
    try {
      const response = await serverService.getById(server._id);
      const serverData = response.data;
      setEditingId(server._id);
      setFormData({
        name: serverData.name,
        ipAddress: serverData.ipAddress,
        type: serverData.type || "",
        username: serverData.username || "",
        password: serverData.password || "",
        description: serverData.description || "",
        status: serverData.status
      });
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to fetch server details");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this server?")) {
      try {
        await serverService.delete(id);
        fetchServers();
      } catch (err) {
        alert("Failed to delete server");
      }
    }
  };

  const toggleCredentials = async (serverId: string) => {
    if (visibleCredentials[serverId]) {
      setVisibleCredentials(prev => {
        const updated = {...prev};
        delete updated[serverId];
        return updated;
      });
    } else {
      try {
        const response = await serverService.decryptCredentials(serverId);
        setVisibleCredentials(prev => ({
          ...prev,
          [serverId]: response.data
        }));
      } catch (error) {
        alert("Failed to decrypt credentials");
      }
    }
  };

  const maskIP = (ip: string) => {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `xxx.xxx.xxx.${parts[3]}`;
    }
    return ip.slice(0, 3) + 'x'.repeat(Math.max(0, ip.length - 6)) + ip.slice(-3);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">Server Management</h2>
          <p className="text-[#64748B] mt-1">Monitor and manage your infrastructure nodes across providers.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] text-[#64748B] px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#F8F9FB] transition-all flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2D31A6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-[#1E217A] transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add Server
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input 
            type="text" 
            placeholder="Filter by name, IP or provider..." 
            className="w-full bg-[#F8F9FB] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F8F9FB] text-[#64748B] rounded-xl text-sm font-bold hover:bg-[#F1F5F9] transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server, i) => (
          <motion.div 
            key={server._id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#F1F5FF] text-[#2D31A6] rounded-2xl flex items-center justify-center shadow-inner">
                  <ServerIcon size={28} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(server)} className="p-2 text-[#94A3B8] hover:text-[#2D31A6] hover:bg-[#F1F5FF] rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(server._id)}
                    className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1A1C1E] mb-1">{server.name}</h3>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#94A3B8]" />
                  <p className="text-sm font-medium text-[#64748B] font-mono">
                    {visibleCredentials[server._id] ? server.ipAddress : maskIP(server.ipAddress)}
                  </p>
                  <button onClick={() => toggleCredentials(server._id)} className="text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {visibleCredentials[server._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-bold text-[#1A1C1E]">{server.type || 'N/A'}</p>
                </div>
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-bold text-[#1A1C1E] capitalize">{server.status}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Username</p>
                    <button onClick={() => toggleCredentials(server._id)} className="text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                      {visibleCredentials[server._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-[#1A1C1E] break-all">
                    {visibleCredentials[server._id] ? visibleCredentials[server._id].username : '••••••••'}
                  </p>
                </div>
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Password</p>
                    <button onClick={() => toggleCredentials(server._id)} className="text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                      {visibleCredentials[server._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-[#1A1C1E] break-all">
                    {visibleCredentials[server._id] ? visibleCredentials[server._id].password : '••••••••'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${server.status === 'active' ? 'bg-emerald-500 animate-pulse' : server.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${server.status === 'active' ? 'text-emerald-600' : server.status === 'maintenance' ? 'text-yellow-600' : 'text-gray-600'}`}>{server.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setShowPassword(false); }} title={editingId ? "Edit Server" : "Add New Server"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Server Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="e.g. Production-Node-01"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">IP Address</label>
              <input 
                type="text" 
                required
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="192.168.1.1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Type</label>
              <input 
                type="text" 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="AWS, Azure, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Username</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                  placeholder="root, admin, etc."
                  style={{ filter: showModalFields ? 'none' : 'blur(4px)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowModalFields(!showModalFields)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors"
                >
                  {showModalFields ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Password</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                  placeholder="Enter server password"
                  style={{ filter: showModalFields ? 'none' : 'blur(4px)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowModalFields(!showModalFields)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors"
                >
                  {showModalFields ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none resize-none"
              placeholder="Brief description of the server's purpose..."
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-white border border-[#E2E8F0] text-[#64748B] py-3 rounded-xl font-bold text-sm hover:bg-[#F8F9FB] transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#2D31A6] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1E217A] transition-all shadow-lg shadow-indigo-100"
            >
              {editingId ? 'Update Server' : 'Create Server'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
