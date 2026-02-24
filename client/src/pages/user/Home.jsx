import React, { useEffect, useState } from "react";
import { usePosts } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/common/PostCard";
import Button from "../../components/common/Button";
import { PlusCircle, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";

const Home = () => {
  const { posts, loading, fetchPosts, createPost } = usePosts();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      return toast.error("Post content cannot be empty");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image/video", image);

    try {
      await createPost(formData);
      setContent("");
      setImage(null);
      setImagePreview(null);
      toast.success("Post created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Feed Column */}
      <div className="space-y-6">
        {/* Create Post Card */}
        <div className="glass rounded-3xl shadow-lg border border-white/50 p-6">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-200 overflow-hidden shrink-0 mt-1">
                {user?.profile_pic?.url ? (
                  <img
                    src={user.profile_pic.url}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-slate-400"
                placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 text-slate-600 hover:text-primary cursor-pointer px-3 py-2 rounded-xl hover:bg-slate-100 transition-all font-medium">
                <ImageIcon size={20} />
                <span>Photo</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!content.trim() && !image}
                className="rounded-2xl"
              >
                <PlusCircle size={18} className="mr-2" />
                Post Now
              </Button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        {loading && posts.length === 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-slate-200">
                <p className="text-slate-500 font-medium">
                  No posts yet. Be the first to share something!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
