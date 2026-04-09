"use client"

import Link from "next/link"
import { ShoppingBag, Twitter, Github, Linkedin } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function Footer() {
  const { t } = useTranslation()

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
            {t('footer.tagline')}
          </p>
          <div className="flex gap-4">
            <Twitter size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Github size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Linkedin size={20} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">{t('footer.platform')}</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-primary transition-colors">{t('common.features')}</Link></li>
            <li><Link href="/#pricing" className="hover:text-primary transition-colors">{t('common.pricing')}</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">{t('common.faq')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">{t('footer.company')}</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">{t('footer.blog')}</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">{t('footer.careers')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">{t('footer.support')}</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/help" className="hover:text-primary transition-colors">{t('footer.help')}</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopWave. {t('footer.rights')}
      </div>
    </footer>
  )
}
