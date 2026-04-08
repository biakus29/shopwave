"use client"

import * as React from "react"
import Link from "next/link"
import { StoreNavbar } from "@/components/layout/store-navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star, ArrowRight, Filter, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { cn } from "@/lib/utils"


const CATEGORIES = ["All Products", "Technology", "Fashion", "Home & Decor", "Beauty", "Sports"]

const MOCK_PRODUCTS = [
  { id: "1", name: "Premium Wireless Headphones", price: 299.99, category: "Technology", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000", rating: 4.8, reviews: 124 },
  { id: "2", name: "Minimalist Leather Watch", price: 189.99, category: "Fashion", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000", rating: 4.9, reviews: 89 },
  { id: "3", name: "Smart Home Speaker", price: 129.50, category: "Technology", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=1000", rating: 4.7, reviews: 56 },
  { id: "4", name: "Eco-Friendly Yoga Mat", price: 45.00, category: "Sports", image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=1000", rating: 4.6, reviews: 210 },
  { id: "5", name: "Designer Ceramic Vase", price: 75.00, category: "Home & Decor", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=1000", rating: 5.0, reviews: 34 },
  { id: "6", name: "Professional Grooming Kit", price: 59.99, category: "Beauty", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=1000", rating: 4.5, reviews: 156 },
  { id: "7", name: "Ultra-Light Running Shoes", price: 120.00, category: "Sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000", rating: 4.8, reviews: 432 },
  { id: "8", name: "Modern Coffee Table", price: 450.00, category: "Home & Decor", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1000", rating: 4.9, reviews: 18 },
]

export default function StorefrontPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All Products")
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <StoreNavbar />
      
      <main className="flex-1 pt-20 sm:pt-24">
        {/* Banner Section */}
        <section className="px-4 sm:px-6 mb-8 sm:mb-12">
          <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-[32px] overflow-hidden relative min-h-[260px] sm:min-h-[340px] md:min-h-[400px] flex items-center p-6 sm:p-8 md:p-16">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2400" 
                 alt="Autumn Collection" 
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-xl text-white">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md mb-4 sm:mb-6 py-1 px-3 sm:px-4 text-xs sm:text-sm">New Season Arrival</Badge>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-6 leading-tight">Elevate Your Lifestyle <br className="hidden sm:block" />with Premium Picks.</h1>
              <p className="text-sm sm:text-lg text-white/80 mb-5 sm:mb-8 max-w-md">Discover a curated collection of high-quality products from top independent vendors.</p>
              <div className="flex gap-3 sm:gap-4">
                <Button variant="premium" size="lg" className="rounded-xl sm:rounded-2xl h-11 sm:h-14 px-5 sm:px-8 text-sm sm:text-base">Shop Now</Button>
                <Button variant="outline" size="lg" className="rounded-xl sm:rounded-2xl h-11 sm:h-14 border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-sm sm:text-base hidden sm:flex">Explore Brands</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between border-b pb-4">
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
               {CATEGORIES.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={cn(
                     "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap border active:scale-95",
                     selectedCategory === cat 
                       ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                       : "bg-white text-muted-foreground border-slate-200 hover:border-primary hover:text-primary shadow-sm"
                   )}
                 >
                   {cat}
                 </button>
               ))}
             </div>
             <div className="hidden lg:flex items-center gap-4">
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sort by:</span>
               <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:ring-2 hover:ring-primary/10 transition-all">
                 Relevance <ChevronDown size={14} />
               </button>
               <button className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:text-primary transition-all">
                 <Filter size={18} />
               </button>
             </div>
          </div>
        </section>

        {/* Product Grid — ✅ 2 colonnes sur mobile pour meilleure densité */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {MOCK_PRODUCTS.filter(p => selectedCategory === "All Products" || p.category === selectedCategory).map((product) => (
                <Card key={product.id} className="border-none bg-transparent shadow-none group">
                  <CardContent className="p-0">
                    <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg sm:shadow-xl shadow-slate-200/50 mb-2 sm:mb-4 transition-all duration-300 group-hover:-translate-y-2">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        loading="lazy"
                      />
                      <button className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-2.5 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 active:text-rose-500 transition-colors shadow-lg">
                        <Heart size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      {/* ✅ Desktop: hover reveal | Mobile: always visible */}
                      <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 
                        sm:translate-y-12 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 
                        transition-all duration-300">
                        <Button 
                          variant="premium" 
                          className="w-full h-9 sm:h-12 rounded-xl sm:rounded-2xl shadow-xl shadow-primary/30 gap-1 sm:gap-2 text-xs sm:text-sm"
                          onClick={() => addItem(product as any)}
                        >
                          <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 px-0.5 sm:px-1">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] sm:text-xs font-black text-primary/70 uppercase tracking-widest truncate">{product.category}</p>
                         <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold shrink-0">
                           <Star size={10} className="sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                           {product.rating}
                         </div>
                      </div>
                      <Link href={`/store/product/${product.id}`} className="block">
                        <h3 className="text-sm sm:text-lg font-bold truncate group-hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-base sm:text-xl font-black">${product.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination/Load More */}
            <div className="mt-12 sm:mt-20 flex justify-center">
              <Button variant="outline" size="lg" className="rounded-2xl h-12 sm:h-14 px-8 sm:px-12 border-2 hover:bg-slate-900 hover:text-white active:bg-slate-900 active:text-white transition-all group text-sm sm:text-base">
                LOAD MORE <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
