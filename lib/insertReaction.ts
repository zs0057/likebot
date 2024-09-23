import { supabase } from "./supabase";

// 리액션을 삽입하는 함수
export const insertReaction = async (
  userId: string,
  feedId: string,
  reactionType: "good" | "cheerup" | "hmmm" | "nope" | "awesome"
) => {
  try {
    const { error } = await supabase
      .from("reactions") // reactions 테이블에 데이터 삽입
      .insert([
        {
          user_id: userId, // 사용자 ID
          feed_id: feedId, // Feed ID
          type: reactionType, // 리액션 타입
        },
      ]);

    if (error) {
      console.error("리액션 추가 중 오류 발생:", error);
    } else {
      console.log("리액션 추가 성공:");
    }
  } catch (error) {
    console.error("리액션 삽입 중 예외 발생:", error);
  }
};
