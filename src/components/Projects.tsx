import React, { useState, useEffect } from "react";
import { projectService } from "../services/projectService";
import { serverService } from "../services/serverService";
import {
  Briefcase,
  Globe,
  Database,
  Terminal,
  GitBranch,
  ExternalLink,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { Modal } from "./Modal";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    server: "",
    name: "",
    domain: "",
    technology: "Node.js",
    port: 0,
    status: "running",
    description: "",
    projectPath: "",
    nginxConfig: "",
    nginxContent: "",
    nginxDescription: "",
    envFile: "",
    envContent: "",
    envDescription: "",
    pm2Name: "",
    pm2Description: "",
  });

  const fetchData = async () => {
    setLoading(true);
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
      const submitData = { ...formData, domain: `https://${formData.domain}` };
      if (editingId) {
        await projectService.update(editingId, submitData);
      } else {
        await projectService.create(submitData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        server: "",
        name: "",
        domain: "",
        technology: "Node.js",
        port: 3000,
        status: "running",
        description: "",
        projectPath: "",
        nginxConfig: "",
        nginxContent: "",
        nginxDescription: "",
        envFile: "",
        envContent: "",
        envDescription: "",
        pm2Name: "",
        pm2Description: "",
      });
      fetchData();
    } catch (err) {
      alert(
        editingId ? "Failed to update project" : "Failed to create project",
      );
    }
  };

  const handleEdit = async (project: any) => {
    setEditingId(project._id);
    setFormData({
      server: project.server?._id || "",
      name: project.name,
      domain: project.domain.replace(/^https:\/\//, ""),
      technology: project.technology || "Node.js",
      port: project.port || 3000,
      status: project.status,
      description: project.description || "",
      projectPath: project.projectPath || "",
      nginxConfig: project.nginxConfig || "",
      nginxContent: project.nginxContent || "",
      nginxDescription: project.nginxDescription || "",
      envFile: project.envFile || "",
      envContent: project.envContent || "",
      envDescription: project.envDescription || "",
      pm2Name: project.pm2Name || "",
      pm2Description: project.pm2Description || "",
    });
    setIsModalOpen(true);
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
    switch (status) {
      case "running":
        return (
          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Running
          </span>
        );
      case "stopped":
        return (
          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <XCircle size={12} /> Stopped
          </span>
        );
      case "maintenance":
        return (
          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={12} /> Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">
            Project Inventory
          </h2>
          <p className="text-[#64748B] mt-1">
            Manage applications, microservices and their deployment
            configurations.
          </p>
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
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={18}
          />
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
            {servers.map((s) => (
              <option key={s._id}>{s.name}</option>
            ))}
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
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {projects.map((project, i) => (
                <motion.tr
                  key={project._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#F8F9FB] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-[#1A1C1E]">
                        {project.name}
                      </p>
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
                      <span className="text-sm font-medium text-[#64748B]">
                        {project.server?.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F1F5FF] text-[#2D31A6] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        {project.technology}
                      </div>
                      <span className="text-xs text-[#94A3B8] font-medium">
                        Port: {project.port}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-[#94A3B8] hover:text-[#2D31A6] hover:bg-[#F1F5FF] rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Edit Project" : "Add New Project"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto px-1"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Project Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="e.g. Customer API"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Domain Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-medium text-[#64748B] pointer-events-none">
                  https://
                </span>
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 pl-[70px] pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                  placeholder="api.example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Host Server
              </label>
              <select
                value={formData.server}
                onChange={(e) =>
                  setFormData({ ...formData, server: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                {servers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Technology
              </label>
              <select
                value={formData.technology}
                onChange={(e) =>
                  setFormData({ ...formData, technology: e.target.value })
                }
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
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Port Number
              </label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) =>
                  setFormData({ ...formData, port: parseInt(e.target.value) })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
              >
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Project Path
              </label>
              <input
                type="text"
                value={formData.projectPath}
                onChange={(e) =>
                  setFormData({ ...formData, projectPath: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="/var/www/project"
              />
            </div>

            {/* Nginx Section */}
            <div className="col-span-2 border-t border-[#E2E8F0] pt-4 mt-2">
              <h3 className="text-sm font-bold text-[#1A1C1E] mb-4">
                Nginx Configuration
              </h3>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Nginx Config Path
              </label>
              <input
                type="text"
                value={formData.nginxConfig}
                onChange={(e) =>
                  setFormData({ ...formData, nginxConfig: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="/etc/nginx/sites-available/example.com"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Nginx File Content
              </label>
              <textarea
                value={formData.nginxContent}
                onChange={(e) =>
                  setFormData({ ...formData, nginxContent: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                rows={4}
                placeholder="server { ... }"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                Nginx Description
              </label>
              <textarea
                value={formData.nginxDescription}
                onChange={(e) =>
                  setFormData({ ...formData, nginxDescription: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                rows={2}
                placeholder="Notes about nginx configuration"
              />
            </div>

            {/* ENV Section */}
            <div className="col-span-2 border-t border-[#E2E8F0] pt-4 mt-2">
              <h3 className="text-sm font-bold text-[#1A1C1E] mb-4">
                Environment File
              </h3>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                ENV File Path
              </label>
              <input
                type="text"
                value={formData.envFile}
                onChange={(e) =>
                  setFormData({ ...formData, envFile: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="/var/www/project/.env"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                ENV File Content
              </label>
              <textarea
                value={formData.envContent}
                onChange={(e) =>
                  setFormData({ ...formData, envContent: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                rows={4}
                placeholder="PORT=3000\nDB_HOST=localhost"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                ENV Description
              </label>
              <textarea
                value={formData.envDescription}
                onChange={(e) =>
                  setFormData({ ...formData, envDescription: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                rows={2}
                placeholder="Notes about environment variables"
              />
            </div>

            {/* PM2 Section */}
            <div className="col-span-2 border-t border-[#E2E8F0] pt-4 mt-2">
              <h3 className="text-sm font-bold text-[#1A1C1E] mb-4">
                PM2 Configuration
              </h3>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                PM2 Name
              </label>
              <input
                type="text"
                value={formData.pm2Name}
                onChange={(e) =>
                  setFormData({ ...formData, pm2Name: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                placeholder="e.g. customer-api"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1A1C1E] mb-2">
                PM2 Description
              </label>
              <textarea
                value={formData.pm2Description}
                onChange={(e) =>
                  setFormData({ ...formData, pm2Description: e.target.value })
                }
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 outline-none"
                rows={2}
                placeholder="Notes about PM2 process"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
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
