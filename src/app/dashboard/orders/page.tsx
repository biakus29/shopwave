"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  Download, 
  MessageCircle, 
  Eye, 
  MoreVertical,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"


export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState("all")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground mt-1">Track and fulfill your customer orders.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {["all", "pending", "processing", "shipped", "delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap",
                activeTab === tab ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button variant="outline" className="gap-2 h-11 px-6 font-bold w-full md:w-auto">
          <Download size={18} />
          Export Orders
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardHeader className="p-6 border-b">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input className="pl-10 h-11" placeholder="Search orders by ID, customer name or email..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">#ORD-{2024}-{100 + i}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">Alex Johnson {i}</p>
                          <p className="text-[10px] text-muted-foreground">alex@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">Oct {10 + i}, 2024</p>
                      <p className="text-[10px] text-muted-foreground">0{i}:45 PM</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-bold">{i % 3 + 1} items</Badge>
                    </td>
                    <td className="px-6 py-4 font-bold">${(i * 45).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {i === 1 && <div className="p-1 px-2 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1"><Clock size={12} /> Pending</div>}
                        {i === 2 && <div className="p-1 px-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1"><Truck size={12} /> Shipped</div>}
                        {i >= 3 && <div className="p-1 px-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1"><CheckCircle2 size={12} /> Delivered</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-9 gap-2 text-primary font-bold hover:bg-primary/10">
                          <MessageCircle size={16} />
                          WhatsApp
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
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
  )
}
