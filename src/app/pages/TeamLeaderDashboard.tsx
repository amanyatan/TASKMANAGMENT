import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Layout, List, Users, MessageSquare, 
  PlusCircle, ArrowRight, Loader2, ChevronRight,
  GanttChart, Layers, Box, Activity
} from "lucide-react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export function TeamLeaderDashboard() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from("projects").select("*, owner:owner_id(full_name)");
      const { data: tData } = await supabase.from("tasks").select("*, list:list_id(name)");
      setProjects(pData || []);
      setTasks(tData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Workspace Control</h1>
          <p className="text-sm text-neutral-500">Manage your team's projects and daily tasks.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
             <Plus className="w-4 h-4" /> New Project
           </button>
        </div>
      </div>

      {/* OPERATIONAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
           <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Active Sprints</p>
           <p className="text-2xl font-bold">4</p>
        </div>
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
           <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Team Velocity</p>
           <p className="text-2xl font-bold">2.4/hr</p>
        </div>
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
           <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Open Issues</p>
           <p className="text-2xl font-bold text-red-500">12</p>
        </div>
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
           <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Health Score</p>
           <p className="text-2xl font-bold text-green-500">92%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* ACTIVE PROJECTS */}
         <div className="bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" /> My Projects
              </h3>
              <button className="text-xs text-blue-500 font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {projects.slice(0, 5).map(p => (
                <div key={p.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500"><Box className="w-5 h-5" /></div>
                     <div>
                       <p className="text-sm font-bold text-neutral-900 dark:text-white">{p.name}</p>
                       <p className="text-xs text-neutral-500">{p.owner?.full_name}</p>
                     </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
         </div>

         {/* RECENT ACTIVITY */}
         <div className="bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" /> Operational Feed
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    {i !== 4 && <div className="absolute top-4 left-[3px] w-0.5 h-12 bg-neutral-100 dark:bg-neutral-800" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">Task Completed: Update Landing Page</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">@member_user • 2m ago</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
