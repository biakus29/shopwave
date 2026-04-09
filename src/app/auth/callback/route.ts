import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role") || "customer";
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get("next") ?? (role === "vendor" ? "/dashboard" : "/store");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Ensure profile has the correct role from the signup flow
      // This handles cases where the user is new and the trigger used a default
      await supabase
        .from("profiles")
        .update({ role })
        .eq("id", data.user.id)
        .is("role", null); // Only update if not already set or it's the first time
      
      // Specifically for the scenario where we want to FORCE the role from the button clicked
      await supabase
        .from("profiles")
        .update({ role })
        .eq("id", data.user.id);

      const forwardedHost = request.headers.get("x-forwarded-host"); // confirmed with supabase
      const isLocalEnv = process.env.NODE_ENVIRONMENT === "development";
      if (isLocalEnv) {
        // we can be sure that origin is localhost
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
