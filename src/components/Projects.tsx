import React, { useState, useEffect } from "react";
import { projectService } from "../services/projectService";
import { serverService } from "../services/serverService";
import {
  Terminal, Plus, CheckCircle2, XCircle, AlertCircle, Edit2, Trash2, Eye, EyeOff
} from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'common' | 'admin' | 'backend' | 'website'>('common');
  const [showModalFields, setShowModalFields] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    server: "",
    status: "running",
    description: "",
    projectPath: "",
    nginxConfig: "",
    nginxContent: "",
    nginxDescription: "",
    adminPanel: { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" },
    backend: { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" },
    website: { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" }
  });

  const fetchData = async () => {
    try {
      const [projectRes, serverRes] = await Promise.all([
        projectService.getAll(),
        serverService.getAll(),
      ]);
      setProjects(projectRes.data || []);
      setServers(serverRes.data || []);
      if (serverRes.data?.length > 0) {
        setFormData((prev) => ({ ...prev, server: serverRes.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projectService.update(editingId, formData);
      } else {
        await projectService.create(formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(editingId ? "Failed to update project" : "Failed to create project");
    }
  };

  const handleEdit = async (project: any) => {
    try {
      const response = await projectService.getById(project._id);
      const projectData = response.data;
      setEditingId(project._id);
      setFormData({
        name: projectData.name,
        server: projectData.server?._id || "",
        status: projectData.status,
        description: projectData.description || "",
        projectPath: projectData.projectPath || "",
        nginxConfig: projectData.nginxConfig || "",
        nginxContent: projectData.nginxContent || "",
        nginxDescription: projectData.nginxDescription || "",
        adminPanel: projectData.adminPanel || { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" },
        backend: projectData.backend || { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" },
        website: projectData.website || { domain: "", technology: "Node.js", port: "", envFile: "", envContent: "", envDescription: "", pm2Name: "", pm2Description: "" }
      });
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to fetch project details");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.delete(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      running: <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 size={12} /> Running</span>,
      stopped: <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><XCircle size={12} /> Stopped</span>,
      maintenance: <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><AlertCircle size={12} /> Maintenance</span>
    };
    return badges[status as keyof typeof badges] || null;
  };

  const updateTabField = (tab: 'adminPanel' | 'backend' | 'website', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">Project Inventory</h2>
          <p className="text-[#64748B] mt-1">Manage applications, microservices and their deployment configurations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#2D31A6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-[#1E217A] transition-all flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">Project Name</th>
                <th className="px-8 py-4">Host Server</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {projects.map((project, i) => (
                <motion.tr key={project._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#F8F9FB] transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-[#1A1C1E]">{project.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Terminal size={14} />
                      </div>
                      <span className="text-sm font-medium text-[#64748B]">{project.server?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">{getStatusBadge(project.status)}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => handleEdit(project)} className="p-2 text-[#94A3B8] hover:text-[#2D31A6] hover:bg-[#F1F5FF] rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(project._id)} className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setActiveTab('common'); }} title={editingId ? "Edit Project" : "Add New Project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 border-b border-[#E2E8F0]">
            {(['common', 'admin', 'backend', 'website'] as const).map(tab => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === tab ? 'text-[#2D31A6] border-b-2 border-[#2D31A6]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}>
                {tab === 'common' ? 'Common' : tab === 'admin' ? 'Admin Panel' : tab === 'backend' ? 'Backend' : 'Website'}
              </button>
            ))}
          </div>

          <div className="px-1">
          {activeTab === 'common' && (
            <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Project Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="e.g. Customer Portal" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Host Server</label>
              <select value={formData.server} onChange={(e) => setFormData({ ...formData, server: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none">
                {servers.map((s) => (<option key={s._id} value={s._id}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none">
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={1} placeholder="Project description..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Project Path</label>
              <div className="relative">
                <input type="text" value={formData.projectPath} onChange={(e) => setFormData({ ...formData, projectPath: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="/var/www/project" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                  {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Nginx Config Path</label>
              <div className="relative">
                <input type="text" value={formData.nginxConfig} onChange={(e) => setFormData({ ...formData, nginxConfig: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="/etc/nginx/sites-available/example.com" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                  {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Nginx File Content</label>
              <div className="relative">
                <textarea value={formData.nginxContent} onChange={(e) => setFormData({ ...formData, nginxContent: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={2} placeholder="server { ... }" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                  {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Nginx Description</label>
              <div className="relative">
                <textarea value={formData.nginxDescription} onChange={(e) => setFormData({ ...formData, nginxDescription: e.target.value })} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={1} placeholder="Notes about nginx configuration" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                  {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            </div>
          )}

          {(activeTab === 'admin' || activeTab === 'backend' || activeTab === 'website') && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Domain Name</label>
                <input type="text" value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].domain} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'domain', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="https://example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Technology</label>
                <select value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].technology} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'technology', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none">
                  <option>Node.js</option>
                  <option>Next.js</option>
                  <option>PHP</option>
                  <option>Laravel</option>
                  <option>Python</option>
                  <option>Django</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">Port Number</label>
                <div className="relative">
                  <input type="text" value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].port} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'port', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="3000" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">ENV File Path</label>
                <div className="relative">
                  <input type="text" value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].envFile} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'envFile', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="/var/www/project/.env" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">ENV File Content</label>
                <div className="relative">
                  <textarea value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].envContent} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'envContent', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={2} placeholder="PORT=3000" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">ENV Description</label>
                <div className="relative">
                  <textarea value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].envDescription} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'envDescription', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={1} placeholder="Notes about environment variables" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">PM2 Name</label>
                <div className="relative">
                  <input type="text" value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].pm2Name} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'pm2Name', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" placeholder="e.g. customer-api" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-[#1A1C1E] mb-1">PM2 Description</label>
                <div className="relative">
                  <textarea value={formData[activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website'].pm2Description} onChange={(e) => updateTabField(activeTab === 'admin' ? 'adminPanel' : activeTab === 'backend' ? 'backend' : 'website', 'pm2Description', e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-2 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none" rows={1} placeholder="Notes about PM2 process" style={{ filter: showModalFields ? 'none' : 'blur(4px)' }} />
                  <button type="button" onClick={() => setShowModalFields(!showModalFields)} className="absolute right-4 top-2 text-[#94A3B8] hover:text-[#2D31A6] transition-colors">
                    {showModalFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>

          <div className="flex gap-4 pt-3 sticky bottom-0 bg-white">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-[#E2E8F0] text-[#64748B] py-2.5 rounded-xl font-bold text-sm hover:bg-[#F8F9FB] transition-all">Cancel</button>
            <button type="submit" className="flex-1 bg-[#2D31A6] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#1E217A] transition-all shadow-lg shadow-indigo-100">Deploy Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
