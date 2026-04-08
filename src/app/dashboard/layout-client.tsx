"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  CreditCard,
  Store,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/auth/actions"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: {
    id: string
    email: string
    full_name: string
    role: string
  }
}

export default function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
  // ✅ Mobile-first: sidebar fermée par défaut
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const pathname = usePathname()
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  const navItems = [
    { label: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "My Shop", icon: <Store size={20} />, href: "/dashboard/shop" },
    { label: "Products", icon: <Package size={20} />, href: "/dashboard/products" },
    { label: "Orders", icon: <CreditCard size={20} />, href: "/dashboard/orders" },
    { label: "Analytics", icon: <BarChart3 size={20} />, href: "/dashboard/analytics" },
    { label: "Customers", icon: <Users size={20} />, href: "/dashboard/customers" },
    { label: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
  ]

  // Fermer la sidebar au changement de route (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Lock body scroll quand la sidebar est ouverte sur mobile
  React.useEffect(() => {
    const handleResize = () => {
      // Sur desktop (lg+), le body scroll ne doit pas être bloqué
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = ""
        return
      }
      if (isSidebarOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("resize", handleResize)
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ===== Mobile Overlay/Backdrop ===== */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Close sidebar"
      />

      {/* ===== Sidebar ===== */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r transition-transform duration-300 ease-out lg:static lg:translate-x-0 shadow-2xl lg:shadow-sm flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 sm:p-6 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">ShopWave</span>
          </Link>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-sm font-semibold transition-all group",
                pathname === item.href
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground active:bg-slate-200"
              )}
            >
              <span className={cn(
                "transition-transform group-hover:scale-110",
                pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary"
              )}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9 border-2 border-slate-100">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} />
              <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user.full_name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user.role} Plan</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-3 sm:py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            {/* Search — visible on md+ */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-xs w-48 font-medium"
              />
            </div>
            {/* Mobile search icon */}
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Search size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
              <Bell size={20} className="text-muted-foreground group-hover:text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold leading-none">{user.full_name}</p>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1 capitalize">{user.role}</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} />
                <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
