import { motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  UserCheck,
  Target,
  FileText,
  BarChart3,
  BookOpen,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Cpu,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: UserCheck, label: "Profiling" },
  { icon: Brain, label: "Assessment" },
  { icon: Target, label: "Jobs" },
  { icon: FileText, label: "Resume AI" },
  { icon: BarChart3, label: "Skill Gap" },
  { icon: BookOpen, label: "Courses" },
  { icon: TrendingUp, label: "Predictions" },
  { icon: Activity, label: "Behavioral" },
  { icon: Shield, label: "Security" },
];

const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 rounded-lg gradient-border bg-secondary">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">NeuralCareer</h2>
          <p className="text-[10px] font-mono text-muted-foreground">AI Platform v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              item.active
                ? "bg-secondary text-foreground glow-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
            {item.active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-3 px-3">
          <div className="glass-card rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground">ALL SYSTEMS ONLINE</span>
            </div>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-glow-success/60" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
