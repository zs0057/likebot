import { serve } from 'https://deno.land/x/sift@0.3.6/mod.ts';

// Supabase 클라이언트 라이브러리 불러오기
import { createClient } from 'https://deno.land/x/supabase@1.0.0/mod.ts';

// Supabase 연결 설정
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';  // SERVICE_ROLE_KEY 사용
const supabase = createClient(supabaseUrl, supabaseKey);

// Edge Function Serve
serve(async (req) => {
  try {
    const { feedId } = await req.json();  // 요청에서 feedId 받음

    // 고정된 userId 설정
    const userId = 'e37ac10b-58cc-4372-c567-0e02b2c3d481';  // 고정된 UUID

    // reactions 테이블에 데이터 삽입
    const { error } = await supabase
      .from('reactions')
      .insert([
        {
          user_id: userId,
          feed_id: feedId,
          type: 'good',
        }
      ]);

    // 오류 처리
    if (error) {
      console.error('Error inserting reaction:', error);
      return new Response(JSON.stringify({ message: 'Error inserting reaction', error }), { status: 500 });
    }

    // 성공 응답
    return new Response(JSON.stringify({ message: 'Reaction inserted successfully' }), { status: 200 });

  } catch (err) {
    // 예외 처리
    console.error('Error processing request:', err);
    return new Response(JSON.stringify({ message: 'Error processing request', error: err.message }), { status: 500 });
  }
});
