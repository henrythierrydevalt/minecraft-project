import { Suspense } from 'react';
import FeedContent from '@/components/FeedContent';
import FeedFilters from '@/components/FeedFilters';
import { FaNewspaper } from 'react-icons/fa';

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const category = params.category || '';
  const search = params.search || '';

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] flex items-center gap-2">
          <FaNewspaper className="text-lg md:text-xl lg:text-2xl" />
          <span className="hidden sm:inline">Feed da Comunidade</span>
          <span className="sm:hidden">Feed</span>
        </h1>
      </div>

      <FeedFilters category={category} search={search} />

      <Suspense fallback={<div className="text-[#e0e0e0] text-center py-8">Carregando feed...</div>}>
        <FeedContent page={page} category={category} search={search} />
      </Suspense>
    </div>
  );
}
