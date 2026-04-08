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
  DollarSign,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  Eye,
  Archive,
  ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
import { Product } from "@/lib/supabase"

// Mock Products - In a real app, this would come from Supabase
const INITIAL_PRODUCTS: (Product & { purchase_cost: number, low_stock_threshold: number, status: string })[] = [
  {
    id: "1",
    shop_id: "shop-1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-quality noise-canceling wireless headphones with 40h battery life.",
    price: 299.99,
    purchase_cost: 150.00,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200"],
    category: "Technology",
    stock_quantity: 45,
    low_stock_threshold: 10,
    status: "active",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    shop_id: "shop-1",
    name: "Minimalist Leather Watch",
    slug: "minimalist-leather-watch",
    description: "Elegant wrist watch with genuine leather strap and sapphire glass.",
    price: 189.00,
    purchase_cost: 85.00,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200"],
    category: "Fashion",
    stock_quantity: 8,
    low_stock_threshold: 15,
    status: "active",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    shop_id: "shop-1",
    name: "Smart Coffee Maker",
    slug: "smart-coffee-maker",
    description: "Wi-Fi enabled coffee maker with scheduled brewing and temperature control.",
    price: 129.50,
    purchase_cost: 60.00,
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=200"],
    category: "Home & Decor",
    stock_quantity: 0,
    low_stock_threshold: 5,
    status: "out_of_stock",
    is_active: false,
    created_at: new Date().toISOString(),
  }
]

const CATEGORIES = ["Technology", "Fashion", "Home & Decor", "Beauty", "Sports", "Other"]

