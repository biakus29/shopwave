"use client"

export const dynamic = "force-dynamic"

import * as React from "react"
import { 
  Search, 
  Download, 
  MessageCircle, 
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  ShoppingBag,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth"

export default function OrdersPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [orders, setOrders] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchOrders() {
      if (!user) return
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("vendor_id", user.uid)
        .single()
        
      if (shop) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("shop_id", shop.id)
          .order("created_at", { ascending: false })
        if (data) setOrders(data)
      }
      setIsLoading(false)
    }
    fetchOrders()
  }, [user, supabase])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight">Commandes</h1>
          <Button variant="outline" size="sm" className="rounded-xl border-2 font-bold gap-2">
             <Download size={16} /> Rapport
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Rechercher une commande..." 
          className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl font-bold w-full text-base"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-none shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden group active:scale-[0.98] transition-all">
            <div className="p-4 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-slate-50 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customer_name}`} />
                      <AvatarFallback>{order.customer_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                       <p className="font-black text-sm text-slate-800 truncate">{order.customer_name}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">ID: #{order.id.slice(0,8)}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={order.status === 'delivered' ? "success" : "secondary"}
                    className="rounded-lg h-7 px-2.5 text-[10px] font-black uppercase"
                  >
                    {order.status === 'pending' && <Clock size={12} className="mr-1 inline" />}
                    {order.status === 'shipped' && <Truck size={12} className="mr-1 inline" />}
                    {order.status === 'delivered' && <CheckCircle2 size={12} className="mr-1 inline" />}
                    {order.status}
                  </Badge>
               </div>
               
               <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total</span>
                     <span className="text-base font-black text-slate-900 mt-1">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600"
                      onClick={() => window.open(`https://wa.me/${order.customer_phone?.replace(/\D/g,'')}`, '_blank')}
                    >
                      <MessageCircle size={18} />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600"
                    >
                      <ChevronRight size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400">
                       <MoreVertical size={18} />
                    </Button>
                  </div>
               </div>
            </div>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <ShoppingBag size={40} />
            </div>
            <div>
              <p className="font-black text-lg">Aucune commande</p>
              <p className="text-sm text-muted-foreground font-medium">Les nouvelles commandes apparaîtront ici.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
