import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../../context/PostContext";
import PostCard from "../../components/common/PostCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Camera, Edit2, MapPin, Calendar, Check } from "lucide-react";
import api, { handleError } from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const { posts: globalPosts, fetchUserPosts } = usePosts();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setLoading(true);
        const [userRes, postsData] = await Promise.all([
          api.get(`/users/${id}`),
          fetchUserPosts(id),
        ]);
        setUser(userRes.data.data);
        setUserPosts(postsData);
        setEditData({
          name: userRes.data.data.name,
          bio: userRes.data.data.bio || "",
        });
      } catch (err) {
        toast.error(handleError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPosts();
  }, [id, fetchUserPosts]);

  // Sync with global posts updates (like likes/comments added via PostCard)
  useEffect(() => {
    if (globalPosts.length > 0) {
      setUserPosts((prev) =>
        prev.map((up) => {
          const updatedGlobal = globalPosts.find((gp) => gp.id === up.id);
          return updatedGlobal ? updatedGlobal : up;
        }),
      );
    }
  }, [globalPosts]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio", editData.bio);
      if (selectedImage) {
        formData.append("profile_pic", selectedImage);
      }
      const response = await updateProfile(formData);
      setUser(response); // AuthContext returns data.user directly now after my previous fix
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditing(true); // Automatically enter edit mode when image is selected
    }
  };

  const isOwnProfile = currentUser?.id === id;

  if (loading)
    return (
      <div className="text-center py-20 animate-pulse text-slate-400">
        Loading profile...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/50">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative">
          {isOwnProfile && (
            <button className="absolute bottom-4 right-4 p-2 bg-white/50 hover:bg-white text-slate-700 rounded-xl transition-all">
              <Camera size={20} />
            </button>
          )}
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-lg shrink-0">
              <div className="h-full w-full rounded-2xl bg-slate-100 overflow-hidden relative group">
                {previewUrl || user?.profile_pic?.url ? (
                  <img
                    src={previewUrl || user.profile_pic.url}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                )}

                {isOwnProfile && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {user?.name}
                  </h1>
                  <p className="text-slate-500 font-medium">
                    @{user?.email?.split("@")[0]}
                  </p>
                </div>
                {isOwnProfile && !isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Bio
                    </label>
                    <textarea
                      className="flex min-h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isUpdating}
                      className="flex-1"
                    >
                      <Check size={16} className="mr-2" /> Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-slate-700 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                    {user?.bio || "No bio yet."}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <MapPin size={16} />
                      <span>Remote, Earth</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Calendar size={16} />
                      <span>
                        Joined{" "}
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Posts
              </h2>
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-slate-100">
                    <p className="text-slate-400">No posts shared yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
