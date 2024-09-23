import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    const users = [
      { email: "randomuser8@example.com", password: "password8" },
      { email: "randomuser1@example.com", password: "password1" },
      { email: "randomuser2@example.com", password: "password2" },
      { email: "randomuser3@example.com", password: "password3" },
      { email: "randomuser4@example.com", password: "password4" },
      { email: "randomuser5@example.com", password: "password5" },
      { email: "randomuser6@example.com", password: "password6" },
      { email: "randomuser7@example.com", password: "password7" },
    ];

    const { data: adminData, error: adminError } =
      await supabase.auth.signInWithPassword({
        email: "udaadaa@naver.com",
        password: "udaa1234",
      });

    if (adminError || !adminData.user) {
      return new Response(
        JSON.stringify({ message: "Failed to authenticate admin user" }),
        { status: 401 }
      );
    }

    const fiveHoursAgo = new Date();
    fiveHoursAgo.setUTCHours(fiveHoursAgo.getUTCHours() - 5);

    const { data: feeds, error: feedError } = await supabase
      .from("feed")
      .select("id, calorie") // calorie 포함
      .gte("created_at", fiveHoursAgo.toISOString());

    console.log(fiveHoursAgo.toISOString());

    if (feedError) {
      return new Response(
        JSON.stringify({
          message: "Failed to fetch feeds",
          error: feedError.message,
        }),
        { status: 500 }
      );
    }

    const reactionAddedMap: { [feedId: string]: boolean } = {};

    for (const user of users) {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        });

      if (authError || !authData.user) {
        console.error(`Failed to authenticate user: ${user.email}`);
        continue;
      }

      const currentUser = authData.user;

      for (const feed of feeds || []) {
        const feedId = feed.id;
        const calorie = feed.calorie;

        if (reactionAddedMap[feedId]) {
          continue;
        }

        const { data: existingReaction, error: reactionError } = await supabase
          .from("reactions")
          .select("id")
          .eq("user_id", currentUser.id)
          .eq("feed_id", feedId)
          .maybeSingle();

        if (reactionError) {
          return new Response(
            JSON.stringify({
              message: "Failed to check reactions",
              error: reactionError.message,
            }),
            { status: 500 }
          );
        }

        if (!existingReaction) {
          let reactionType = "good";
          const rand = Math.random();

          if (calorie > 1000) {
            // 칼로리가 1000 이상일 때
            if (rand < 0.4) reactionType = "hmmm"; // 40% 확률로 hmmm
            else if (rand < 0.6) reactionType = "good"; // 20% 확률로 good
            else if (rand < 0.8) reactionType = "cheerup"; // 20% 확률로 cheerup
            else reactionType = "awesome"; // 20% 확률로 awesome
          } else {
            // 칼로리가 1000 이하일 때
            if (rand < 0.25) reactionType = "good"; // 25% 확률로 good
            else if (rand < 0.75)
              reactionType = "cheerup"; // 50% 확률로 cheerup
            else reactionType = "awesome"; // 25% 확률로 awesome
          }

          const { error: insertError } = await supabase
            .from("reactions")
            .insert([
              {
                user_id: currentUser.id,
                feed_id: feedId,
                type: reactionType,
              },
            ]);

          if (insertError) {
            return new Response(
              JSON.stringify({
                message: "Failed to insert reaction",
                error: insertError.message,
              }),
              { status: 500 }
            );
          }

          reactionAddedMap[feedId] = true;
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Reactions processing complete!" }),
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding reactions:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to add reactions",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
