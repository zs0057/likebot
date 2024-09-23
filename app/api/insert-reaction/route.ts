import { supabase } from '@/lib/supabase'; // supabase 클라이언트 파일 경로에 맞게 수정

export async function POST() {
  try {
    // 1. 사용자 배열 생성 (randomuser8 포함)
    const users = [
      { email: 'randomuser8@example.com', password: 'password8' }, // randomuser8으로 변경
      { email: 'randomuser1@example.com', password: 'password1' },
      { email: 'randomuser2@example.com', password: 'password2' },
      { email: 'randomuser3@example.com', password: 'password3' },
      { email: 'randomuser4@example.com', password: 'password4' },
      { email: 'randomuser5@example.com', password: 'password5' },
      { email: 'randomuser6@example.com', password: 'password6' },
      { email: 'randomuser7@example.com', password: 'password7' },
    ];

    // 2. soss0527@naver.com으로 로그인하여 피드를 먼저 가져옴
    const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
      email: 'udaadaa@naver.com',
      password: 'udaa1234',
    });

    if (adminError || !adminData.user) {
      return new Response(JSON.stringify({ message: 'Failed to authenticate admin user' }), { status: 401 });
    }

    // 3. feed 테이블에서 모든 feed_id 가져오기 (admin 로그인 세션 사용)
    const { data: feeds, error: feedError } = await supabase
      .from('feed')
      .select('id');

    if (feedError) {
      return new Response(JSON.stringify({ message: 'Failed to fetch feeds', error: feedError.message }), { status: 500 });
    }

    // 피드별로 리액션이 추가되었는지 체크하는 맵 (feed_id: boolean)
    const reactionAddedMap: { [feedId: string]: boolean } = {};

    // 4. 사용자별로 로그인한 후 피드에 리액션 삽입 여부 확인
    for (const user of users) {
      // 사용자 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (authError || !authData.user) {
        console.error(`Failed to authenticate user: ${user.email}`);
        continue; // 다음 사용자로 넘어가기
      }

      const currentUser = authData.user;

      // 5. 피드마다 삽입 여부를 확인 후, 삽입이 안된 피드에만 삽입
      for (const feed of feeds || []) {
        const feedId = feed.id;

        // 이미 삽입된 피드는 건너뜀
        if (reactionAddedMap[feedId]) {
          continue;
        }

        // reactions 테이블에서 user_id와 feed_id가 있는지 확인
        const { data: existingReaction, error: reactionError } = await supabase
          .from('reactions')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('feed_id', feedId)
          .maybeSingle();

        if (reactionError) {
          return new Response(JSON.stringify({ message: 'Failed to check reactions', error: reactionError.message }), { status: 500 });
        }

        // 해당 user_id와 feed_id가 없으면 reaction 삽입
        if (!existingReaction) {
          const { error: insertError } = await supabase
            .from('reactions')
            .insert([
              {
                user_id: currentUser.id,
                feed_id: feedId,
                type: 'good', // ReactionType은 'good'으로 고정
              },
            ]);

          if (insertError) {
            return new Response(JSON.stringify({ message: 'Failed to insert reaction', error: insertError.message }), { status: 500 });
          }

          // 삽입 성공 시, 해당 피드에 대한 리액션이 완료된 것으로 처리
          reactionAddedMap[feedId] = true;
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Reactions processing complete!' }), { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error adding reactions:', error);
    return new Response(JSON.stringify({ message: 'Failed to add reactions', error: error.message }), { status: 500 });
  }
}