export default function ProductsPage() {
  const [products, setProducts] = React.useState(INITIAL_PRODUCTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<any>(null)
  
  // Create / Edit Form State
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Technology",
    description: "",
    price: "",
    purchase_cost: "",
    stock_quantity: "",
    low_stock_threshold: "10",
    status: "active",
    images: ""
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      category: "Technology",
      description: "",
      price: "",
      purchase_cost: "",
      stock_quantity: "",
      low_stock_threshold: "10",
      status: "active",
      images: ""
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      purchase_cost: product.purchase_cost.toString(),
      stock_quantity: product.stock_quantity.toString(),
      low_stock_threshold: product.low_stock_threshold.toString(),
      status: product.status,
      images: product.images.join(", ")
    })
    setIsEditModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct: any = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      shop_id: "shop-1",
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/ /g, "-"),
      description: formData.description,
      price: parseFloat(formData.price),
      purchase_cost: parseFloat(formData.purchase_cost),
      stock_quantity: parseInt(formData.stock_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      category: formData.category,
      status: formData.status,
      is_active: formData.status === "active",
      images: formData.images.split(",").map(s => s.trim()).filter(s => s !== ""),
      created_at: editingProduct ? editingProduct.created_at : new Date().toISOString()
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p))
      setIsEditModalOpen(false)
    } else {
      setProducts([newProduct, ...products])
      setIsCreateModalOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             Products <Badge variant="outline" className="font-bold border-2">{products.length} Items</Badge>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your inventory, pricing, and product details</p>
        </div>
        <Button 
          variant="premium" 
          className="rounded-2xl h-14 px-8 font-bold shadow-xl shadow-primary/20 gap-2 text-lg"
          onClick={handleOpenCreate}
        >
           <Plus size={24} strokeWidth={3} /> Create Product
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatItem title="Avg. Profit" value="$85.20" icon={<TrendingUp className="text-emerald-500" />} />
         <StatItem title="Total Inventory" value={products.reduce((acc, p) => acc + p.stock_quantity, 0).toString()} icon={<Package className="text-blue-500" />} />
         <StatItem title="Active Items" value={products.filter(p => p.status === 'active').length.toString()} icon={<CheckCircle2 className="text-violet-500" />} />
         <StatItem title="Out of Stock" value={products.filter(p => p.stock_quantity === 0).length.toString()} icon={<AlertCircle className="text-rose-500" />} />
      </div>

      {/* Filter / Search Bar */}
      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search products by name, ID or category..." 
              className="pl-12 h-12 bg-slate-50 border-none rounded-xl font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 px-6 border-2">
               <Filter size={18} /> Filters
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-2">
               <LayoutGrid size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b">
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Profit/Unit</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => {
                const profit = product.price - product.purchase_cost;
                const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;
                const isOutOfStock = product.stock_quantity === 0;

                return (
                  <tr key={product.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                          {product.images?.[0] ? (
                             <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <Package size={24} />
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-black mt-0.5">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{product.category}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="font-black text-slate-900">${product.price.toFixed(2)} <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Sale</span></p>
                          <p className="text-[11px] text-muted-foreground font-bold line-through ml-0.5 opacity-50">${product.purchase_cost.toFixed(2)} <span className="no-underline text-[9px] uppercase tracking-tighter">Cost</span></p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                             <span className={cn(
                               "text-sm font-black",
                               isOutOfStock ? "text-rose-500" : isLowStock ? "text-orange-500" : "text-slate-900"
                             )}>
                               {product.stock_quantity}
                             </span>
                             <span className="text-[10px] font-bold text-muted-foreground">Units</span>
                          </div>
                          {isLowStock && (
                            <Badge className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-50 text-[9px] h-4 px-1.5 font-black uppercase">Low Stock</Badge>
                          )}
                          {isOutOfStock && (
                            <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 text-[9px] h-4 px-1.5 font-black uppercase">Out of Stock</Badge>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-[15px]">
                          <TrendingUp size={14} strokeWidth={3} />
                          ${profit.toFixed(2)}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <Badge 
                         variant={product.status === 'active' ? "success" : product.status === 'draft' ? "outline" : "destructive"}
                         className="rounded-lg h-7 px-3 font-bold"
                       >
                         {product.status === 'active' ? "Active" : product.status === 'draft' ? "Draft" : "Suspended"}
                       </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="rounded-xl h-10 w-10 hover:bg-violet-50 hover:text-violet-600 transition-all"
                           onClick={() => handleOpenEdit(product)}
                         >
                           <Pencil size={18} />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="rounded-xl h-10 w-10 hover:bg-rose-50 hover:text-rose-600 transition-all text-slate-400"
                           onClick={() => handleDelete(product.id)}
                         >
                           <Trash2 size={18} />
                         </Button>
                         <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                            <MoreVertical size={18} />
                         </Button>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Product Modal */}
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
    <Card className="border-none shadow-xl shadow-slate-200/50">
      <CardContent className="p-6 flex items-center justify-between">
         <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-black mt-1">{value}</h3>
         </div>
         <div className="w-12 h-12 rounded-2xl bg-white border shadow-sm flex items-center justify-center">
            {icon}
         </div>
      </CardContent>
    </Card>
  )
}

function ProductModal({ isOpen, onClose, formData, setFormData, onSave, isEdit }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] no-scrollbar p-0 border-none bg-slate-50">
        <form onSubmit={onSave}>
          <DialogHeader className="p-8 bg-white border-b sticky top-0 z-10">
            <DialogTitle className="text-3xl">{isEdit ? "Edit Product" : "New Marketplace Item"}</DialogTitle>
            <DialogDescription className="font-medium">Define your product details, pricing and inventory levels.</DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            {/* General Info */}
            <div className="space-y-6">
               <h3 className="text-lg font-black flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Product Information
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-3">
                     <Label>Product Name</Label>
                     <Input 
                       placeholder="e.g. Premium Leather Sneakers" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="h-12 border-none font-bold"
                       required
                     />
                  </div>
                  <div className="space-y-3">
                     <Label>Category</Label>
                     <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                        <SelectTrigger className="h-12 border-none font-bold">
                           <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                           {CATEGORIES.map(c => (
                             <SelectItem key={c} value={c}>{c}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-3">
                     <Label>Status</Label>
                     <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                        <SelectTrigger className="h-12 border-none font-bold">
                           <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="active">Active (Visible)</SelectItem>
                           <SelectItem value="draft">Draft (Hidden)</SelectItem>
                           <SelectItem value="out_of_stock">Archived</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="col-span-2 space-y-3">
                     <Label>Description</Label>
                     <Textarea 
                       placeholder="Highlight your product's best features..." 
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       className="border-none font-medium text-sm"
                     />
                  </div>
               </div>
            </div>

            {/* Pricing / Stock */}
            <div className="space-y-6">
               <h3 className="text-lg font-black flex items-center gap-2">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                  Pricing & Inventory
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <Label className="flex items-center gap-2">
                        Selling Price <DollarSign size={14} />
                     </Label>
                     <Input 
                       type="number" 
                       placeholder="0.00" 
                       value={formData.price}
                       onChange={(e) => setFormData({...formData, price: e.target.value})}
                       className="h-12 border-none font-black text-primary text-lg"
                       required
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="flex items-center gap-2">
                        Purchase Cost <Archive size={14} />
                     </Label>
                     <Input 
                       type="number" 
                       placeholder="0.00" 
                       value={formData.purchase_cost}
                       onChange={(e) => setFormData({...formData, purchase_cost: e.target.value})}
                       className="h-12 border-none font-bold text-muted-foreground"
                       required
                     />
                     <p className="text-[10px] text-muted-foreground font-bold px-2 italic">Profit will be ${ (parseFloat(formData.price || '0') - parseFloat(formData.purchase_cost || '0')).toFixed(2) }</p>
                  </div>
                  <div className="space-y-3">
                     <Label>Current Stock</Label>
                     <Input 
                       type="number" 
                       placeholder="0" 
                       value={formData.stock_quantity}
                       onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                       className="h-12 border-none font-bold"
                       required
                     />
                  </div>
                  <div className="space-y-3">
                     <Label>Low Stock Threshold</Label>
                     <Input 
                       type="number" 
                       placeholder="10" 
                       value={formData.low_stock_threshold}
                       onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
                       className="h-12 border-none font-bold"
                     />
                  </div>
               </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
               <h3 className="text-lg font-black flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  Media & Asset URLs
               </h3>
               <div className="space-y-3">
                  <Label>Image URLs (comma separated)</Label>
                  <Textarea 
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg..." 
                    value={formData.images}
                    onChange={(e) => setFormData({...formData, images: e.target.value})}
                    className="border-none font-medium h-24"
                  />
                  <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
                     {formData.images.split(",").filter((s: string) => s.trim() !== "").map((url: string, i: number) => (
                       <div key={i} className="w-20 h-20 rounded-xl bg-white border shrink-0 overflow-hidden shadow-sm relative">
                          <img src={url.trim()} className="w-full h-full object-cover" />
                       </div>
                     ))}
                     <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-1 shrink-0">
                        <ImageIcon size={20} />
                        <span className="text-[9px] font-black uppercase">Preview</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-white border-t rounded-b-[32px] gap-4">
             <DialogClose asChild>
                <Button type="button" variant="outline" className="h-14 rounded-2xl px-8 font-bold border-2">Cancel</Button>
             </DialogClose>
             <Button type="submit" variant="premium" className="h-14 rounded-2xl px-12 font-extrabold shadow-xl shadow-primary/20">
                {isEdit ? "Update Product" : "Publish Product"}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
