"use client"

import * as React from "react"
import { useAuthStore } from "@/store/auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, Search, Mail, Phone, ShoppingBag } from "lucide-react"

interface CustomerData {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  total_orders: number;
  total_spent: number;
  last_order: string;
}

export default function CustomersPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [customers, setCustomers] = React.useState<CustomerData[]>([])

  React.useEffect(() => {
    async function fetchCustomers() {
      if (!user) return;
      
      // 1. Find shop ID
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("vendor_id", user.uid)
        .single()
        
      if (!shop) {
        setIsLoading(false)
        return
      }

      // 2. Fetch orders to derive customer data
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false })
        
      if (orders) {
        const customerMap = new Map<string, CustomerData>()
        
        orders.forEach(order => {
          const email = order.customer_email || 'unknown@example.com'
          if (!customerMap.has(email)) {
             customerMap.set(email, {
               customer_email: email,
               customer_name: order.customer_name,
               customer_phone: order.customer_phone,
               total_orders: 0,
               total_spent: 0,
               last_order: order.created_at
             })
          }
          const c = customerMap.get(email)!
          c.total_orders += 1
          c.total_spent += Number(order.total)
        })
        
        setCustomers(Array.from(customerMap.values()))
      }
      setIsLoading(false)
    }
    
    fetchCustomers()
  }, [user, supabase])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">Customers</h1>
        <p className="text-muted-foreground font-medium">View the list of customers who have purchased from your shop.</p>
      </div>

      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-xl">
        <CardHeader className="border-b bg-slate-50/50 rounded-t-xl pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
              <Users size={20} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Customer Directory</CardTitle>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search customers..." 
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
             />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {customers.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground">
                 <Users size={40} className="mx-auto mb-4 opacity-20" />
                 <p className="font-semibold">No customers found.</p>
                 <p className="text-sm">When someone places an order, their details will appear here.</p>
               </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-muted-foreground font-bold border-b">
                  <tr>
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4 text-center">Orders</th>
                    <th className="px-6 py-4 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {c.customer_name}
                        <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                          Last seen: {new Date(c.last_order).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} /> {c.customer_email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={14} /> {c.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 w-12 h-12 relative group shadow-sm">
                           <ShoppingBag size={18} className="text-slate-500 mb-0.5" />
                           <span className="font-black text-slate-800 text-xs">{c.total_orders}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 text-lg">
                        ${c.total_spent.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
