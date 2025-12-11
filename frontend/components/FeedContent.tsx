import { getPosts } from '@/lib/server-api';
import PostCard from './PostCard';

export default async function FeedContent({
  page,
  category,
  search,
}: {
  page: number;
  category: string;
  search?: string;
}) {
  const data = await getPosts(page, 10, category || undefined);
  let posts = data?.posts || [];

  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(
      (post: any) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.author.username.toLowerCase().includes(searchLower)
    );
  }

  return (
    <>
      {posts.length === 0 ? (
        <div className="minecraft-card p-6 md:p-8 text-center">
          <p className="text-[#e0e0e0] text-lg md:text-xl mb-4">Nenhum post encontrado!</p>
          <a
            href="/dashboard/create-post"
            className="minecraft-button inline-block text-white font-bold py-2 px-4 md:px-6 rounded-lg text-sm md:text-base"
          >
            Criar Primeiro Post
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
