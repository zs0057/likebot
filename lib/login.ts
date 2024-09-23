import { supabase } from "./supabase";

// 로그인 함수 정의
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed:", error.message);
    return { user: null, error };
  }

  console.log("Login successful:", data.user);
  return { user: data.user, error: null };
}
