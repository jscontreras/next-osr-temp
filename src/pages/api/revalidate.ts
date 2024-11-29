import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check for secret to confirm this is a valid request
    if (req.body.secret !== process.env.REVALIDATION_TOKEN) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if URL is provided
    if (!req.body.url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Revalidate the path
    await res.revalidate(req.body.url);

    return res.json({
      revalidated: true,
      message: `Path ${req.body.url} revalidated successfully`,
    });
  } catch (err) {
    // If there was an error, Next.js will continue to show the last successfully generated page
    return res.status(500).send({
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
