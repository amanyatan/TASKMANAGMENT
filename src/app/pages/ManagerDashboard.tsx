import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Users, Target, Activity, 
  Briefcase, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    activeProjects: 0,
    totalUsers: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const chartData = [
    { name: "Mon", tasks: 12 }, { name: "Tue", tasks: 19 }, { name: "Wed", tasks: 15 },
    { name: "Thu", tasks: 22 }, { name: "Fri", tasks: 30 }, { name: "Sat", tasks: 10 },
    { name: "Sun", tasks: 8 },
  ];

  useEffect(() => {
    async function fetchStats() {
      const { count: pCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: tCountDone } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'done');
      const { count: tCountPending } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'done');
      
      setStats({
        activeProjects: pCount || 0,
        totalUsers: uCount || 0,
        completedTasks: tCountDone || 0,
        pendingTasks: tCountPending || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900 dark:text-white">Executive Overview</h1>
        <p className="text-sm text-neutral-500">Global performance metrics and project status.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={stats.activeProjects} icon={Briefcase} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard title="Total Workforce" value={stats.totalUsers} icon={Users} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-500/10" />
        <StatCard title="Completed Work" value={stats.completedTasks} icon={CheckCircle2} color="text-green-500" bg="bg-green-50 dark:bg-green-500/10" />
        <StatCard title="Pending Velocity" value={stats.pendingTasks} icon={Clock} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VELOCITY CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Weekly Throughput</h3>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-6 text-neutral-900 dark:text-white">Resource Health</h3>
          <div className="space-y-6">
            <HealthItem label="Server Uptime" value="99.9%" status="Optimal" />
            <HealthItem label="Database Latency" value="24ms" status="Optimal" />
            <HealthItem label="API Response" value="120ms" status="Optimal" />
            <HealthItem label="Project Risk" value="Low" status="Warning" color="text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bg)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, value, status, color = "text-green-500" }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-900 dark:text-white">{label}</p>
        <p className="text-xs text-neutral-500">{status}</p>
      </div>
      <span className={cn("text-sm font-bold", color)}>{value}</span>
    </div>
  );
}
