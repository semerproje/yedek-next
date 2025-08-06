"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Heart, Reply, Flag, MoreHorizontal, Send, Filter } from "lucide-react";
import { AvatarImage } from '@/components/ui/SafeImage';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

interface NewsCommentsProps {
  newsId: string;
}

export default function NewsComments({ newsId }: NewsCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockComments: Comment[] = [
        {
          id: "c1",
          author: {
            name: "Mehmet Demir",
            avatar: "https://ui-avatars.com/api/?name=AH&background=06b6d4&color=ffffff&size=150"
          },
          content: "Çok önemli bir gelişme. TCMB'nin alacağı karar ekonomi için kritik önemde.",
          timestamp: "2 saat önce",
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: "c1r1",
              author: {
                name: "Ayşe Kaya",
                avatar: "https://ui-avatars.com/api/?name=AK&background=3b82f6&color=ffffff&size=150"
              },
              content: "Kesinlikle katılıyorum. Özellikle enflasyon hedefleri açısından dikkatli olmak gerek.",
              timestamp: "1 saat önce",
              likes: 5,
              isLiked: true,
              replies: []
            }
          ]
        },
        {
          id: "c2",
          author: {
            name: "Fatma Özkan",
            avatar: "https://ui-avatars.com/api/?name=FD&background=8b5cf6&color=ffffff&size=150"
          },
          content: "Umarım doğru karar alınır. Vatandaş olarak bizim de beklentilerimiz var.",
          timestamp: "3 saat önce",
          likes: 8,
          isLiked: false,
          replies: []
        },
        {
          id: "c3",
          author: {
            name: "Ali Yıldız",
            avatar: "https://ui-avatars.com/api/?name=MK&background=f59e0b&color=ffffff&size=150"
          },
          content: "Ekonomi uzmanlarının görüşleri de çok değerli. Detaylı analiz için teşekkürler.",
          timestamp: "4 saat önce",
          likes: 15,
          isLiked: false,
          replies: []
        }
      ];
      setComments(mockComments);
      setLoading(false);
    }, 800);
  }, [newsId]);

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return {
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
            : reply
        )
      };
    }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: {
        name: "Sen", // Replace with actual user
        avatar: "https://ui-avatars.com/api/?name=SN&background=ef4444&color=ffffff&size=150"
      },
      content: newComment,
      timestamp: "şimdi",
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `r${Date.now()}`,
      author: {
        name: "Sen",
        avatar: "https://ui-avatars.com/api/?name=SN&background=10b981&color=ffffff&size=150"
      },
      content: replyText,
      timestamp: "şimdi",
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    
    setReplyText("");
    setReplyingTo(null);
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes;
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case "newest":
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Yorumlar ({comments.length})
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="popular">En Popüler</option>
            </select>
          </div>
        </div>

        {/* New Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              Yorum Yap
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="p-6 space-y-6">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            
            {/* Main Comment */}
            <div className="flex gap-3">
              <AvatarImage
                src={comment.author.avatar}
                alt={comment.author.name}
                size={40}
              />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
                
                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      comment.isLiked 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                  >
                    <Heart size={14} className={comment.isLiked ? "fill-current" : ""} />
                    {comment.likes}
                  </button>
                  
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Reply size={14} />
                    Yanıtla
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <Flag size={14} />
                    Şikayet Et
                  </button>
                  
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      rows={2}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                      >
                        Yanıtla
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-3 py-1 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <AvatarImage
                      src={reply.author.avatar}
                      alt={reply.author.name}
                      size={32}
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {reply.author.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {reply.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {reply.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <button
                          onClick={() => handleLike(reply.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            reply.isLiked 
                              ? "text-red-600 dark:text-red-400" 
                              : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          }`}
                        >
                          <Heart size={12} className={reply.isLiked ? "fill-current" : ""} />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Henüz yorum yapılmamış. İlk yorumu siz yapın!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
