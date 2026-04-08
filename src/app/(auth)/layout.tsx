import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 gradient-hero p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <Link href="/" className="flex items-center gap-2 group relative z-10 w-fit">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
            <ShoppingBag size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">ShopWave</span>
        </Link>
        
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Building the next generation of <span className="text-violet-400">digital commerce</span> for everyone.
          </h2>
          <p className="text-xl text-indigo-100/80 max-w-md">
            The simplest way to start, run and grow your business from anywhere in the world.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-indigo-100/50">
          © {new Date().getFullYear()} ShopWave Inc.
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <ShoppingBag size={32} />
              <span className="text-2xl font-black">ShopWave</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
