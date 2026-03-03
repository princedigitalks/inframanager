import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { FileText, Search, Filter, Clock, User, Activity } from "lucide-react";
import { format } from "date-fns";

export function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.logs.list()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#1A1C1E]">Activity Logs</h2>
        <p className="text-[#64748B] mt-1">Audit trail of all administrative actions performed in the console.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by action or user..." 
            className="w-full bg-[#F8F9FB] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2D31A6]/20 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F8F9FB] text-[#64748B] rounded-xl text-sm font-bold hover:bg-[#F1F5F9] transition-all">
          <Filter size={18} />
          Date Range
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FB] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4">Details</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2D31A6]"></div>
                      <span className="text-sm font-bold text-[#1A1C1E]">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#64748B]">
                    {log.details}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {log.user_name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#64748B]">{log.user_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#64748B] flex items-center gap-2">
                    <Clock size={14} className="text-[#94A3B8]" />
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
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
