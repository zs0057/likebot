// lib/reaction.ts

export async function addReaction(userId: string, feedId: string, reactionType: "good" | "cheerup" | "hmmm" | "nope" | "awesome") {
    try {
      console.log(userId, feedId);
      const response
       = await fetch('/api/insert-reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          feedId,
          reactionType,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to insert reaction');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }
  