import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/sanity/lib/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the first post
    const post = await client.fetch(`*[_type == "post"][0]`);

    // Extract current number from title if it exists
    const currentNumber = post.title?.match(/\d+/)?.[0];

    // Generate random number that's different from current
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * 1000);
    } while (currentNumber && randomNumber === parseInt(currentNumber));

    // Update the post title
    await client
      .patch(post._id)
      .set({ title: `Post ${randomNumber}` })
      .commit({
        token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
      });

    return res.status(200).json({ message: 'Title updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating post title', error });
  }
}
