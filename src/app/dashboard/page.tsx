"use client"

import * as React from "react"
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Package,
  Clock,
  MessageCircle,
  AlertTriangle,
  MoreVertical,
  Search,
  Filter,
  Download
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, formatCurrency } from "@/lib/utils"

// Mock Data for Charts
const SALES_DATA = [
  { day: "Mon", sales: 2400, profit: 1800 },
  { day: "Tue", sales: 1398, profit: 1200 },
  { day: "Wed", sales: 9800, profit: 6400 },
  { day: "Thu", sales: 3908, profit: 2800 },
  { day: "Fri", sales: 4800, profit: 3300 },
  { day: "Sat", sales: 3800, profit: 2500 },
  { day: "Sun", sales: 4300, profit: 3100 },
]

const CUSTOMER_DATA = [
  { name: "Week 1", total: 400 },
  { name: "Week 2", total: 700 },
  { name: "Week 3", total: 1200 },
  { name: "Week 4", total: 1800 },
  { name: "Week 5", total: 2400 },
  { name: "Week 6", total: 3100 },
]

const TOP_PRODUCTS = [
  { name: "Wireless Headphones", value: 400, color: "#8b5cf6" },
  { name: "Smart Watch", value: 300, color: "#ec4899" },
  { name: "Leather Bag", value: 300, color: "#3b82f6" },
  { name: "Ceramic Vase", value: 200, color: "#f59e0b" },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
             Dashboard <Badge variant="secondary" className="font-bold bg-violet-100 text-violet-700 hover:bg-violet-100">Vendor Pro</Badge>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Monitoring your shop performance for <span className="text-foreground font-black">Today, Oct 12, 2024</span></p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold h-11 px-4 sm:px-6 shadow-sm border-2">
             <Download size={18} className="mr-2" /> Export Reports
          </Button>
          <Button variant="premium" className="rounded-xl font-bold h-11 px-4 sm:px-6 shadow-xl shadow-primary/20">
             <PlusIcon size={18} className="mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <KPICard 
          title="Daily Sales" 
          value="$2,450" 
          change="+14.2%" 
          trend="up" 
          icon={<DollarSign className="text-emerald-500" />} 
          color="bg-emerald-50 border-emerald-100"
        />
        <KPICard 
          title="Daily Profit" 
          value="$1,820" 
          change="+8.4%" 
          trend="up" 
          icon={<TrendingUp className="text-blue-500" />} 
          color="bg-blue-50 border-blue-100"
        />
        <KPICard 
          title="Today Customers" 
          value="48" 
          change="+24%" 
          trend="up" 
          icon={<Users className="text-violet-500" />} 
          color="bg-violet-50 border-violet-100"
        />
        <KPICard 
          title="New Orders" 
          value="12" 
          change="+1" 
          trend="up" 
          icon={<ShoppingBag className="text-orange-500" />} 
          color="bg-orange-50 border-orange-100"
        />
        <KPICard 
          title="Low Stock" 
          value="5" 
          change="critical" 
          trend="down" 
          icon={<AlertTriangle className="text-rose-500" />} 
          color="bg-rose-50 border-rose-100"
          isAlert
        />
        <KPICard 
          title="WhatsApp Pending" 
          value="3" 
          change="active" 
          trend="up" 
          icon={<MessageCircle className="text-green-500" />} 
          color="bg-green-50 border-green-100"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <div>
              <CardTitle className="text-xl font-black">Sales Performance</CardTitle>
              <CardDescription className="font-medium mt-1">Revenue compared to profit over the last 7 days</CardDescription>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <Button size="sm" variant="ghost" className="rounded-lg h-8 text-xs font-bold bg-white shadow-sm">Sales</Button>
               <Button size="sm" variant="ghost" className="rounded-lg h-8 text-xs font-bold text-muted-foreground">Volume</Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Distribution Chart */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Top Categories</CardTitle>
            <CardDescription className="font-medium mt-1">Best selling product groups</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_PRODUCTS}>
                     <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {TOP_PRODUCTS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                     <Tooltip cursor={{ fill: "transparent" }} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-4">
                {TOP_PRODUCTS.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-bold">{item.name}</span>
                     </div>
                     <span className="text-sm font-black text-slate-500">{item.value}+ Sales</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Table & Customers chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Growth Chart */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Customer Count</CardTitle>
            <CardDescription className="font-medium mt-1">Total growth over last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-8">
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={CUSTOMER_DATA}>
                      <Area type="step" dataKey="total" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.05} />
                      <XAxis dataKey="name" hide />
                      <Tooltip />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-6 text-center">
                <div className="text-3xl font-black tracking-tight">3,124</div>
                <p className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-1 mt-1">
                   <ArrowUpRight size={16} /> +18.4% growth
                </p>
             </div>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-slate-50/50 border-b">
            <div>
              <CardTitle className="text-xl font-black">Recent Orders</CardTitle>
              <CardDescription className="font-medium mt-1">Latest marketplace transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-2">View Full History</Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b transition-colors bg-slate-50/50">
                      <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Order ID</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Customer</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Amount</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="group hover:bg-slate-50/80 transition-all cursor-pointer border-b last:border-0">
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                          <span className="font-bold text-xs sm:text-sm text-slate-400 group-hover:text-primary transition-colors">#SW-29{i}48</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                           <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm shrink-0">
                                 <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} />
                                 <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                 <p className="text-xs sm:text-sm font-bold truncate">Customer {i}</p>
                                 <p className="hidden xs:block text-[10px] text-muted-foreground font-semibold truncate">user{i}@example.com</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                           <Badge 
                             variant={i % 3 === 0 ? "warning" : i % 3 === 1 ? "success" : "default"}
                             className="rounded-lg px-2 sm:px-2.5 py-0.5 sm:py-1 font-bold text-[9px] sm:text-[11px] whitespace-nowrap"
                           >
                             {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Shipped" : "Delivered"}
                           </Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 font-black text-xs sm:text-base text-slate-700 whitespace-nowrap">${(i * 120.50).toFixed(2)}</td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                           <div className="flex items-center justify-end gap-1 sm:gap-2">
                             <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 sm:h-9 sm:w-9 group-hover:text-primary hover:bg-primary/5 transition-all">
                               <MessageCircle size={16} />
                             </Button>
                             <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 sm:h-9 sm:w-9 group-hover:text-primary hover:bg-primary/5 transition-all">
                               <MoreVertical size={16} />
                             </Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            {trend === 'up' && !isAlert ? <ArrowUpRight size={14} /> : trend === 'down' || isAlert ? <ArrowDownRight size={14} /> : null}
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

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
