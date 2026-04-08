import Link from "next/link"
import { ShoppingBag, Twitter, Github, Linkedin } from "lucide-react"


export function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white shadow-md">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">ShopWave</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            The modern ecommerce platform for small businesses. Launch your store in minutes and reach customers worldwide.
          </p>
          <div className="flex gap-4">
            <Twitter size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Github size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Linkedin size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>


        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopWave. All rights reserved.
      </div>
    </footer>
  )
}
