"use client";
import { useEffect, useState } from "react";
import { autoLogin } from "../lib/autoLogin"; // 자동 로그인 함수 불러오기
import { subscribeToFeedInserts } from "../lib/supabaseSubscription"; // 구독 모듈 불러오기
import { createUser } from "@/lib/createUser";
import { addReaction } from "@/lib/reation";

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

const FeedPage = () => {
  const [feedItems, setFeedItems] = useState<Feed[]>([]);

  useEffect(() => {
    let isSubscribed = true; // 구독 상태를 관리

    // 자동 로그인 후 피드 구독 설정
    const loginAndSubscribe = async () => {
      await createUser("soss0527@naver.com", "asdf9293");
      const user = await autoLogin(); // 자동 로그인 함수 호출

      if (user) {
        // 로그인된 후 구독 설정
        const unsubscribe = subscribeToFeedInserts((newFeed: Feed) => {
          if (isSubscribed) {
            setFeedItems((prevItems) => [...prevItems, newFeed]); // 새로운 피드를 추가
            // 새로운 Feed가 추가되면 해당 Feed의 id로 "good" 리액션을 추가
            addReaction(user.id, newFeed.id, "good");
            console.log("userid:", user.id);
          }
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
          isSubscribed = false; // 구독 해제
          unsubscribe();
        };
      } else {
        console.error("로그인 실패로 인해 구독을 설정할 수 없습니다.");
      }
    };

    loginAndSubscribe();

    // 의존성 배열 추가 (빈 배열이므로 컴포넌트가 처음 마운트될 때만 실행됨)
  }, []);

  return (
    <div>
      <h1>Feed Page</h1>
      <ul>
        {feedItems.map((feed) => (
          <li key={feed.id}>
            <strong>{feed.id}</strong>: {feed.review} (칼로리: {feed.calorie})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedPage;
