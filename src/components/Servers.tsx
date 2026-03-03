import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Server as ServerIcon, MoreVertical, Trash2, Edit2, Plus, HardDrive, Monitor, Shield, Search, Filter, Download, Globe, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

export function Servers() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    provider: "AWS",
    os_type: "Ubuntu 22.04",
    description: ""
  });

  const fetchServers = () => {
    setLoading(true);
    api.servers.list()
      .then(setServers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.servers.create(formData);
      setIsModalOpen(false);
      setFormData({ name: "", ip_address: "", provider: "AWS", os_type: "Ubuntu 22.04", description: "" });
      fetchServers();
    } catch (err) {
      alert("Failed to create server");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this server? All associated projects will be removed.")) {
      try {
        await api.servers.delete(id);
        fetchServers();
      } catch (err) {
        alert("Failed to delete server");
      }
    }
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
            key={server.id}
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
                  <button className="p-2 text-[#94A3B8] hover:text-[#2D31A6] hover:bg-[#F1F5FF] rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(server.id)}
                    className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1A1C1E] mb-1">{server.name}</h3>
                <p className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                  <Globe size={14} className="text-[#94A3B8]" />
                  {server.ip_address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Provider</p>
                  <p className="text-sm font-bold text-[#1A1C1E]">{server.provider}</p>
                </div>
                <div className="bg-[#F8F9FB] p-3 rounded-2xl border border-[#F1F5F9]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">OS Type</p>
                  <p className="text-sm font-bold text-[#1A1C1E]">{server.os_type}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Online</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Briefcase size={14} />
                  <span className="text-sm font-bold">{server.project_count} Projects</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Server">
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
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="192.168.1.1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Provider</label>
              <select 
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option>AWS</option>
                <option>DigitalOcean</option>
                <option>Google Cloud</option>
                <option>Azure</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">OS Type</label>
              <select 
                value={formData.os_type}
                onChange={(e) => setFormData({ ...formData, os_type: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option>Ubuntu 22.04</option>
                <option>Ubuntu 20.04</option>
                <option>CentOS 7</option>
                <option>Debian 11</option>
                <option>Windows Server</option>
              </select>
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
              Provision Server
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
