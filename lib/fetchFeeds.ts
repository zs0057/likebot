// lib/fetchFeeds.ts

import { supabase } from "./supabase";

export async function fetchFeeds() {
  const { data: feeds, error } = await supabase
    .from("feed")
    .select(
      "id, user_id, created_at, review, type, image_path, visibility, calorie"
    );

  if (error) {
    console.error("Error fetching feeds:", error);
    return [];
  }

  // 데이터가 제대로 오는지 콘솔에 출력
  console.log(feeds);
  return feeds || [];
}
