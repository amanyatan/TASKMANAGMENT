import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  Users, UserCheck, MessageSquare, Search, 
  Mail, Phone, ShieldCheck, MoreVertical
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export function HRDashboard() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const { data } = await supabase.from('profiles').select('*');
      setEmployees(data || []);
      setLoading(false);
    }
    fetchEmployees();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">People Directory</h1>
          <p className="text-sm text-neutral-500">Manage employee profiles and engagement.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20">Add Member</button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-500"><Users className="w-6 h-6" /></div>
           <div>
             <p className="text-xs font-medium text-neutral-500 uppercase">Total Employees</p>
             <p className="text-2xl font-bold">{employees.length}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500"><UserCheck className="w-6 h-6" /></div>
           <div>
             <p className="text-xs font-medium text-neutral-500 uppercase">Active Now</p>
             <p className="text-2xl font-bold">{Math.floor(employees.length * 0.7)}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500"><MessageSquare className="w-6 h-6" /></div>
           <div>
             <p className="text-xs font-medium text-neutral-500 uppercase">New Messages</p>
             <p className="text-2xl font-bold">12</p>
           </div>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
            <input type="text" placeholder="Search people..." className="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-pink-500 transition-all" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar_url || `https://ui-avatars.com/api/?name=${emp.full_name}&background=random`} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-pink-500 transition-colors">{emp.full_name}</p>
                      <p className="text-xs text-neutral-500">Engineering</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Active</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="w-4 h-4 hover:text-pink-500 cursor-pointer" />
                    <Phone className="w-4 h-4 hover:text-pink-500 cursor-pointer" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
