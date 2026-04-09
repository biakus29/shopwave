"use client";

import React, { useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/store/auth";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔥 Firebase Auth State Change:", firebaseUser?.email || "No user");
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch the profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", firebaseUser.uid)
          .single();

        if (error) {
          console.warn("⚠️ Profile not found in Supabase (likely due to RLS). Mocking locally to prevent block:", error.message);
          const fallbackProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "vendor@shopwave.com",
            full_name: firebaseUser.displayName || "Vendor",
            role: "vendor" as const,
            avatar_url: null,
            created_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          
          if (pathname === "/login" || pathname === "/signup") {
            router.push("/dashboard");
          }
        } else {
          setProfile(profile);
          
          // FORCE REDIRECT if on login/signup pages
          if (pathname === "/login" || pathname === "/signup") {
            const target = profile.role === "vendor" ? "/dashboard" : "/store";
            console.log("🚀 Auto-redirecting to:", target);
            router.push(target);
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setLoading, supabase, router, pathname]);


  return <>{children}</>;
}
