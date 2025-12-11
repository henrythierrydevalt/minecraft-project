import { redirect } from 'next/navigation';
import { getUser, getPostsByUser } from '@/lib/server-api';
import ProfileContent from '@/components/ProfileContent';

export default async function ProfilePage() {
  try {
    const user = await getUser();
    
    if (!user) {
      redirect('/login');
    }

    const posts = await getPostsByUser(user.id) || [];

    return <ProfileContent user={user} posts={posts} />;
  } catch (error) {
    console.error('Error loading profile:', error);
    redirect('/login');
  }
}
