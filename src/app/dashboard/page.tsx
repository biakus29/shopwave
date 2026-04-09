"use client"

export const dynamic = "force-dynamic"

import * as React from "react"
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
  Plus,
  Loader2,
  ShoppingBag,
  Users
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn, formatCurrency } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth"

export default function DashboardOverview() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const supabase = createClient()
  
  const [stats, setStats] = React.useState({
    totalSales: 0,
    dailyProfit: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStock: 0,
    whatsappInquiries: 0
  })
  const [recentOrders, setRecentOrders] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return
      
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("vendor_id", user.uid)
        .single()
        
      if (shop) {
        // 1. Fetch Products for Stock alerts
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .eq("shop_id", shop.id)
          
        const lowStockCount = products?.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10)).length || 0

        // 2. Fetch Orders
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .eq("shop_id", shop.id)
          .order("created_at", { ascending: false })
          .limit(5)
        
        const { data: allOrders } = await supabase
           .from("orders")
           .select("total")
           .eq("shop_id", shop.id)

        const totalSales = allOrders?.reduce((acc, o) => acc + (Number(o.total) || 0), 0) || 0
        
        setStats({
          totalSales,
          dailyProfit: totalSales * 0.3, // Mock profit for now
          totalCustomers: Array.from(new Set(orders?.map(o => o.customer_email))).length,
          totalOrders: allOrders?.length || 0,
          lowStock: lowStockCount,
          whatsappInquiries: Math.floor(totalSales / 5000) // Mock logic
        })
        
        if (orders) setRecentOrders(orders)
      }
      setIsLoading(false)
    }
    
    fetchDashboardData()
  }, [user, supabase])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
             Tableau de Bord <Badge variant="secondary" className="font-bold bg-violet-100 text-violet-700">Vendor Pro</Badge>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium italic">Aujourd&apos;hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
          <Button variant="premium" className="rounded-xl font-bold h-12 px-6 shadow-xl shadow-primary/20" onClick={() => window.location.href='/dashboard/products'}>
             <Plus size={18} className="mr-2" /> Produit
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 snap-x">
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Ventes Totales" 
            value={formatCurrency(stats.totalSales)} 
            change={stats.totalSales > 0 ? "+1%" : "0%"} 
            trend="up" 
            icon={<DollarSign className="text-emerald-500" />} 
            color="bg-emerald-50 border-emerald-100"
          />
        </div>
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Estimation Gain" 
            value={formatCurrency(stats.dailyProfit)} 
            change="+5%" 
            trend="up" 
            icon={<TrendingUp className="text-blue-500" />} 
            color="bg-blue-50 border-blue-100"
          />
        </div>
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Clients" 
            value={stats.totalCustomers.toString()} 
            change="nouveaux" 
            trend="up" 
            icon={<Users className="text-violet-500" />} 
            color="bg-violet-50 border-violet-100"
          />
        </div>
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Commandes" 
            value={stats.totalOrders.toString()} 
            change="total" 
            trend="up" 
            icon={<ShoppingBag className="text-orange-500" />} 
            color="bg-orange-50 border-orange-100"
          />
        </div>
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Alertes Stock" 
            value={stats.lowStock.toString()} 
            change={stats.lowStock > 0 ? "urgent" : "ok"} 
            trend={stats.lowStock > 0 ? "down" : "up"} 
            icon={<AlertTriangle className="text-rose-500" />} 
            color="bg-rose-50 border-rose-100"
            isAlert={stats.lowStock > 0}
          />
        </div>
        <div className="snap-center shrink-0 w-72 sm:w-full">
          <KPICard 
            title="Intérêt WhatsApp" 
            value={stats.whatsappInquiries.toString()} 
            change="clics" 
            trend="up" 
            icon={<MessageCircle className="text-green-500" />} 
            color="bg-green-50 border-green-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 bg-slate-50/50 border-b">
            <div>
              <CardTitle className="text-xl font-black">Commandes Récentes</CardTitle>
              <CardDescription className="font-medium mt-1">Les 5 dernières activités de votre boutique.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-slate-100">
               {recentOrders.map((order) => (
                 <div key={order.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-all cursor-pointer">
                   <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                       <AvatarFallback className="font-bold bg-slate-100 text-slate-400">{order.customer_name?.charAt(0) || "C"}</AvatarFallback>
                     </Avatar>
                     <div className="min-w-0">
                       <div className="flex items-center gap-2">
                          <p className="font-black text-sm text-slate-800 truncate">{order.customer_name}</p>
                          <Badge 
                            className="rounded-md px-1.5 py-0 text-[10px] font-black uppercase"
                            variant={order.status === 'delivered' ? "success" : "default"}
                          >
                            {order.status}
                          </Badge>
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 mt-0.5">ID: #{order.id.slice(0,8)} • {new Date(order.created_at).toLocaleDateString()}</p>
                     </div>
                   </div>
                   
                   <div className="text-right flex flex-col items-end gap-1">
                     <p className="font-black text-sm text-slate-900">{formatCurrency(order.total)}</p>
                     <div className="flex gap-1">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-primary transition-all"
                         onClick={() => window.open(`https://wa.me/${order.customer_phone.replace(/\D/g,'')}`, '_blank')}
                        >
                         <MessageCircle size={14} />
                       </Button>
                     </div>
                   </div>
                 </div>
               ))}
               
               {recentOrders.length === 0 && (
                 <div className="py-12 text-center text-slate-400">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Aucune commande pour le moment.</p>
                    <p className="text-xs">Partagez le lien de votre boutique pour commencer à vendre !</p>
                 </div>
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({ title, value, change, trend, icon, color, isAlert }: { 
  title: string, 
  value: string, 
  change: string, 
  trend: 'up' | 'down',
  icon: React.ReactNode,
  color: string,
  isAlert?: boolean
}) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm", color)}>
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full",
            isAlert 
              ? "text-rose-600 bg-rose-50 border border-rose-100" 
              : trend === 'up' 
                ? "text-emerald-600 bg-emerald-50 border border-emerald-100" 
                : "text-amber-600 bg-amber-50 border border-amber-100"
          )}>
            {trend === 'up' && !isAlert ? <ArrowUpRight size={14} /> : (trend === 'down' || isAlert) ? <ArrowDownRight size={14} /> : null}
            {change}
          </div>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 sm:mt-2 tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}
