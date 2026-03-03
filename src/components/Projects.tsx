import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Briefcase, Globe, Database, Terminal, GitBranch, ExternalLink, Plus, Search, Filter, MoreHorizontal, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    server_id: "",
    name: "",
    domain: "",
    technology: "Node.js",
    runtime_version: "Node 18",
    port: 3000,
    environment: "Production",
    database_type: "PostgreSQL",
    status: "Running",
    git_url: "",
    deployment_path: "",
    notes: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([api.projects.list(), api.servers.list()]);
      setProjects(p);
      setServers(s);
      if (s.length > 0) setFormData(prev => ({ ...prev, server_id: s[0].id.toString() }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.projects.create({ ...formData, server_id: parseInt(formData.server_id), port: parseInt(formData.port as any) });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running": return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12} /> Running</span>;
      case "Stopped": return <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><XCircle size={12} /> Stopped</span>;
      case "Maintenance": return <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><AlertCircle size={12} /> Maintenance</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">Project Inventory</h2>
          <p className="text-[#64748B] mt-1">Manage applications, microservices and their deployment configurations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2D31A6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-[#1E217A] transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input 
            type="text" 
            placeholder="Search by project name, domain or technology..." 
            className="w-full bg-[#F8F9FB] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-bold text-[#64748B] outline-none">
            <option>All Technologies</option>
            <option>Node.js</option>
            <option>Next.js</option>
            <option>PHP</option>
            <option>Python</option>
          </select>
          <select className="bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-bold text-[#64748B] outline-none">
            <option>All Servers</option>
            {servers.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">Project Name</th>
                <th className="px-8 py-4">Host Server</th>
                <th className="px-8 py-4">Tech Stack</th>
                <th className="px-8 py-4">Environment</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {projects.map((project, i) => (
                <motion.tr 
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#F8F9FB] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-[#1A1C1E]">{project.name}</p>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                        <Globe size={12} className="text-[#94A3B8]" />
                        {project.domain}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Terminal size={14} />
                      </div>
                      <span className="text-sm font-medium text-[#64748B]">{project.server_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F1F5FF] text-[#2D31A6] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        {project.technology}
                      </div>
                      <span className="text-xs text-[#94A3B8] font-medium">{project.runtime_version}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-xs font-bold ${project.environment === 'Production' ? 'text-indigo-600' : 'text-orange-600'}`}>
                      {project.environment}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-[#94A3B8] hover:text-[#1A1C1E] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-[#E2E8F0]">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Project">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Project Name</label>
              <input 
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="e.g. Customer API"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Domain Name</label>
              <input 
                type="text" required
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="api.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Host Server</label>
              <select 
                value={formData.server_id}
                onChange={(e) => setFormData({ ...formData, server_id: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                {servers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Technology</label>
              <select 
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option>Node.js</option>
                <option>Next.js</option>
                <option>PHP</option>
                <option>Laravel</option>
                <option>Python</option>
                <option>Django</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Runtime Version</label>
              <input 
                type="text"
                value={formData.runtime_version}
                onChange={(e) => setFormData({ ...formData, runtime_version: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="e.g. Node 18"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Port Number</label>
              <input 
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">Environment</label>
              <select 
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>
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
              Deploy Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
