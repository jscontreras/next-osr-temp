import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import localFont from 'next/font/local';
const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
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

export default function Page(props: Readonly<{ posts: Post[], path:string[] }>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Posts Content: {`${props.path.join('/')}`}</h2>
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

export const getStaticPaths: GetStaticPaths = async (context) => {
 // if (process.env.NODE_ENV !== 'development') {
    // Hardcoded paths for now
    const paths =
      context.locales
        ?.filter((locale) => locale !== 'default')
        .flatMap((locale) => {
          return ['/', '/blog-1', '/blog-2'].map((route) => ({
            params: {
              path: route === '/' ? [] : [route.slice(1)],
            },
            locale,
          }));
        }) || [];

    return {
      paths,
      fallback: 'blocking', // Set to 'blocking' if you want to generate new paths on demand
    };
};

export const getStaticProps: GetStaticProps<
  { posts: Post[]; path: string[] },
  IParams
> = async ({ params }) => {
  const path = params?.path || [];
  const rnd = Math.trunc(Math.random() * 100);
  const posts: Post[] = [{ title: `${rnd}`, _id: `${rnd}` }]

  return {
    props: {
      posts,
      path,
    },
    revalidate: 1800, // 30 minutes in seconds
  };
};
