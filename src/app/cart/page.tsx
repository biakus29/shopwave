"use client"

import * as React from "react"
import Link from "next/link"
import { StoreNavbar } from "@/components/layout/store-navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react"
import { useCartStore } from "@/store/cart"
import Image from "next/image"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <StoreNavbar />
      
      <main className="flex-1 pt-24 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Shopping Bag</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Review your items before proceeding to checkout</p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-6 sm:mb-8 border border-slate-200">
                <ShoppingBag size={40} className="sm:w-12 sm:h-12" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your bag is empty</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-sm px-4">Looks like you haven&apos;t added any items to your bag yet. Start browsing our collection!</p>
              <Link href="/store">
                <Button variant="premium" size="lg" className="rounded-xl sm:rounded-2xl h-12 sm:h-14 px-8 sm:px-10">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                {items.map((item) => (
                  <Card key={item.product.id} className="border-none shadow-lg sm:shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardContent className="p-0 flex flex-row">
                      <div className="w-24 sm:w-48 aspect-square bg-slate-100 relative overflow-hidden shrink-0">
                        <Image 
                          src={item.product.images?.[0] || 'https://picsum.photos/seed/p1/200'} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between gap-3 sm:gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest mb-0.5 sm:mb-1 truncate">{item.product.category}</p>
                            <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2 truncate">{item.product.name}</h3>
                            <p className="text-[10px] sm:text-sm text-muted-foreground font-medium truncate">Vendor: Organic Shop</p>
                          </div>
                          <p className="text-sm sm:text-xl font-black shrink-0">${item.product.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 sm:mt-6">
                          <div className="flex items-center gap-2 sm:gap-3 bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 sm:p-1.5 hover:bg-white hover:shadow-sm rounded-md sm:rounded-lg transition-all active:scale-95"
                            >
                              <Minus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <span className="w-6 sm:w-8 text-center font-bold text-xs sm:text-base">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 sm:p-1.5 hover:bg-white hover:shadow-sm rounded-md sm:rounded-lg transition-all active:scale-95"
                            >
                              <Plus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="flex items-center gap-1.5 sm:gap-2 text-rose-500 font-bold text-[10px] sm:text-sm hover:underline active:scale-95 transition-all"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary — Sticky on desktop */}
              <div className="lg:col-span-4 pb-20 lg:pb-0">
                <Card className="border-none shadow-2xl shadow-slate-200/60 sticky top-32 overflow-hidden">
                  <div className="p-6 sm:p-8 border-b bg-slate-50/50">
                    <h2 className="text-xl sm:text-2xl font-bold">Order Summary</h2>
                  </div>
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between font-semibold text-muted-foreground text-sm sm:text-base">
                        <span>Subtotal</span>
                        <span className="text-foreground">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-muted-foreground text-sm sm:text-base">
                        <span>Shipping</span>
                        <span className="text-emerald-500">FREE</span>
                      </div>
                      <div className="flex justify-between font-semibold text-muted-foreground text-sm sm:text-base">
                        <span>Tax estimate</span>
                        <span className="text-foreground">$0.00</span>
                      </div>
                      <hr className="border-slate-100" />
                      <div className="flex justify-between text-xl sm:text-2xl font-black pt-2">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="hidden lg:block">
                      <Button variant="premium" size="lg" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/30 mt-4 gap-2 text-lg">
                        Proceed to Checkout
                        <ArrowRight size={20} />
                      </Button>
                    </Link>

                    <div className="space-y-4 pt-4 sm:pt-6 border-t lg:border-t-0 border-slate-100">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          <ShieldCheck size={18} className="sm:w-5 sm:h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold">Secure Checkout</p>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground">Your data is always encrypted and safe.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          <Truck size={18} className="sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold">Fast Delivery</p>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground">Free shipping on all orders over $100.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ✅ Sticky Bottom Bar for Mobile Checkout */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t p-4 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.08)] animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Grand Total</span>
              <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="flex-1 max-w-[200px]">
              <Button variant="premium" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
                Checkout
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

