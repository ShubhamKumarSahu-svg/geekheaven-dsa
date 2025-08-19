'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch('/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const { data } = await res.json();
      setUser(data);
    } catch (error) {
      console.log('Error in fetchUserprofile AuthProvider', error.message);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })
    );
    setToken(token);
    fetchUserProfile(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const createToggle = (listName, endpoint) => async (questionId) => {
    if (!token || !user) return;

    const originalUser = { ...user };
    const list = user[listName] || [];
    const isAlreadyInList = list.some((q) => q._id === questionId);
    const updatedList = isAlreadyInList
      ? list.filter((q) => q._id !== questionId)
      : [...list, { _id: questionId }];

    setUser({ ...user, [listName]: updatedList });

    try {
      const res = await fetch(`/api/v1/user/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) throw new Error(`Failed to update ${endpoint}`);
      await fetchUserProfile(token);
    } catch (error) {
      console.error(error);
      setUser(originalUser);
    }
  };

  const toggleQuestionProgress = createToggle('completedQuestions', 'progress');
  const toggleQuestionBookmark = createToggle(
    'bookmarkedQuestions',
    'bookmark'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
        toggleQuestionProgress,
        toggleQuestionBookmark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
