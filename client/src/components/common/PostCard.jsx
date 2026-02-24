import React, { useState } from "react";
import { usePosts } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import { Heart, MessageCircle, Trash2, Send, Clock } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { toast } from "react-hot-toast";

const formatTime = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
};

const PostCard = ({ post }) => {
  const { toggleLike, addComment, deletePost } = usePosts();
  const { user, isAdmin } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const { fetchComments } = usePosts();

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await fetchComments(post.id);
        setComments(data);
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = () => toggleLike(post.id);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const resData = await addComment(post.id, commentText);
      setCommentText("");
      setComments((prev) => [resData.data.comment, ...prev]);
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        await deletePost(post.id);
        toast.success("Post deleted");
      } catch (err) {
        toast.error(err.message || "Failed to delete post");
        setIsDeleting(false);
      }
    }
  };

  const isOwner = user?.id === post.user?.id;
  const canDelete = isOwner || isAdmin;

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 mb-6 group transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-50">
            {post.user?.profile_pic?.url ? (
              <img
                src={post.user.profile_pic.url}
                alt={post.user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {post.user?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none">
              {post.user?.name}
            </h3>
            <span className="text-xs text-slate-500">
              {formatTime(post.createdAt)}
            </span>
          </div>
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {post.content && (
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {post.file?.url && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video">
            <img
              src={post.file.url}
              alt="Post content"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-4 flex items-center gap-6 border-t border-slate-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-semibold transition-colors ${post.isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"}`}
        >
          <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
          <span>{post.likesCount || 0}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-semibold transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.commentsCount || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 animate-fade-in">
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <Input
              placeholder="Write a comment..."
              className="flex-1 h-10 border-slate-200"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button type="submit" size="sm" className="h-10 px-4">
              <Send size={18} />
            </Button>
          </form>

          <div className="space-y-4">
            {loadingComments ? (
              <div className="text-center py-4 animate-pulse text-slate-400 text-sm">
                Loading comments...
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    {comment.user?.profile_pic?.url ? (
                      <img
                        src={comment.user.profile_pic.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                        {comment.user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        {comment.user?.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 italic">
                  No comments yet. Share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
