import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import localFont from 'next/font/local';
import { client } from '@/sanity/lib/client';

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
  path?: string[];
  // Add other fields you have in your Sanity schema
};

interface IParams extends ParsedUrlQuery {
  path?: string[];
}

export default function Page(props: Readonly<{ posts: Post[] }>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <ul className="space-y-4">
            {props.posts.map((post) => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  // Hardcoded paths for now
  const paths = [
    { params: { path: [] } }, // "/"
    { params: { path: ['en'] } }, // "/en"
    { params: { path: ['en', 'blog-1'] } }, // "/en/blog-1"
    { params: { path: ['blog-1'] } }, // "/blog-1"
  ];

  return {
    paths,
    fallback: false, // Set to 'blocking' if you want to generate new paths on demand
  };
};

export const getStaticProps: GetStaticProps<
  { posts: Post[]; path: string[] },
  IParams
> = async ({ params }) => {
  const path = params?.path || [];
  const query = `*[_type == "post"]`;
  const posts = await client.fetch(query);

  return {
    props: {
      posts,
      path,
    },
    revalidate: 1800, // 30 minutes in seconds
  };
};
