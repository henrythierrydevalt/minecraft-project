'use client';

import { useState, useEffect } from 'react';
import { toggleLike, createComment } from '@/lib/actions';
import { commentsService } from '@/lib/comments';
import { Comment } from '@/lib/comments';
import { authService } from '@/lib/auth';
import { FaHeart, FaComment, FaEye, FaTag } from 'react-icons/fa';

export default function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
    checkLiked();
  }, [post.id]);

  const loadComments = async () => {
    try {
      const data = await commentsService.getByPost(post.id);
      setComments(data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const checkLiked = async () => {
    try {
      const token = authService.getToken();
      if (!token) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/likes/post/${post.id}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked || false);
      }
    } catch (error) {
      console.error('Erro ao verificar like:', error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const result = await toggleLike(post.id);
      setLiked(result.liked);
      setLikesCount((prev: number) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment(post.id, newComment);
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  return (
    <div className="minecraft-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-[#e0e0e0] mb-2 line-clamp-2 break-words">{post.title}</h2>
          <p className="text-[#7cb342] text-xs md:text-sm break-words">
            Por <span className="font-bold">{post.author.username}</span> •{' '}
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </p>
          <span className="inline-block mt-2 px-2 md:px-3 py-1 bg-[#7cb342] text-white text-xs rounded border border-black">
            {post.category}
          </span>
        </div>
        <div className="text-[#888] text-xs md:text-sm flex items-center gap-1 sm:ml-2">
          <FaEye className="text-xs" />
          {post.views}
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag: any) => (
            <span
              key={tag.id || tag}
              className="inline-flex items-center gap-1 bg-[#1a1a1a] text-[#7cb342] px-2 py-1 rounded border border-black text-xs"
            >
              <FaTag />
              #{typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>
      )}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-32 md:h-48 object-cover rounded-lg mb-4 border-2 border-black"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      <p className="text-[#c0c0c0] mb-4 whitespace-pre-wrap line-clamp-4 flex-1 text-sm md:text-base break-words">{post.content}</p>

      <div className="flex gap-2 items-center mb-4 mt-auto">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg border-2 border-black text-sm ${
            liked
              ? 'bg-red-600 text-white'
              : 'bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a]'
          }`}
        >
          <FaHeart className="text-xs md:text-sm" />
          <span className="text-xs md:text-sm">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a] border-2 border-black text-sm"
        >
          <FaComment className="text-xs md:text-sm" />
          <span className="text-xs md:text-sm">{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4 border-t-2 border-black pt-4">
          <form onSubmit={handleComment} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="minecraft-input flex-1 px-3 md:px-4 py-2 rounded-lg text-sm"
            />
            <button
              type="submit"
              className="minecraft-button px-4 py-2 text-white font-bold rounded-lg text-sm whitespace-nowrap"
            >
              Comentar
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {comments.slice(0, 1).map((comment) => (
              <div key={comment.id} className="bg-[#1a1a1a] p-3 rounded border border-black">
                <p className="text-[#7cb342] text-sm font-bold mb-1">{comment.author.username}</p>
                <p className="text-[#c0c0c0] text-sm break-words">{comment.content}</p>
              </div>
            ))}
            {comments.length > 1 && (
              <p className="text-[#888] text-xs text-center">+{comments.length - 1} comentário(s) oculto(s)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

