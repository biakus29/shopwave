"use client"

import * as React from "react"
import { useParams } from "next/navigation"

export const dynamic = 'force-dynamic'

import { createClient } from "@/lib/supabase/client"
import { StoreNavbar } from "@/components/layout/store-navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Phone, 
  MessageCircle, 
  Info, 
  MapPin, 
  Package,
  Loader2,
  ChevronRight
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

export default function ShopCatalogPage() {
  const params = useParams()
  const slug = params.slug as string
  const supabase = createClient()
  const { t, language } = useTranslation()
  
  const [shop, setShop] = React.useState<any>(null)
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedCategory, setSelectedCategory] = React.useState("Tous")

  React.useEffect(() => {
    async function fetchShopData() {
      if (!slug) return
      
      console.log("Recherche du slug:", slug);

      // Fetch shop
      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("*")
        .eq("slug", slug)
        .maybeSingle()

      if (shopError) {
        console.error("Erreur Supabase Shop:", shopError)
      }

      if (shopData) {
        console.log("Boutique trouvée avec succès:", shopData)
        setShop(shopData)
        
        // Fetch products for this shop
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("shop_id", shopData.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (productsData) {
          setProducts(productsData)
        }
      } else {
        console.warn("Boutique null pour le slug:", slug)
      }
      setLoading(false)
    }

    fetchShopData()
  }, [slug, supabase])

  const openWhatsApp = (product: any) => {
    if (!shop) return
    const phone = shop.whatsapp_number.replace(/\s+/g, '')
    const message = encodeURIComponent(
      `Bonjour ${shop.name}, je suis intéressé par votre produit : *${product.name}* (${formatCurrency(product.price)}).\n\nLien : ${window.location.origin}/s/${slug}`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50/50">
        <StoreNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary w-12 h-12" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50/50">
        <StoreNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Info size={40} />
          </div>
          <h1 className="text-2xl font-black mb-2">Boutique introuvable</h1>
          <p className="text-muted-foreground font-medium mb-8">Le lien que vous avez suivi est peut-être incorrect ou la boutique n'a pas encore été enregistrée.</p>
          <div className="flex gap-4">
            <Button variant="premium" className="rounded-xl px-8 h-12 font-bold" onClick={() => window.location.href = '/'}>
                Retour à l'accueil
            </Button>
            <Button variant="outline" className="rounded-xl px-8 h-12 font-bold" onClick={() => window.location.reload()}>
                Réessayer
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <StoreNavbar />
      
      <main className="flex-1 animate-fade-in">
        {/* Banner with Profile Overlay */}
        <section className="relative h-64 sm:h-80 md:h-[400px] bg-slate-200">
           {shop.banner_url ? (
             <img src={shop.banner_url} className="w-full h-full object-cover" alt={shop.name} />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20" />
           )}
           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
           
           <div className="absolute inset-x-0 -bottom-16 sm:-bottom-20 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8">
                 <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] bg-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative z-10 translate-y-4">
                    {shop.logo_url ? (
                      <img src={shop.logo_url} className="w-full h-full object-cover" alt={shop.name} />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <Package size={48} />
                      </div>
                    )}
                 </div>
                 <div className="text-center sm:text-left pb-4 sm:pb-6 z-10 flex-1">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">{shop.name}</h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/80 text-xs sm:text-sm font-bold">
                       <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest leading-none">
                          <MapPin size={12} className="text-primary" /> {shop.address || "En Ligne"}
                       </span>
                       <span className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 text-emerald-300">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Ouvert
                       </span>
                    </div>
                 </div>
                 <div className="hidden md:flex gap-3 pb-8">
                    <Button 
                      className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/20 gap-2"
                      onClick={() => window.open(`https://wa.me/${shop.whatsapp_number.replace(/\s+/g,'')}`, '_blank')}
                    >
                      <Phone size={18} /> Contacter
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12">
           <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                 <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wide">À Propos</h2>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">{shop.description || "Bienvenue dans notre boutique ! Découvrez nos produits soigneusement sélectionnés."}</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <div className="flex-1 md:w-32 bg-slate-50 rounded-2xl p-4 text-center border">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Produits</p>
                    <p className="text-2xl font-black text-slate-900">{products.length}</p>
                 </div>
                 <div className="flex-1 md:w-32 bg-slate-50 rounded-2xl p-4 text-center border">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avis</p>
                    <p className="text-2xl font-black text-slate-900">4.9</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Categories Bar */}
        <section className="px-4 sm:px-6 mb-8 sticky top-[72px] z-30 pointer-events-none">
           <div className="max-w-7xl mx-auto pointer-events-auto">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100 p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={cn(
                       "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap uppercase tracking-widest active:scale-95",
                       selectedCategory === cat 
                         ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                         : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </section>

        {/* Catalog Grid */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {products
                .filter(p => selectedCategory === "Tous" || p.category === selectedCategory)
                .map((product) => (
                <Card key={product.id} className="border-none bg-transparent shadow-none group animate-fade-in">
                  <CardContent className="p-0">
                    <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white shadow-xl shadow-slate-200/50 mb-4 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-primary/10">
                      <img 
                        src={product.images[0] || "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=400"} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-rose-500 active:scale-90 transition-all shadow-lg border border-white/50">
                        <Heart size={18} fill="currentColor" className="text-transparent hover:text-rose-500" />
                      </button>
                      
                      {/* Buy on WhatsApp Overlay - Visible on Hover (Desktop) / Always (Mobile) */}
                      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 translate-y-2 sm:translate-y-12 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300">
                        <Button 
                          variant="premium" 
                          className="w-full h-11 sm:h-14 rounded-2xl shadow-xl shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider group/btn gap-2"
                          onClick={() => openWhatsApp(product)}
                        >
                          <MessageCircle size={18} /> Acheter sur WhatsApp
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1 px-1">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.category}</span>
                         <div className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
                           <Star size={10} className="fill-amber-500 text-amber-500" /> 4.9
                         </div>
                      </div>
                      <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                      <div className="flex items-center justify-between">
                         <p className="text-lg sm:text-2xl font-black text-slate-900">{formatCurrency(product.price)}</p>
                         <button 
                            onClick={() => openWhatsApp(product)}
                            className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg sm:hidden"
                          >
                            <Phone size={18} />
                          </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-24 text-center">
                 <Package size={48} className="mx-auto mb-4 text-slate-300" />
                 <h3 className="text-lg font-black text-slate-900">Aucun produit publié</h3>
                 <p className="text-muted-foreground font-medium">Revenez bientôt pour découvrir de nouveaux articles !</p>
              </div>
            )}
          </div>
        </section>

        {/* Floating Mobile WhatsApp Button */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
           <Button 
             className="w-16 h-16 rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/30 text-white p-0 flex items-center justify-center animate-bounce hover:animate-none"
             onClick={() => window.open(`https://wa.me/${shop.whatsapp_number.replace(/\s+/g,'')}`, '_blank')}
           >
              <MessageCircle size={32} />
           </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
