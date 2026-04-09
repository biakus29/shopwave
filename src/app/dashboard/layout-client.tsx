"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  CreditCard,
  Store,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/firebase/auth"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

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
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { label: t('dashboard.overview'), icon: <LayoutDashboard size={20} />, activeIcon: <LayoutDashboard size={24} strokeWidth={2.5}/>, href: "/dashboard" },
    { label: t('dashboard.shop'), icon: <Store size={20} />, activeIcon: <Store size={24} strokeWidth={2.5}/>, href: "/dashboard/shop" },
    { label: t('dashboard.products'), icon: <Package size={20} />, activeIcon: <Package size={24} strokeWidth={2.5}/>, href: "/dashboard/products" },
    { label: t('dashboard.orders'), icon: <CreditCard size={20} />, activeIcon: <CreditCard size={24} strokeWidth={2.5}/>, href: "/dashboard/orders" },
    { label: t('dashboard.analytics'), icon: <BarChart3 size={20} />, activeIcon: <BarChart3 size={24} strokeWidth={2.5}/>, href: "/dashboard/analytics", desktopOnly: true },
    { label: t('dashboard.customers'), icon: <Users size={20} />, activeIcon: <Users size={24} strokeWidth={2.5}/>, href: "/dashboard/customers", desktopOnly: true },
    { label: t('dashboard.settings'), icon: <Settings size={20} />, activeIcon: <Settings size={24} strokeWidth={2.5}/>, href: "/dashboard/settings" },
  ]

  // Filter 5 items max for mobile nav
  const mobileNavItems = navItems.filter(item => !item.desktopOnly).slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-16 lg:pb-0">
      
      {/* ===== DESKTOP SIDEBAR (lg and up) ===== */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r shadow-sm z-50 shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">ShopWave</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground active:bg-slate-200"
                )}
              >
                <span className={cn(
                  "transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                )}>
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info + Logout Desktop */}
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
          <button
            onClick={async () => { await logout(); window.location.href = '/login'; }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
          >
            <LogOut size={20} />
            {t('common.logout')}
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header - Desktop & Mobile */}
        <header className="h-14 sm:h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Logo Mobile */}
            <Link href="/" className="flex items-center gap-2 group lg:hidden">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                <ShoppingBag size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">ShopWave</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="bg-transparent border-none focus:outline-none text-xs w-48 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Mobile Global Search trigger */}
            <button className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Search size={20} className="text-slate-600" />
            </button>
            
            <LanguageSwitcher />

            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
              <Bell size={20} className="text-slate-600 group-hover:text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold leading-none">{user.full_name}</p>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1 capitalize cursor-pointer hover:underline text-rose-500" onClick={async () => { await logout(); window.location.href = '/login'; }}>{t('common.logout')}</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} />
                <AvatarFallback>{user.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 mb-safe h-full">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/60 lg:hidden flex justify-around items-center h-16 sm:h-20 pb-safe z-50 rounded-t-2xl shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)]">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1 pt-1"
            >
              <div className={cn(
                "relative flex items-center justify-center w-10 sm:w-12 h-8 sm:h-10 rounded-full transition-all duration-300",
                isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-600"
              )}>
                {isActive ? item.activeIcon : item.icon}
              </div>
              <span className={cn(
                "text-[10px] sm:text-[11px] font-bold transition-colors",
                isActive ? "text-primary" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
