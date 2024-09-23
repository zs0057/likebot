import { supabase } from "./supabase";

// Feed 테이블의 타입 정의
type Feed = {
  id: string; // uuid
  user_id: string; // uuid
  created_at: string; // timestampz를 ISO 문자열로 처리
  review: string; // text
  type: "breakfast" | "lunch" | "dinner" | "snack"; // FeedType enum
  image_path: string; // text
  visibility: boolean; // bool
  calorie: number; // int8
};

// Payload 타입 정의
type Payload = {
  new: Feed;
};

// 삽입된 데이터를 처리하는 함수
const handleInserts = (payload: Payload) => {
  console.log("새로운 피드가 추가되었습니다:", payload.new);
};

// Realtime 구독 설정
supabase
  .channel("feed")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "feed" },
    handleInserts
  )
  .subscribe();
