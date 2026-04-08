"use client"

import * as React from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { Calendar, Download, TrendingUp, Users, ShoppingBag, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const data = [
  { name: "Mon", sales: 4000, visits: 2400 },
  { name: "Tue", sales: 3000, visits: 1398 },
  { name: "Wed", sales: 2000, visits: 9800 },
  { name: "Thu", sales: 2780, visits: 3908 },
  { name: "Fri", sales: 1890, visits: 4800 },
  { name: "Sat", sales: 2390, visits: 3800 },
  { name: "Sun", sales: 3490, visits: 4300 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time insights into your shop performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-11 px-5 font-bold">
            <Calendar size={18} />
            Oct 1, 2024 - Oct 31, 2024
          </Button>
          <Button variant="outline" size="icon" className="h-11 w-11">
            <Download size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Revenue & Traffic</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Growth overview over the last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary"></div> Revenue
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-200"></div> Visits
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#64748b" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "16px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", 
                    padding: "12px" 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
                <Area 
                   type="monotone" 
                   dataKey="visits" 
                   stroke="#c7d2fe" 
                   strokeWidth={2}
                   strokeDasharray="5 5"
                   fillOpacity={0}
                 />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <MetricCard 
            title="Conversion Rate" 
            value="3.42%" 
            target="4.0%" 
            progress={85.5}
            trend="+0.6%"
            icon={<Target className="text-violet-500" />}
          />
          <MetricCard 
            title="Average Order Value" 
            value="$156.00" 
            target="$200" 
            progress={78}
            trend="+12.2%"
            icon={<ShoppingBag className="text-pink-500" />}
          />
          <MetricCard 
            title="Customer Retention" 
            value="64%" 
            target="75%" 
            progress={64}
            trend="-2.4%"
            isNegative
            icon={<Users className="text-indigo-500" />}
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, target, progress, trend, icon, isNegative }: { 
  title: string, 
  value: string, 
  target: string, 
  progress: number,
  trend: string,
  icon: React.ReactNode,
  isNegative?: boolean
}) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
            {icon}
          </div>
          <div className={cn(
            "text-xs font-black px-2 py-1 rounded-full",
            isNegative ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"
          )}>
            {trend}
          </div>
        </div>
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
        <div className="flex items-end gap-2 mt-1">
          <h3 className="text-2xl font-black">{value}</h3>
          <p className="text-[10px] text-muted-foreground font-bold mb-1.5 success">Target: {target}</p>
        </div>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
