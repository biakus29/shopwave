import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./config";
import { createClient } from "@/lib/supabase/client";

const googleProvider = new GoogleAuthProvider();

export async function syncUserWithSupabase(user: User, role: "vendor" | "customer") {
  const supabase = createClient();
  console.log("🔄 Syncing user with Supabase...", { uid: user.uid, email: user.email, role });
  
  const { error } = await supabase.from("profiles").upsert({
    id: user.uid,
    email: user.email || `${user.phoneNumber}@phone.com`,
    full_name: user.displayName || "User",
    role: role,
  }, { onConflict: "id" });

  if (error) {
    console.error("❌ Error syncing user with Supabase:", error);
    throw error;
  }
  console.log("✅ Sync successful!");
}

export async function loginWithGoogle(role: "vendor" | "customer") {
  try {
    const supabase = createClient();
    console.log("🚀 Starting Google Login popup for role:", role);
    localStorage.setItem("pending_role", role);
    const result = await signInWithPopup(auth, googleProvider);
    
    // Automatically trigger sync immediately since popup returns the result.
    if (result.user) {
      await syncUserWithSupabase(result.user, role).catch(err => {
        console.warn("⚠️ Supabase Sync Error (RLS likely):", err);
      });

      // Synchronously create shop if pending
      const pendingShopStr = localStorage.getItem("pending_shop_info");
      if (pendingShopStr && role === "vendor") {
        try {
          const shopInfo = JSON.parse(pendingShopStr);
          const slug = shopInfo.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
          
          await supabase.from("shops").insert({
            vendor_id: result.user.uid,
            name: shopInfo.shopName,
            slug: slug,
            description: shopInfo.shopDescription,
            whatsapp_number: shopInfo.whatsappNumber,
            manager_name: shopInfo.managerName,
            personal_phone: shopInfo.personalPhone,
            sector: shopInfo.sector,
            address: shopInfo.shopAddress,
          });
        } catch (e) {
          console.error("Failed to parse or create pending shop:", e);
        }
        localStorage.removeItem("pending_shop_info");
      }
    }

    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("❌ Google Login Error:", error);
    return { error: error.message };
  }
}

/**
 * Call this function on page load (e.g., in a layout or root page)
 * To handle the result of a Google Redirect login.
 */
export async function handleRedirectResult() {
  try {
    console.log("🔍 Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("👤 User found from redirect:", result.user.email);
      const role = (localStorage.getItem("pending_role") as "vendor" | "customer") || "customer";
      await syncUserWithSupabase(result.user, role);
      localStorage.removeItem("pending_role");
      return { user: result.user, role };
    }
    console.log("ℹ️ No redirect result found (or already handled).");
    return { user: null };
  } catch (error: any) {
    console.error("❌ Redirect result error:", error);
    return { error: error.message };
  }
}

export function setupRecaptcha(containerId: string) {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }
}

export async function loginWithPhone(phoneNumber: string) {
  try {
    const appVerifier = (window as any).recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    (window as any).confirmationResult = confirmationResult;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function confirmOTP(otp: string) {
  try {
    const confirmationResult = (window as any).confirmationResult;
    const result = await confirmationResult.confirm(otp);
    await syncUserWithSupabase(result.user, "customer");
    return { user: result.user };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logout() {
  await firebaseSignOut(auth);
}
