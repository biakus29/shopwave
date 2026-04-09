"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, Chrome, Globe, Store, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { loginWithGoogle } from "@/lib/firebase/auth"

export default function SignupPage() {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [shopInfo, setShopInfo] = React.useState({
    shopName: "",
    whatsappNumber: "",
    shopDescription: "",
    managerName: "",
    personalPhone: "",
    sector: "",
    shopAddress: "",
  })

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopInfo.shopName || !shopInfo.whatsappNumber || !shopInfo.managerName || !shopInfo.personalPhone || !shopInfo.sector) {
      setError("Please fill in all the required fields.")
      return
    }
    setError(null)
    setStep(2)
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    // Save the shop info temporarily so it can be picked up after Google redirects back
    localStorage.setItem("pending_shop_info", JSON.stringify(shopInfo))
    
    const result = await loginWithGoogle("vendor");
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl max-w-lg w-full animate-fade-in mx-auto overflow-hidden">
      <div className="flex bg-slate-100">
        <div className={`h-1.5 flex-1 transition-colors ${step >= 1 ? 'bg-primary' : 'bg-transparent'}`} />
        <div className={`h-1.5 flex-1 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-transparent'}`} />
      </div>

      <CardHeader className="space-y-4 text-center pb-0">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-2">
          <Store size={32} />
        </div>
        <CardTitle className="text-3xl font-black">
          {step === 1 ? "Create Your Shop" : "Link Account"}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground font-medium">
          {step === 1 ? "Provide your business details to get started." : "Securely link your Google account to your new shop."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-semibold animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-slide-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Manager Name <span className="text-rose-500">*</span></label>
                <Input
                  placeholder="e.g. Jean Dupont"
                  value={shopInfo.managerName}
                  onChange={(e) => setShopInfo({ ...shopInfo, managerName: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Personal Phone <span className="text-rose-500">*</span></label>
                <Input
                  placeholder="+237 ..."
                  type="tel"
                  value={shopInfo.personalPhone}
                  onChange={(e) => setShopInfo({ ...shopInfo, personalPhone: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Shop Name <span className="text-rose-500">*</span></label>
                <Input
                  placeholder="e.g. Acme Electronics"
                  value={shopInfo.shopName}
                  onChange={(e) => setShopInfo({ ...shopInfo, shopName: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Business Sector <span className="text-rose-500">*</span></label>
                <Input
                  placeholder="e.g. Electronics, Fashion..."
                  value={shopInfo.sector}
                  onChange={(e) => setShopInfo({ ...shopInfo, sector: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">WhatsApp Shop <span className="text-rose-500">*</span></label>
                <Input
                  placeholder="+237 ..."
                  type="tel"
                  value={shopInfo.whatsappNumber}
                  onChange={(e) => setShopInfo({ ...shopInfo, whatsappNumber: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Address</label>
                <Input
                  placeholder="Optional shop address"
                  value={shopInfo.shopAddress}
                  onChange={(e) => setShopInfo({ ...shopInfo, shopAddress: e.target.value })}
                  className="h-12 rounded-xl bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="premium"
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 mt-6"
            >
              Continue <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-in py-4">
            <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={16} /> <span>Shop details saved locally</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your shop <strong>&quot;{shopInfo.shopName}&quot;</strong> will be created automatically once you sign in.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full h-14 text-lg font-bold gap-3 rounded-2xl border-2 hover:bg-slate-50 transition-all shadow-lg active:scale-95"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <Chrome size={24} className="text-blue-500" />
              Sign up with Google
            </Button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Go back and edit shop details
            </button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4 border-t py-6 bg-slate-50/50 rounded-b-3xl">
        <p className="text-sm font-medium">
          Already a Vendor?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Login here
          </Link>
        </p>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 mt-2">
          <Globe size={12} /> Back to homepage
        </Link>
      </CardFooter>
    </Card>
  )
}
