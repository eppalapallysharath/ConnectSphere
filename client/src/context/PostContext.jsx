import React, { createContext, useContext, useState, useCallback } from "react";
import api, { getAuthHeader, handleError } from "../api/axiosInstance";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/posts?page=${page}`);
      const postsData = response.data.data.posts;
      const metaData = response.data.meta;

      if (page === 1) {
        setPosts(postsData);
      } else {
        setPosts((prev) => [...prev, ...postsData]);
      }
      setPagination({ page: metaData.page, totalPages: metaData.totalPages });
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (formData) => {
    try {
      const response = await api.post("/posts/createPost", formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts((prev) => [response.data.data.post, ...prev]);
      return response.data.data;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: getAuthHeader(),
      });
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await api.put(
        `/posts/${postId}/like`,
        {},
        {
          headers: getAuthHeader(),
        },
      );
      const { post: updatedPost } = response.data.data;
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount: updatedPost.likesCount,
                isLiked: updatedPost.isLiked,
              }
            : post,
        ),
      );
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
    }
  };

  const addComment = async (postId, text) => {
    try {
      const response = await api.post(
        `/comments/${postId}/comment`,
        { text },
        {
          headers: getAuthHeader(),
        },
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
            : post,
        ),
      );
      return response.data;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await api.get(`/comments/${postId}/comments`);
      return response.data.data.comments;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const fetchUserPosts = async (userId, page = 1) => {
    try {
      const response = await api.get(`/posts/user/${userId}?page=${page}`);
      return response.data.data.posts;
    } catch (err) {
      const msg = handleError(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        pagination,
        fetchPosts,
        createPost,
        deletePost,
        toggleLike,
        addComment,
        fetchComments,
        fetchUserPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
