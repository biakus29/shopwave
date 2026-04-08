"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StoreNavbar } from "@/components/layout/store-navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Loader2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { generateWhatsAppUrl } from "@/lib/utils"

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const total = getTotal()

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Construct WhatsApp message
    const businessPhone = "1234567890" // This should ideally come from the Shop data
    let message = `*New Order from ShopWave*\n\n`
    message += `*Customer Details:*\n`
    message += `Name: ${formData.fullName}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone}\n`
    message += `Address: ${formData.address}, ${formData.city}\n\n`
    message += `*Order Items:*\n`
    
    items.forEach(item => {
      message += `- ${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}\n`
    })
    
    message += `\n*Total Amount: $${total.toFixed(2)}*\n\n`
    message += `I'd like to discuss the payment for this order.`

    // Simulate database order creation
    setTimeout(() => {
      const whatsappUrl = generateWhatsAppUrl(businessPhone, message)
      window.open(whatsappUrl, "_blank")
      clearCart()
      setIsProcessing(false)
      router.push("/store/thank-you")
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <StoreNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
             <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-slate-300" />
             </div>
             <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
             <Button variant="premium" onClick={() => router.push("/store")}>Start Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <StoreNavbar />
      
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight mb-2">Checkout</h1>
            <p className="text-muted-foreground font-medium">Complete your shipping details to proceed</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Delivery Form */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Full Name</label>
                      <Input 
                        name="fullName" 
                        placeholder="John Doe" 
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Email</label>
                        <Input 
                          name="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Phone</label>
                        <Input 
                          name="phone" 
                          placeholder="+1 (555) 000-0000" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Shipping Address</label>
                      <Input 
                        name="address" 
                        placeholder="123 Street Name" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">City</label>
                      <Input 
                        name="city" 
                        placeholder="New York" 
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="pt-6">
                       <Button 
                         variant="premium" 
                         className="w-full h-14 rounded-2xl shadow-xl shadow-primary/30 gap-3 text-lg"
                         type="submit"
                         disabled={isProcessing}
                       >
                         {isProcessing ? (
                           <>
                             <Loader2 size={24} className="animate-spin" />
                             Processing...
                           </>
                         ) : (
                           <>
                             Confirm & Pay on WhatsApp
                             <MessageCircle size={24} />
                           </>
                         )}
                       </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50 shrink-0">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-black text-emerald-900">Direct Communication</p>
                    <p className="text-xs text-emerald-700/80 leading-relaxed font-medium mt-1">
                      You will be redirected to WhatsApp to confirm your order details and discuss payment methods directly with the vendor.
                    </p>
                 </div>
              </div>
            </div>

            {/* Order Preview */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="p-8 border-b bg-slate-50/50">
                   <CardTitle className="text-xl font-bold">Your Order</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                              <img src={item.product.images?.[0] || 'https://picsum.photos/seed/p1/200'} alt={item.product.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-sm font-bold truncate max-w-[150px]">{item.product.name}</p>
                              <p className="text-[10px] text-muted-foreground font-black">Qty: {item.quantity}</p>
                           </div>
                        </div>
                        <p className="font-black text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-emerald-500">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-4">
                      <span>Order Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
