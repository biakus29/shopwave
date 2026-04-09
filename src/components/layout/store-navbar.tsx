"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingBag, Search, ShoppingCart, Menu, X, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export function StoreNavbar() {
  const { t, language } = useTranslation()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const cartCount = useCartStore((state) => state.getItemCount())
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when search overlay opens
  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-white/80 backdrop-blur-md py-2 sm:py-3 shadow-sm" : "bg-white py-3 sm:py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:block">ShopWave</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder={language === 'fr' ? "Rechercher des produits, marques..." : "Search for products, brands..."}
              className="w-full bg-slate-100 border-none rounded-2xl h-11 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2.5 text-muted-foreground hover:text-primary transition-colors active:scale-95"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <Link href="/login" className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
              <User size={22} />
            </Link>

            <Link href="/cart" className="relative p-2.5 text-muted-foreground hover:text-primary transition-colors group">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2.5 text-muted-foreground hover:text-primary transition-colors active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Mobile Search Overlay ===== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Search size={18} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
                className="w-full bg-slate-100 border-none rounded-xl h-11 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
          <div className="p-6 text-center text-muted-foreground text-sm">
            <p className="font-medium">Start typing to search products...</p>
          </div>
        </div>
      )}

      {/* ===== Mobile Menu Drawer ===== */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[56] w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={16} />
            </div>
            <span className="text-lg font-black tracking-tight">ShopWave</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {[
              { label: language === 'fr' ? "Accueil" : "Home", href: "/" },
              { label: language === 'fr' ? "Toutes les Boutiques" : "All Shops", href: "/store" },
              { label: "Categories", href: "/store?categories" },
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

          <div className="space-y-1 px-3">
            <Link
              href="/login"
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {language === 'fr' ? "Mon Compte" : "My Account"}
              <User size={18} className="text-muted-foreground" />
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-slate-50 active:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                {language === 'fr' ? "Panier" : "Shopping Bag"}
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </span>
              <ShoppingCart size={18} className="text-muted-foreground" />
            </Link>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t bg-slate-50/80">
          <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="premium" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20">
              {language === 'fr' ? "Démarrer" : "Get Started"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
