import { getServers, getUser } from '@/lib/server-api';
import { redirect } from 'next/navigation';
import ServerCard from './ServerCard';
import AddServerButton from './AddServerButton';

export default async function ServersList() {
  const serversData = await getServers();
  const user = await getUser();
  
  // Garantir que servers é sempre um array
  const servers = Array.isArray(serversData) ? serversData : [];

  return (
    <>
      <div className="flex justify-end mb-4">
        {user && <AddServerButton />}
      </div>

      {servers.length === 0 ? (
        <div className="minecraft-card p-6 md:p-8 text-center">
          <p className="text-[#e0e0e0] text-lg md:text-xl mb-4">Nenhum servidor cadastrado!</p>
          {user && <AddServerButton />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {servers.map((server: any) => {
            if (!server || !server.id) return null;
            return <ServerCard key={server.id} server={server} />;
          })}
        </div>
      )}
    </>
  );
}

