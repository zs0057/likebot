import { supabase } from "./supabase";

// 자동으로 로그인하는 함수
export const autoLogin = async () => {
  const email = "soss0527@naver.com"; // 고정된 이메일
  const password = "asdf9293"; // 고정된 비밀번호

  // 로그인 요청
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("자동 로그인 실패:", error.message);
    return null;
  }

  console.log("자동 로그인 성공:", data.user);
  return data.user;
};
