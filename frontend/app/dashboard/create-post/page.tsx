import { redirect } from 'next/navigation';
import { getUser } from '@/lib/server-api';
import CreatePostForm from '@/components/CreatePostForm';
import { FaEdit } from 'react-icons/fa';

export default async function CreatePostPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] mb-4 md:mb-6 flex items-center gap-2">
        <FaEdit className="text-lg md:text-xl lg:text-2xl" />
        <span>Criar Novo Post</span>
      </h1>
      <CreatePostForm />
    </div>
  );
}
