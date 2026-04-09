"use client"

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  MessageCircle,
  BarChart3,
  Layers
} from "lucide-react"

export default function LandingPage() {
  const { t, language } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-3xl opacity-50" />
          
          <div className="max-w-7xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t('landing.heroBadge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 animate-slide-in">
              {t('landing.heroTitle')}
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 animate-fade-in delay-100 px-4">
              {t('landing.heroSubtitle')}
            </p>
            
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in delay-200 px-4 sm:px-0">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="premium" size="lg" className="w-full h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg shadow-2xl">
                  {t('landing.heroCTA')} <ArrowRight size={18} className="ml-2 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 sm:h-14 px-8 sm:px-10">
                  {t('landing.heroDemo')}
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 sm:mt-20 relative animate-scale-in delay-300">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 scale-105 blur-xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt={t('common.dashboard')}
                className="rounded-3xl border shadow-2xl mx-auto max-w-5xl w-full"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('landing.featuresTitle')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t('landing.featuresSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Store className="text-violet-600" size={28} />}
                title={language === 'en' ? "Multi-vendor Support" : "Support Multi-vendeurs"}
                description={language === 'en' ? "Easily toggle between being a customer and a vendor." : "Basculez facilement entre le mode client et vendeur."}
              />
              <FeatureCard 
                icon={<MessageCircle className="text-green-500" size={28} />}
                title={language === 'en' ? "WhatsApp Integration" : "Intégration WhatsApp"}
                description={language === 'en' ? "Convert more sales with direct-to-WhatsApp redirects." : "Convertissez plus de ventes avec des redirections WhatsApp."}
              />
              <FeatureCard 
                icon={<BarChart3 className="text-blue-500" size={28} />}
                title={language === 'en' ? "Advanced Analytics" : "Analyses Avancées"}
                description={language === 'en' ? "Monitor your performance with real-time data." : "Suivez vos performances avec des données en temps réel."}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto gradient-hero rounded-3xl sm:rounded-[40px] p-8 sm:p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 relative z-10">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 sm:mb-12 max-w-2xl mx-auto relative z-10">
              {t('landing.ctaSubtitle')}
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center relative z-10">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-white text-violet-900 hover:bg-white/90 h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg">
                  {t('landing.ctaButton')}
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/10 h-12 sm:h-14 text-base sm:text-lg">
                  {t('landing.ctaSales')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
      <CardContent className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
