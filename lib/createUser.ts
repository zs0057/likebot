import { supabase } from "./supabase";

export async function createUser(email: string, password: string) {


  // 사용자 생성
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // 이미 존재하는 사용자일 경우 에러 메시지를 무시하고 넘어감
    if (error.message.includes("User already registered")) {
      console.log("이미 존재하는 사용자입니다.");
      return;
    }

    // 다른 에러가 있을 경우만 출력
    console.error("사용자 생성 실패:", error.message);
    return;
  }

  console.log("사용자 생성 성공:", data);
}
