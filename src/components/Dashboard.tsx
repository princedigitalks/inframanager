import React, { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { Server, Briefcase, Activity, Globe, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return null;

  const COLORS = ["#2D31A6", "#7C3AED", "#EC4899", "#F59E0B", "#10B981"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">Dashboard Overview</h2>
          <p className="text-[#64748B] mt-1">Real-time health and project metrics for your infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[#64748B]">
            <Clock size={16} />
            Last 30 Days
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Servers", value: stats.totalServers, icon: Server, color: "bg-blue-50 text-blue-600", trend: "+12%", trendUp: true },
          { label: "Active Servers", value: stats.activeServers, icon: Server, color: "bg-emerald-50 text-emerald-600", trend: "Online", trendUp: true },
          { label: "Total Projects", value: stats.totalProjects, icon: Briefcase, color: "bg-purple-50 text-purple-600", trend: "+8%", trendUp: true },
          { label: "Running Projects", value: stats.runningProjects, icon: Activity, color: "bg-orange-50 text-orange-600", trend: "Active", trendUp: true },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-semibold text-[#64748B] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#1A1C1E]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Technology Distribution</h3>
            <button className="text-[#94A3B8] hover:text-[#1A1C1E]">
              <Activity size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.projectsByTech || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="technology"
                >
                  {(stats.projectsByTech || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {(stats.projectsByTech || []).map((tech: any, i: number) => (
              <div key={tech.technology} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{tech.technology}</span>
                </div>
                <p className="text-lg font-bold">{stats.totalProjects > 0 ? Math.round((tech.count / stats.totalProjects) * 100) : 0}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Server Project Load</h3>
            <div className="flex gap-4 text-xs font-bold text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#2D31A6]"></div>
                ACTIVE
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#E2E8F0]"></div>
                IDLE
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.projectsByServer || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="serverName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#F8F9FB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#2D31A6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="font-bold text-lg">Recent System Activity</h3>
          <button className="text-[#2D31A6] text-sm font-bold hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">Event</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {(stats.recentLogs || []).map((log: any) => (
                <tr key={log._id} className="hover:bg-[#F8F9FB] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1C1E]">{log.details}</p>
                        <p className="text-xs text-[#64748B]">{log.action}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {log.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-[#64748B]">{log.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#64748B]">
                    {formatDistanceToNow(new Date(log.createdAt || log.timestamp), { addSuffix: true })}
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
