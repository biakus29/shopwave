"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayoutClient from "./layout-client";
import { useAuthStore } from "@/store/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (profile?.role === "customer") {
        router.push("/store");
      }
    }
  }, [user, profile, loading, router]);

  // Optionally show a loading screen while evaluating auth state
  if (loading || !user || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DashboardLayoutClient
      user={{
        id: user.uid,
        email: user.email ?? "",
        full_name: profile.full_name ?? user.email ?? "User",
        role: profile.role ?? "vendor",
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
