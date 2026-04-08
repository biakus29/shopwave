import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardLayoutClient from "./layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Get authenticated user (secure - uses server-side session)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Fetch profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Only vendors can access the dashboard
  if (profile?.role === "customer") {
    redirect("/store")
  }

  return (
    <DashboardLayoutClient
      user={{
        id: user.id,
        email: user.email ?? "",
        full_name: profile?.full_name ?? user.email ?? "User",
        role: profile?.role ?? "vendor",
      }}
    >
      {children}
    </DashboardLayoutClient>
  )
}
