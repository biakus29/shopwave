"use client"

import * as React from "react"
import Link from "next/link"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { signUp } from "@/lib/auth/actions"

export default function SignupPage() {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<"vendor" | "customer">("vendor")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signUp({ email, password, fullName, role })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-black">Create account</CardTitle>
        <CardDescription className="text-base text-center">
          Join ShopWave today and start selling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Role selector */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
              role === "vendor" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {role === "vendor" && <Check size={14} />}
            I am a Vendor
          </button>
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
              role === "customer" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {role === "customer" && <Check size={14} />}
            I am a Customer
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-semibold animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Full Name</label>
            <Input
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Email address</label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Password</label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary font-bold">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary font-bold">Privacy Policy</Link>.
          </p>
          <Button
            variant="premium"
            className="w-full h-12 text-base mt-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="animate-spin mr-2" size={18} /> Creating account...</>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t py-6 bg-slate-50/50 rounded-b-2xl">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
