import localFont from 'next/font/local';
import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

type Post = {
  _id: string;
  title: string;
  // Add other fields you have in your Sanity schema
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "post"]`; // Modify this query based on your schema
      const result = await client.fetch(query);
      setPosts(result);
    };

    fetchPosts();
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="p-4 border rounded">
                <h3 className="font-bold">{post.title}</h3>
                {/* Add other post fields you want to display */}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "post"]`;
  const posts = await client.fetch(query);

  return {
    props: {
      posts,
    },
    revalidate: 1800, // 30 minutes in seconds
  };
}
