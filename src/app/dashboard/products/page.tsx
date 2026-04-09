"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Package,
  TrendingUp,
  LayoutGrid,
  Archive,
  Banknote,
  Upload,
  X,
  Loader2,
  Settings2,
  Tags,
  ChevronRight
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn, formatCurrency } from "@/lib/utils"
import { storage } from "@/lib/firebase/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const CATEGORIES = ["Technology", "Fashion", "Home & Decor", "Beauty", "Sports", "Other"]

export default function ProductsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  
  const [products, setProducts] = React.useState<any[]>([])
  const [shopId, setShopId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<any>(null)
  
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Technology",
    description: "",
    price: "",
    purchase_cost: "",
    stock_quantity: "",
    low_stock_threshold: "10",
    status: "active",
    images: "",
    attributes: [] as { name: string, values: string[] }[]
  })

  const fetchProducts = React.useCallback(async (sId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("shop_id", sId)
      .order("created_at", { ascending: false })
      
    if (data) setProducts(data)
    setIsLoading(false)
  }, [supabase])

  React.useEffect(() => {
    async function getShop() {
      if (!user) return
      
      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("vendor_id", user.uid)
        .maybeSingle()
        
      if (shop) {
        setShopId(shop.id)
        fetchProducts(shop.id)
      } else {
        setIsLoading(false)
      }
    }
    getShop()
  }, [user, supabase, fetchProducts])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenCreate = () => {
    if (!shopId) {
      alert("Veuillez d'abord configurer votre boutique dans les réglages.")
      window.location.href = '/dashboard/shop'
      return
    }
    setFormData({
      name: "",
      category: "Technology",
      description: "",
      price: "",
      purchase_cost: "",
      stock_quantity: "",
      low_stock_threshold: "10",
      status: "active",
      images: "",
      attributes: []
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: product.price.toString(),
      purchase_cost: (product.purchase_cost || 0).toString(),
      stock_quantity: product.stock_quantity.toString(),
      low_stock_threshold: (product.low_stock_threshold || 10).toString(),
      status: product.status,
      images: (product.images || []).join(", "),
      attributes: product.attributes || []
    })
    setIsEditModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopId) return

    const productData: any = {
      shop_id: shopId,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: formData.description,
      price: parseFloat(formData.price),
      purchase_cost: parseFloat(formData.purchase_cost),
      stock_quantity: parseInt(formData.stock_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      category: formData.category,
      status: formData.status,
      is_active: formData.status === "active",
      images: formData.images.split(",").map(s => s.trim()).filter(s => s !== ""),
      attributes: formData.attributes,
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
        
        if (error) throw error
        fetchProducts(shopId)
        setIsEditModalOpen(false)
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData])
        
        if (error) throw error
        fetchProducts(shopId)
        setIsCreateModalOpen(false)
      }
    } catch (err: any) {
      alert("Erreur: " + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!shopId) return
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
      
      if (!error) fetchProducts(shopId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 animate-fade-in px-1">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Produits</h1>
            <p className="text-muted-foreground text-xs font-medium">Gérez votre catalogue mobile.</p>
          </div>
          <Badge variant="outline" className="font-bold border-2 h-8 px-3 rounded-full bg-white whitespace-nowrap">
             {products.length} ARTICLES
          </Badge>
        </div>
        
        {!shopId ? (
          <Card className="border-dashed border-2 bg-rose-50/50 border-rose-200 rounded-2xl overflow-hidden animate-pulse">
            <CardContent className="p-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertCircle size={20} />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-rose-700 uppercase tracking-tighter">Boutique non configurée</p>
                  <p className="text-[10px] text-rose-600 font-medium leading-tight">Veuillez terminer la configuration pour ajouter des produits.</p>
               </div>
               <Button size="sm" variant="outline" className="rounded-xl border-rose-200 text-rose-700 font-bold text-xs" onClick={() => window.location.href='/dashboard/shop'}>
                  Aller <ChevronRight size={14} />
               </Button>
            </CardContent>
          </Card>
        ) : (
          <Button 
            variant="premium" 
            className="w-full rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 gap-2 text-base active:scale-95 transition-all uppercase tracking-widest"
            onClick={handleOpenCreate}
          >
             <Plus size={20} strokeWidth={3} /> Créer un Produit
          </Button>
        )}
      </div>

      {/* Stats Quick View - Improved Mobile View */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1 snap-x">
         <div className="snap-center shrink-0 w-44">
           <StatItem title="Vente Potentielle" value={formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0))} icon={<TrendingUp className="text-emerald-500" />} />
         </div>
         <div className="snap-center shrink-0 w-40">
           <StatItem title="Stock Total" value={products.reduce((acc, p) => acc + p.stock_quantity, 0).toString()} icon={<Package className="text-blue-500" />} />
         </div>
         <div className="snap-center shrink-0 w-40">
           <StatItem title="En Ligne" value={products.filter(p => p.status === 'active').length.toString()} icon={<CheckCircle2 className="text-violet-500" />} />
         </div>
      </div>

      {/* Search Bar - Full Width on Mobile */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Rechercher un produit..." 
          className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl font-bold w-full text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Grid - Vertical Cards on Mobile */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const profit = product.price - (product.purchase_cost || 0);
          const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 10);
          const isOutOfStock = product.stock_quantity === 0;

          return (
            <Card key={product.id} className="border-none shadow-xl shadow-slate-200/40 rounded-[28px] overflow-hidden group active:scale-[0.98] transition-all">
              <div className="flex p-3 gap-3">
                {/* Image Container */}
                <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-inner relative">
                  {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={28} />
                      </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                       <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-1">En rupture</span>
                    </div>
                  )}
                </div>

                {/* Details Container */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{product.category}</span>
                       <Badge variant={product.status === 'active' ? "success" : "outline"} className="h-5 px-1.5 text-[8px] font-black uppercase rounded-lg">
                          {product.status === 'active' ? "Ligne" : "Brouillon"}
                       </Badge>
                    </div>
                    <h3 className="font-black text-sm text-slate-900 leading-tight truncate pr-4">{product.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-base font-black text-slate-900">{formatCurrency(product.price)}</span>
                       {isLowStock && !isOutOfStock && <AlertCircle size={14} className="text-orange-500 animate-pulse" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Stock</span>
                           <span className={cn("text-xs font-black", isOutOfStock ? "text-rose-500" : isLowStock ? "text-orange-500" : "text-slate-900")}>
                              {product.stock_quantity} pces
                           </span>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-100 mx-1" />
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Bénéfice</span>
                           <span className="text-xs font-black text-emerald-600">+{formatCurrency(profit)}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-1">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl bg-rose-50 text-rose-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                     </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
               <Package size={40} />
            </div>
            <div>
              <p className="font-black text-lg">Aucun produit</p>
              <p className="text-sm text-muted-foreground font-medium">Commencez par ajouter votre premier article.</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        <Button 
           className="w-16 h-16 rounded-[24px] shadow-2xl bg-primary text-white p-0 flex items-center justify-center animate-bounce hover:animate-none"
           onClick={handleOpenCreate}
           disabled={!shopId}
        >
           <Plus size={32} strokeWidth={3} />
        </Button>
      </div>

      <ProductModal 
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isEdit={isEditModalOpen}
      />
    </div>
  )
}

function StatItem({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-md shadow-slate-200/50 rounded-[24px] h-full bg-white">
      <CardContent className="p-4 flex flex-col gap-2">
         <div className="w-8 h-8 rounded-xl bg-slate-50 border shadow-sm flex items-center justify-center shrink-0">
            {React.cloneElement(icon as React.ReactElement, { size: 16 })}
         </div>
         <div className="min-w-0">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate">{title}</p>
            <h3 className="text-sm font-black mt-0.5 truncate">{value}</h3>
         </div>
      </CardContent>
    </Card>
  )
}

function ProductModal({ isOpen, onClose, formData, setFormData, onSave, isEdit }: any) {
  const [isUploading, setIsUploading] = React.useState(false)
  const supabase = createClient()

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { name: "", values: [] }]
    })
  }

  const updateAttributeName = (index: number, name: string) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index].name = name
    setFormData({ ...formData, attributes: newAttributes })
  }

  const updateAttributeValues = (index: number, valueStr: string) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index].values = valueStr.split(",").map(s => s.trim()).filter(s => s !== "")
    setFormData({ ...formData, attributes: newAttributes })
  }

  const removeAttribute = (index: number) => {
    const newAttributes = [...formData.attributes]
    newAttributes.splice(index, 1)
    setFormData({ ...formData, attributes: newAttributes })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileName = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `products/${fileName}`)
      
      const snapshot = await uploadBytes(storageRef, file)
      const publicUrl = await getDownloadURL(snapshot.ref)

      const currentImages = formData.images ? formData.images.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "") : []
      setFormData({
        ...formData,
        images: [...currentImages, publicUrl].join(", ")
      })
    } catch (error: any) {
      alert("Erreur: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const currentImages = formData.images.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
    currentImages.splice(index, 1)
    setFormData({
      ...formData,
      images: currentImages.join(", ")
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[100vw] h-[100vh] sm:h-auto sm:w-[95vw] sm:rounded-[40px] overflow-y-auto no-scrollbar p-0 border-none bg-white">
        <form onSubmit={onSave} className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b bg-white sticky top-0 z-20 flex flex-row items-center justify-between">
            <div>
               <DialogTitle className="text-xl font-black">{isEdit ? "Modifier" : "Publier"}</DialogTitle>
               <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Nouveau Produit</DialogDescription>
            </div>
            <DialogClose asChild>
               <Button type="button" variant="ghost" size="icon" className="rounded-full bg-slate-50">
                  <X size={20} />
               </Button>
            </DialogClose>
          </DialogHeader>
          
          <div className="p-6 space-y-8 flex-1">
            {/* Essential Info */}
            <div className="space-y-4">
               <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Nom du produit</Label>
                     <Input 
                       placeholder="ex: Chaussure Nike Air" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="h-14 rounded-2xl border-2 border-slate-50 font-black text-lg bg-slate-50 focus:bg-white focus:border-primary transition-all"
                       required
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Catégorie</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                           <SelectTrigger className="h-14 rounded-2xl border-none font-bold bg-slate-50">
                              <SelectValue placeholder="Choisir" />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              {CATEGORIES.map(c => (
                                <SelectItem key={c} value={c} className="font-bold py-3">{c}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Statut</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                           <SelectTrigger className="h-14 rounded-2xl border-none font-bold bg-slate-50">
                              <SelectValue placeholder="Statut" />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              <SelectItem value="active" className="font-bold py-3">Public</SelectItem>
                              <SelectItem value="draft" className="font-bold py-3">Brouillon</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>
            </div>

            {/* Price & Inventory */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[32px]">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 pl-1">Prix de vente</Label>
                  <Input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="h-12 rounded-xl border-none font-black text-lg text-emerald-600 bg-white"
                    required
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Quantité</Label>
                  <Input 
                    type="number" 
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    className="h-12 rounded-xl border-none font-black text-lg bg-white"
                    required
                  />
               </div>
            </div>

            {/* Images - Instagram Style */}
            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Galerie Photos</Label>
               <div className="grid grid-cols-3 gap-3">
                  {formData.images.split(",").filter((s: string) => s.trim() !== "").map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
                       <img src={url.trim()} className="w-full h-full object-cover" alt="Product" />
                       <button 
                         type="button"
                         onClick={() => removeImage(i)}
                         className="absolute top-1 right-1 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg"
                       >
                         <X size={12} strokeWidth={4} />
                       </button>
                    </div>
                  ))}
                  <label className={cn(
                    "flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer",
                    isUploading && "opacity-50 pointer-events-none"
                  )}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                    {isUploading ? <Loader2 className="animate-spin text-primary" size={20} /> : <Upload size={20} className="text-slate-400" />}
                  </label>
               </div>
            </div>
          </div>

          <div className="p-6 border-t bg-white flex gap-3 sticky bottom-0 z-20">
             <DialogClose asChild>
                <Button type="button" variant="outline" className="h-14 flex-1 rounded-2xl font-black border-2 border-slate-100 uppercase tracking-widest text-xs">Annuler</Button>
             </DialogClose>
             <Button type="submit" variant="premium" className="h-14 flex-[2] rounded-2xl font-black shadow-xl shadow-primary/20 uppercase tracking-widest text-xs" disabled={isUploading}>
                {isEdit ? "Enregistrer" : "Confirmer la publication"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
