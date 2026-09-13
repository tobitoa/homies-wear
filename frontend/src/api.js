import { io } from "socket.io-client";

const API_BASE = "http://localhost:4000/api";
const TOKEN_KEY = "homies_token";
const USER_KEY = "homies_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const resJson = await response.json().catch(() => ({
    success: false,
    message: "Network response was not JSON",
  }));

  if (!response.ok || resJson.success === false) {
    const errorMsg = resJson.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = resJson;
    throw err;
  }

  return resJson;
}

export const api = {
  auth: {
    login: async (credentials) => {
      const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAuthSession(res.data.token, res.data.user);
      return res.data;
    },
    register: async (userData) => {
      const res = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      setAuthSession(res.data.token, res.data.user);
      return res.data;
    },
    me: async () => {
      const res = await request("/auth/me");
      if (res.data && res.data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      }
      return (res.data && res.data.user) || null;
    },
    logout: async () => {
      try {
        await request("/auth/logout", { method: "POST" });
      } finally {
        clearAuthSession();
      }
    },
  },

  items: {
    list: async (params = {}) => {
      const query = new URLSearchParams();
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null && val !== "") {
          query.append(key, val);
        }
      }
      const res = await request(`/items?${query.toString()}`);
      return { items: res.data || [], meta: res.meta || {} };
    },
    nearby: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.lat) query.append("lat", params.lat);
      if (params.lng) query.append("lng", params.lng);
      if (params.radius) query.append("radius", params.radius);
      const res = await request(`/items/nearby?${query.toString()}`);
      return res.data || [];
    },
    get: async (id) => {
      const res = await request(`/items/${id}`);
      return res.data;
    },
    create: async (itemData) => {
      const res = await request("/items", {
        method: "POST",
        body: JSON.stringify(itemData),
      });
      return res.data;
    },
    update: async (id, data) => {
      const res = await request(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return res.data;
    },
    delete: async (id) => {
      return request(`/items/${id}`, { method: "DELETE" });
    },
    calculateValue: async (factors) => {
      const res = await request("/items/calculate-value", {
        method: "POST",
        body: JSON.stringify(factors),
      });
      return res.data;
    },
  },

  swaps: {
    list: async (params = {}) => {
      const query = new URLSearchParams(params);
      const res = await request(`/swaps?${query.toString()}`);
      return res.data || [];
    },
    get: async (id) => {
      const res = await request(`/swaps/${id}`);
      return res.data;
    },
    create: async (swapData) => {
      const res = await request("/swaps", {
        method: "POST",
        body: JSON.stringify(swapData),
      });
      return res.data;
    },
    counter: async (id, counterData) => {
      const res = await request(`/swaps/${id}/counter`, {
        method: "POST",
        body: JSON.stringify(counterData),
      });
      return res.data;
    },
    accept: async (id) => {
      const res = await request(`/swaps/${id}/accept`, {
        method: "PUT",
      });
      return res.data;
    },
    complete: async (id) => {
      const res = await request(`/swaps/${id}/complete`, {
        method: "POST",
      });
      return res.data;
    },
    decline: async (id, reason = "Declined") => {
      const res = await request(`/swaps/${id}/decline`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      });
      return res.data;
    },
  },

  conversations: {
    list: async () => {
      const res = await request("/conversations");
      return res.data || [];
    },
    getMessages: async (id, page = 1) => {
      const res = await request(`/conversations/${id}/messages?page=${page}`);
      return { messages: res.data || [], meta: res.meta || {} };
    },
    sendMessage: async (id, messageData) => {
      const res = await request(`/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify(messageData),
      });
      return res.data;
    },
  },

  notifications: {
    list: async () => {
      const res = await request("/notifications");
      const unread = res.meta && res.meta.unreadCount ? res.meta.unreadCount : 0;
      return { notifications: res.data || [], unreadCount: unread };
    },
    markRead: async (id) => {
      return request(`/notifications/${id}/read`, { method: "PATCH" });
    },
    markAllRead: async () => {
      return request("/notifications/read-all", { method: "PATCH" });
    },
  },

  favorites: {
    list: async () => {
      const res = await request("/favorites");
      return res.data || [];
    },
    add: async (itemId) => {
      return request(`/favorites/${itemId}`, { method: "POST" });
    },
    remove: async (itemId) => {
      return request(`/favorites/${itemId}`, { method: "DELETE" });
    },
  },

  dashboard: {
    stats: async () => {
      const res = await request("/dashboard/stats");
      return res.data || {};
    },
    overview: async () => {
      const res = await request("/dashboard/overview");
      return res.data || {};
    },
  },

  ratings: {
    create: async (data) => {
      const res = await request("/ratings", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.data;
    },
    getForUser: async (userId) => {
      const res = await request(`/ratings/user/${userId}`);
      return res.data || [];
    },
  },
};

let socketClient = null;

export function getSocket() {
  const token = getToken();
  if (!token) return null;

  if (!socketClient || !socketClient.connected) {
    socketClient = io("http://localhost:4000", {
      auth: { token },
      reconnectionAttempts: 5,
    });
  }
  return socketClient;
}
