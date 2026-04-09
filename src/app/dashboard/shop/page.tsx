"use client"

export const dynamic = "force-dynamic"

import * as React from "react"
import { useAuthStore } from "@/store/auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  Store, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Briefcase, 
  MapPin,
  Camera,
  Globe,
  RefreshCw,
  Copy,
  Check
} from "lucide-react"
import { generateSlug } from "@/lib/utils"

export default function ShopSettingsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isCopied, setIsCopied] = React.useState(false)
  const [hasExistingShop, setHasExistingShop] = React.useState(false)
  
  const [shopData, setShopData] = React.useState({
    name: "",
    slug: "",
    description: "",
    whatsapp_number: "",
    manager_name: "",
    personal_phone: "",
    sector: "",
    address: "",
  })

  const fetchShop = React.useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("vendor_id", user.uid)
      .maybeSingle()
      
    if (data) {
      setHasExistingShop(true)
      setShopData({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        whatsapp_number: data.whatsapp_number || "",
        manager_name: data.manager_name || "",
        personal_phone: data.personal_phone || "",
        sector: data.sector || "",
        address: data.address || "",
      })
    }
    setIsLoading(false)
  }, [user, supabase])

  React.useEffect(() => {
    fetchShop()
  }, [fetchShop])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    setMessage(null)
    
    const payload = {
      vendor_id: user.uid,
      name: shopData.name,
      slug: shopData.slug,
      description: shopData.description,
      whatsapp_number: shopData.whatsapp_number,
      manager_name: shopData.manager_name,
      personal_phone: shopData.personal_phone,
      sector: shopData.sector,
      address: shopData.address,
    }

    try {
      let error = null
      
      if (hasExistingShop) {
        // Mode Mise à jour
        const { error: updateError } = await supabase
          .from("shops")
          .update(payload)
          .eq("vendor_id", user.uid)
        error = updateError
      } else {
        // Mode Création
        const { error: insertError } = await supabase
          .from("shops")
          .insert([payload])
        error = insertError
      }

      if (error) throw error
      
      setHasExistingShop(true)
      setMessage({ type: 'success', text: "Paramètres de la boutique enregistrés avec succès !" })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setMessage({ type: 'error', text: "Erreur : " + err.message })
    } finally {
      setIsSaving(false)
    }
  }

  const copyUrlToClipboard = () => {
    const url = `${window.location.origin}/s/${shopData.slug}`
    navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-0">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-3xl font-black tracking-tight">Ma Boutique</h1>
        <p className="text-muted-foreground font-medium italic">Personnalisez votre profil public et vos informations professionnelles.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold shadow-sm border animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Profile Branding Mockup */}
      <div className="relative h-44 sm:h-56 w-full rounded-3xl overflow-hidden bg-slate-900 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center relative hover:scale-105 transition-transform cursor-pointer overflow-hidden">
              <Store size={32} className="text-slate-300" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                 <Camera className="text-white" size={24} />
              </div>
           </div>
           <div className="pb-1 text-white pr-4">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate max-w-[200px] sm:max-w-md">{shopData.name || "Ma Boutique"}</h2>
              <div className="flex items-center gap-2 opacity-80 text-[10px] sm:text-sm font-bold overflow-hidden">
                  <Globe size={14} className="shrink-0" /> 
                  <span className="truncate">{typeof window !== 'undefined' ? `${window.location.host}/s/${shopData.slug || "---"}` : `/s/${shopData.slug || "---"}`}</span>
                  <button 
                    onClick={(e) => { e.preventDefault(); copyUrlToClipboard(); }}
                    className="shrink-0 p-1.5 bg-white/20 hover:bg-white/40 rounded-lg transition-all active:scale-90"
                    title="Copier le lien"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
              </div>
           </div>
        </div>
        <button 
          onClick={() => window.open(`/s/${shopData.slug}`, '_blank')}
          className="absolute top-4 right-4 bg-white shadow-xl text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10 border border-slate-100"
        >
           <Globe size={12} className="text-primary" /> Voir
        </button>
      </div>

      <form id="shop-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Informations de la Boutique */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white md:col-span-1 rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <Store size={20} />
              <CardTitle className="text-lg font-black uppercase tracking-wider">La Boutique</CardTitle>
            </div>
            <CardDescription className="font-medium italic">Infos visibles par vos clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nom de la boutique</label>
              <Input 
                value={shopData.name}
                onChange={e => setShopData({...shopData, name: e.target.value})}
                className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold px-4"
                placeholder="Ex: Boutique Fashion"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp Business</label>
              <div className="relative">
                <Input 
                  value={shopData.whatsapp_number}
                  onChange={e => setShopData({...shopData, whatsapp_number: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold pl-12"
                  placeholder="237 6xx xxx xxx"
                  required
                />
                <Phone className="absolute left-4 top-4 text-emerald-500" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Lien de la boutique</label>
              <div className="relative flex items-center group/slug">
                <span className="absolute left-4 text-muted-foreground text-[10px] font-black uppercase tracking-tighter">/s/</span>
                <Input 
                  value={shopData.slug}
                  onChange={e => setShopData({...shopData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold pl-12 pr-12"
                  placeholder="nom-boutique"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShopData({...shopData, slug: generateSlug(shopData.name || "ma-boutique")})}
                  className="absolute right-3 p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 active:scale-90"
                  title="Générer un lien unique"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
              <Textarea 
                value={shopData.description}
                onChange={e => setShopData({...shopData, description: e.target.value})}
                className="min-h-[120px] rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-medium italic p-4"
                placeholder="Décrivez votre boutique..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations Administratives */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white md:col-span-1 rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-violet-500">
              <User size={20} />
              <CardTitle className="text-lg font-black uppercase tracking-wider">Le Gérant</CardTitle>
            </div>
            <CardDescription className="font-medium italic">Infos privées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nom du gérant</label>
              <div className="relative">
                <Input 
                  value={shopData.manager_name}
                  onChange={e => setShopData({...shopData, manager_name: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold pl-12"
                  placeholder="Nom complet"
                />
                <User className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Téléphone Personnel</label>
              <div className="relative">
                <Input 
                  value={shopData.personal_phone}
                  onChange={e => setShopData({...shopData, personal_phone: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold pl-12"
                  placeholder="Contact direct"
                />
                <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Adresse physique</label>
              <div className="relative">
                <Input 
                  value={shopData.address}
                  onChange={e => setShopData({...shopData, address: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-primary transition-all font-bold pl-12"
                  placeholder="Localisation"
                />
                <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Save Button */}
      <div className="flex justify-end pt-4 mb-20">
        <Button 
          type="submit" 
          form="shop-form"
          variant="premium" 
          className="w-full sm:w-auto h-14 sm:h-12 rounded-2xl sm:rounded-xl sm:px-12 font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20}/>}
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  )
}
