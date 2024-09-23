import { supabase } from "./supabase";

// Feed 테이블의 타입 정의
type Feed = {
  id: string;
  user_id: string;
  created_at: string;
  review: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  image_path: string;
  visibility: boolean;
  calorie: number;
};

type Payload = {
  new: Feed;
};

// 구독 설정 함수
export const subscribeToFeedInserts = (onInsert: (newFeed: Feed) => void) => {
  const subscription = supabase
    .channel("feed")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "feed" },
      (payload: Payload) => {
        onInsert(payload.new); // 새 피드가 삽입될 때 콜백 함수 호출
      }
    )
    .subscribe();

  // 구독을 해제하는 함수 반환
  return () => {
    supabase.removeChannel(subscription);
  };
};
