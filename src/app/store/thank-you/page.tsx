import Link from "next/link"
import { CheckCircle2, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoreNavbar } from "@/components/layout/store-navbar"
import { Footer } from "@/components/layout/footer"

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <StoreNavbar />
      
      <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150 animate-pulse" />
            <div className="relative w-32 h-32 rounded-[40px] bg-white shadow-2xl shadow-primary/20 flex items-center justify-center text-primary mx-auto animate-float">
               <CheckCircle2 size={64} strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6">Order Requested!</h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg mx-auto">
            Your order details have been sent to the vendor via WhatsApp. They will contact you shortly to confirm and discuss payment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button variant="premium" size="lg" className="rounded-2xl h-14 px-10 gap-2">
                Continue Shopping
                <ShoppingBag size={20} />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 gap-2 border-2 hover:bg-slate-900 hover:text-white transition-all">
              View Order Status
              <ArrowRight size={20} />
            </Button>
          </div>

          <div className="mt-16 p-8 bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-6 text-left">
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
               <MessageCircle size={32} />
            </div>
            <div>
              <p className="text-lg font-black">Waiting for response?</p>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Most vendors respond within 30 minutes during business hours. If you haven&apos;t heard back, you can follow up through the WhatsApp chat window already opened.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
