import { useTranslation } from "@/hooks/use-translation"

export default function OrdersPage() {
  const { t, language } = useTranslation()
  const [activeTab, setActiveTab] = React.useState("Toutes")

  const openWhatsAppCustomer = (i: number) => {
    // In a real app, this would be customer.phone
    const dummyPhone = `23769000000${i}`
    const message = encodeURIComponent(`Bonjour, je suis le vendeur ShopWave concernant votre commande #${2024}-${(100 + i) * 7}.`)
    window.open(`https://wa.me/${dummyPhone}?text=${message}`, '_blank')
  }

  // ... (Rest of the component using translations)

  const tabs = ["Toutes", "En attente", "En cours", "Expédiées", "Livrées"]

  const getStatusBadge = (i: number) => {
    if (i === 1) return <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><Clock size={14} /> En attente</Badge>
    if (i === 2) return <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><Truck size={14} /> Expédiée</Badge>
    return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 size={14} /> Livrée</Badge>
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gestion des Commandes</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Suivez et validez les achats de vos clients en temps réel.</p>
        </div>
        <Button variant="outline" className="hidden sm:flex rounded-xl font-bold h-11 px-6 border-2 gap-2">
          <Download size={18} /> Exporter
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tabs - Scrollable on mobile */}
        <div className="flex p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar snap-x">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap snap-center",
                activeTab === tab 
                  ? "bg-white shadow-lg text-primary scale-100" 
                  : "text-slate-500 hover:text-slate-700 scale-95"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <Input 
            className="pl-12 h-14 rounded-2xl bg-white border-transparent shadow-xl shadow-slate-200/40 focus:border-primary transition-all font-bold placeholder:text-slate-300" 
            placeholder="Rechercher par Client, ID ou Email..." 
          />
        </div>
      </div>

      {/* Orders List / Table */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/50 backdrop-blur-xl overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          
          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Commande</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Articles</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <span className="font-black text-primary text-sm tracking-tight group-hover:underline">#ORD-{2024}-{(100 + i) * 7}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-slate-800">Alex Johnson {i}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">alex@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700">{10 + i} Oct, 2024</p>
                      <p className="text-[10px] text-slate-400 font-bold">14:{(10 + i) * 2}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Badge variant="secondary" className="font-black rounded-lg">{i % 3 + 1} Art.</Badge>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900">{formatCurrency(i * 12500)}</td>
                    <td className="px-8 py-6">
                      {getStatusBadge(i)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl gap-2 text-emerald-600 font-black hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-100">
                          <MessageCircle size={18} />
                          WhatsApp
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW (CARDS) */}
          <div className="lg:hidden flex flex-col divide-y divide-slate-100 bg-white rounded-3xl">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 active:bg-slate-50 transition-colors flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} />
                       <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate">Alex Johnson {i}</p>
                      <p className="text-[10px] font-bold text-primary uppercase">#ORD-{2024}-{(100 + i) * 7}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-base text-slate-900">{formatCurrency(i * 12500)}</p>
                     <p className="text-[10px] font-bold text-slate-400">{10+i} oct. • 14h15</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                   <div className="flex items-center gap-2">
                     {getStatusBadge(i)}
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i % 3 + 1} Articles</span>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 active:scale-90 transition-all">
                        <MessageCircle size={22} className="fill-emerald-600/10" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 active:scale-90 transition-all">
                        <ChevronRight size={22} />
                      </Button>
                   </div>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Quick Stats Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10">
         <div className="bg-white p-4 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Commandes</p>
            <p className="text-2xl font-black text-slate-800">124</p>
         </div>
         <div className="bg-white p-4 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Chiffre d'Affaires</p>
            <p className="text-2xl font-black text-emerald-600">3.2M</p>
         </div>
         <div className="bg-white p-4 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">En Cours</p>
            <p className="text-2xl font-black text-blue-600">12</p>
         </div>
         <div className="bg-white p-4 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Satisfaction</p>
            <p className="text-2xl font-black text-violet-600">100%</p>
         </div>
      </div>
    </div>
  )
}
