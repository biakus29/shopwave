"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
  role: "vendor" | "customer";
}) {
  const supabase = createClient();

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        role: formData.role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // 2. Create profile record
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: formData.email,
      full_name: formData.fullName,
      role: formData.role,
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  revalidatePath("/", "layout");

  // 3. Redirect based on role
  if (formData.role === "vendor") {
    redirect("/dashboard");
  } else {
    redirect("/store");
  }
}

export async function signIn(formData: { email: string; password: string }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch profile role to redirect correctly
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  revalidatePath("/", "layout");

  if (profile?.role === "vendor") {
    redirect("/dashboard");
  } else {
    redirect("/store");
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
