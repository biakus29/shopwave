"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, User, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/auth/actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<SupabaseUser | null>(null)
  const [role, setRole] = React.useState<string | null>(null)
  const pathname = usePathname()
  const getItemCount = useCartStore((state) => state.getItemCount)
  const cartCount = getItemCount()
  const supabase = createClient()

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from("profiles").select("role").eq("id", user.id).single()
          .then(({ data }) => setRole(data?.role ?? null))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setRole(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">ShopWave</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/cart" className="relative p-2.5 hover:bg-slate-100/50 rounded-full transition-colors active:scale-95">
              <ShoppingBag size={22} className={cn(isScrolled ? "text-foreground" : "text-foreground sm:text-foreground")} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href={role === "vendor" ? "/dashboard" : "/store"}>
                  <Button variant="premium" size="sm" className="gap-2 rounded-xl">
                    <User size={16} />
                    {role === "vendor" ? "Dashboard" : "My Account"}
                  </Button>
                </Link>
                <form action={signOut}>
                  <button type="submit" className="p-2 text-muted-foreground hover:text-rose-500 transition-colors" title="Sign out">
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                <Link href="/signup">
                  <Button variant="premium" size="sm" className="rounded-xl px-6">Get Started</Button>
                </Link>
              </div>
            )}

            <button 
              className="md:hidden p-2.5 hover:bg-slate-100/50 rounded-xl transition-all active:scale-95" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Mobile Drawer Menu ===== */}
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[56] w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={16} />
            </div>
            <span className="text-lg font-black tracking-tight">ShopWave</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
              { label: "FAQ", href: "/#faq" },
              { label: "Browse Store", href: "/store" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-slate-50 active:bg-slate-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
            ))}
          </div>

          <hr className="my-4 mx-6 border-slate-100" />

          <div className="px-3 space-y-2">
            {user ? (
              <>
                <Link
                  href={role === "vendor" ? "/dashboard" : "/store"}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {role === "vendor" ? "Vendor Dashboard" : "My Account"}
                  <User size={18} />
                </Link>
                <form action={signOut}>
                  <button 
                    type="submit" 
                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-semibold text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                  >
                    Sign Out
                    <LogOut size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-3 px-3 pt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="premium" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t bg-slate-50/50 text-center">
          <p className="text-xs text-muted-foreground font-medium">© 2024 ShopWave Multi-Vendor</p>
        </div>
      </div>
    </>
  )
}
