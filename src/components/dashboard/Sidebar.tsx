"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  BarChart3, 
  Settings, 
  Workflow,
  List,
  Moon,
  Sun,
  LogOut,
  User
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Mail },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/lists", label: "Email Lists", icon: List },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/workflows", label: "N8N Workflows", icon: Workflow },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, refetch } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (error?.code) {
      toast.error("Failed to sign out");
      setIsLoggingOut(false);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/login");
    }
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-border/50 p-6 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
          >
            <Mail className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EmailFlow
            </h1>
            <p className="text-xs text-muted-foreground">Cold Email Automation</p>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      {session?.user && (
        <div className="mb-6 p-4 rounded-lg bg-accent/50 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary-foreground" : ""}`} />
                <span className={`font-medium relative z-10 ${isActive ? "text-primary-foreground" : ""}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="pt-4 border-t border-border/50 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start gap-3"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>

        {session?.user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </Button>
        )}
      </div>
    </motion.aside>
  );
}