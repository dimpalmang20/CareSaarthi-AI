import { Link, useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  ShoppingCart, 
  LogOut, 
  Settings, 
  ShieldCheck,
  Activity,
  Menu,
  User as UserIcon,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, cart } = useApp();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Pharmacy Shop", icon: ShoppingBag, href: "/shop" },
    { label: "AI Pharmacist", icon: MessageSquare, href: "/chat" },
    { label: "My Cart", icon: ShoppingCart, href: "/cart", badge: cartCount > 0 ? cartCount : undefined },
  ];

  const ADMIN_ITEMS: NavItem[] = [
    { label: "Admin Panel", icon: ShieldCheck, href: "/admin" },
  ];

  const items = user?.role === 'admin' ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-xl tracking-tight">MedAgent AI</h1>
          <p className="text-xs text-muted-foreground font-mono">v1.0.0-beta</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden",
                location === item.href 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className={cn("h-5 w-5", location === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary/10 flex items-center justify-center text-primary border border-sidebar-primary/20">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur border shadow-sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
