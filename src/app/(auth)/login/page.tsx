"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, Chrome, Globe, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { loginWithGoogle } from "@/lib/firebase/auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const result = await loginWithGoogle("vendor"); // Hardcoded as vendor portal
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl max-w-md w-full animate-fade-in mx-auto">
      <CardHeader className="space-y-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-2">
          <Store size={32} />
        </div>
        <CardTitle className="text-3xl font-black">Vendor Portal</CardTitle>
        <CardDescription className="text-base text-muted-foreground font-medium">
          Manage your ShopWave store, orders, and products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-semibold animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-14 text-lg font-bold gap-3 rounded-2xl border-2 hover:bg-slate-50 transition-all shadow-lg active:scale-95"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome size={24} className="text-blue-500" />
            Sign in with Google
          </Button>
          <p className="text-[11px] text-center text-muted-foreground w-4/5 mx-auto">
            By signing in, you agree to ShopWave's Vendor Terms of Service and Privacy Policy.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t py-6 bg-slate-50/50 rounded-b-3xl">
        <p className="text-sm font-medium">
          Don't have a shop?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">
            Apply to be a Vendor
          </Link>
        </p>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 mt-2">
          <Globe size={12} /> Back to homepage
        </Link>
      </CardFooter>
    </Card>
  )
}
