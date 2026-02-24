import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import api, { getAuthHeader, handleError } from "../../api/axiosInstance";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  Users,
  FileText,
  MessageCircle,
  User,
  Lock,
  Unlock,
  Trash2,
  CheckCircle,
  Camera,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { users, fetchUsers, blockUser, unblockUser, deleteAnyPost } =
    useAdmin();
  const { user: currentUser, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [adminPosts, setAdminPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState(null);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "posts" || activeTab === "comments") fetchAdminPosts();
    if (activeTab === "profile" && currentUser) {
      setEditData({ name: currentUser.name, bio: currentUser.bio || "" });
    }
  }, [activeTab, fetchUsers, currentUser]);

  const fetchAdminPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await api.get("/admin/posts", {
        headers: getAuthHeader(),
      });
      setAdminPosts(response.data.data.posts || []);
    } catch (err) {
      toast.error(handleError(err));
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
        toast.success(`User ${user.name} unblocked`);
      } else {
        await blockUser(user.id);
        toast.error(`User ${user.name} blocked`);
      }
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Delete this post permanently?")) {
      try {
        await deleteAnyPost(postId);
        setAdminPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success("Post removed by administrator");
      } catch (err) {
        toast.error(err.message || "Failed to delete post");
      }
    }
  };

  const handleFetchComments = async (postId) => {
    try {
      const response = await api.get(`/comments/${postId}/comments`);
      setSelectedPostComments({
        postId,
        comments: response.data.data.comments,
      });
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment permanently?")) {
      try {
        await api.delete(`/admin/comments/${commentId}`, {
          headers: getAuthHeader(),
        });
        if (selectedPostComments) {
          setSelectedPostComments({
            ...selectedPostComments,
            comments: selectedPostComments.comments.filter(
              (c) => c.id !== commentId,
            ),
          });
        }
        toast.success("Comment removed");
      } catch (err) {
        toast.error(handleError(err));
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio", editData.bio);
      if (selectedImage) {
        formData.append("profile_pic", selectedImage);
      }
      await updateProfile(formData);
      setSelectedImage(null);
      setPreviewUrl(null);
      toast.success("Admin profile updated");
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const tabs = [
    { id: "users", label: "User Moderation", icon: Users },
    { id: "posts", label: "Post Management", icon: FileText },
    { id: "comments", label: "Comment Management", icon: MessageCircle },
    { id: "profile", label: "Profile Settings", icon: User },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-500">Centralized control for ConnectSphere</p>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* User Moderation */}
        {activeTab === "users" && (
          <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/40">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 text-red-600 px-2.5 py-1 rounded-lg bg-red-50 text-xs font-bold">
                            <Lock size={12} /> BLOCKED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-green-600 px-2.5 py-1 rounded-lg bg-green-50 text-xs font-bold">
                            <CheckCircle size={12} /> ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={user.isBlocked ? "primary" : "danger"}
                          size="sm"
                          onClick={() => handleBlockToggle(user)}
                          className="h-8 py-0 rounded-lg text-xs"
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Post Management */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {loadingPosts ? (
              <div className="text-center py-20 text-slate-400 animate-pulse">
                Fetching posts...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminPosts.map((post) => (
                  <div
                    key={post.id}
                    className="glass rounded-2xl overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-all"
                  >
                    {post.file?.url && (
                      <img
                        src={post.file.url}
                        className="h-40 w-full object-cover"
                        alt="Post"
                      />
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-6 rounded-full bg-slate-200" />
                        <span className="text-sm font-semibold">
                          {post.user?.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-3 mb-4">
                        {post.content}
                      </p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="h-8 px-3"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comment Management */}
        {activeTab === "comments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <h3 className="font-bold text-slate-900 border-b pb-2">
                Select Post to Moderation Comments
              </h3>
              {adminPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleFetchComments(post.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedPostComments?.postId === post.id
                      ? "bg-primary/5 border-primary shadow-inner"
                      : "glass hover:bg-white/80 border-slate-100"
                  }`}
                >
                  <p className="text-sm font-medium line-clamp-2">
                    {post.content || "Empty content post"}
                  </p>
                  <span className="text-xs text-slate-400 mt-2 block">
                    By {post.user?.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-6 h-fit min-h-[400px]">
              {selectedPostComments ? (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900">
                    Comments for Post
                  </h3>
                  {selectedPostComments.comments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPostComments.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-sm flex justify-between items-start gap-4"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-primary">
                              {comment.user?.name}
                            </p>
                            <p className="text-sm text-slate-700">
                              {comment.text}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-20 text-slate-400">
                      No comments on this post.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <MessageCircle size={48} className="opacity-20" />
                  <p>Select a post from the left to manage its comments.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto glass rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <div className="h-32 w-32 rounded-3xl bg-slate-100 overflow-hidden ring-4 ring-primary/20 shadow-inner">
                  {previewUrl || currentUser?.profile_pic?.url ? (
                    <img
                      src={previewUrl || currentUser.profile_pic.url}
                      alt="Admin"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-primary/10 text-primary">
                      {currentUser?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2.5 bg-white shadow-lg rounded-xl text-primary hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {currentUser?.name}
              </h3>
              <p className="text-slate-500 font-medium">
                Administrator Profile
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input
                label="Public Full Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <div className="space-y-1.5 px-1">
                <label className="text-sm font-medium text-slate-700">
                  Administrative Bio
                </label>
                <textarea
                  className="flex min-h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-all"
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  placeholder="Tell us about your management role..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 rounded-2xl h-12 shadow-lg shadow-primary/20"
                  isLoading={isUpdatingProfile}
                >
                  <Check size={20} className="mr-2" /> Update Administrative
                  Profile
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
