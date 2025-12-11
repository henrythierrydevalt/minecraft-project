export default function ProfileContent({ user, posts }: { user: any; posts: any[] }) {
  if (!user) {
    return (
      <div className="minecraft-card p-4 md:p-6">
        <p className="text-[#888]">Carregando perfil...</p>
      </div>
    );
  }

  const safePosts = posts || [];
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="minecraft-card p-4 md:p-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#e0e0e0] mb-4 md:mb-6">Meu Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#7cb342] mb-3 md:mb-4">Informações</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#888] text-xs md:text-sm">Nome de Usuário</p>
                <p className="text-[#e0e0e0] font-bold text-base md:text-lg break-words">{user.username}</p>
              </div>
              <div>
                <p className="text-[#888] text-xs md:text-sm">Email</p>
                <p className="text-[#e0e0e0] font-bold text-base md:text-lg break-words">{user.email}</p>
              </div>
              <div>
                <p className="text-[#888] text-xs md:text-sm">Nível</p>
                <p className="text-[#e0e0e0] font-bold text-base md:text-lg">{user.level || 0}</p>
              </div>
              <div>
                <p className="text-[#888] text-xs md:text-sm">Experiência</p>
                <p className="text-[#e0e0e0] font-bold text-base md:text-lg">{user.experience || 0} XP</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#7cb342] mb-3 md:mb-4">Estatísticas</h2>
            <div className="space-y-3">
              <div className="minecraft-block p-3 md:p-4">
                <p className="text-[#888] text-xs md:text-sm">Posts Criados</p>
                <p className="text-[#e0e0e0] font-bold text-xl md:text-2xl">{safePosts.length}</p>
              </div>
              <div className="minecraft-block p-3 md:p-4">
                <p className="text-[#888] text-xs md:text-sm">Total de Curtidas</p>
                <p className="text-[#e0e0e0] font-bold text-xl md:text-2xl">
                  {safePosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}
                </p>
              </div>
              <div className="minecraft-block p-3 md:p-4">
                <p className="text-[#888] text-xs md:text-sm">Total de Visualizações</p>
                <p className="text-[#e0e0e0] font-bold text-xl md:text-2xl">
                  {safePosts.reduce((sum, post) => sum + (post.views || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="minecraft-card p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#e0e0e0] mb-4">Meus Posts</h2>
        {safePosts.length === 0 ? (
          <p className="text-[#888] text-sm md:text-base">Você ainda não criou nenhum post.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {safePosts.map((post) => (
              <div key={post.id} className="minecraft-block p-3 md:p-4">
                <h3 className="text-[#e0e0e0] font-bold text-base md:text-lg mb-2 line-clamp-2 break-words">{post.title}</h3>
                <p className="text-[#7cb342] text-xs md:text-sm mb-2">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex gap-3 md:gap-4 text-xs md:text-sm">
                  <span className="text-[#888]">👁️ {post.views || 0}</span>
                  <span className="text-[#888]">❤️ {post.likes?.length || 0}</span>
                  <span className="text-[#888]">💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

