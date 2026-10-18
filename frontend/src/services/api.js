const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getAuthToken = () => {
  return localStorage.getItem("gaushala_admin:token") || "";
};

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If not FormData, set Content-Type to application/json
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth
  auth: {
    login: (email, password) =>
      request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    me: () => request("/api/auth/me"),
    changePassword: (currentPassword, newPassword) =>
      request("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // Site Info
  siteInfo: {
    get: () => request("/api/site-info"),
    update: (data) =>
      request("/api/site-info", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Statistics
  statistics: {
    get: () => request("/api/statistics"),
    add: (data) =>
      request("/api/statistics", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/statistics/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/statistics/${id}`, {
        method: "DELETE",
      }),
  },

  // Cows
  cows: {
    get: () => request("/api/cows"),
    getById: (id) => request(`/api/cows/${id}`),
    add: (data) =>
      request("/api/cows", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/cows/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/cows/${id}`, {
        method: "DELETE",
      }),
  },

  // Gallery
  gallery: {
    get: (category) => {
      const qs = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
      return request(`/api/gallery${qs}`);
    },
    add: (data) =>
      request("/api/gallery", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/api/gallery/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/api/gallery/${id}`, {
        method: "DELETE",
      }),
  },

  // Donation
  donation: {
    get: () => request("/api/donation"),
    update: (data) =>
      request("/api/donation", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Public Reports
  reports: {
    get: (status, search) => {
      const params = new URLSearchParams();
      if (status && status !== "All") params.append("status", status);
      if (search) params.append("search", search);
      const qs = params.toString() ? `?${params.toString()}` : "";
      return request(`/api/reports${qs}`);
    },
    add: (data) =>
      request("/api/reports", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (id, status) =>
      request(`/api/reports/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id) =>
      request(`/api/reports/${id}`, {
        method: "DELETE",
      }),
  },

  // Volunteers, Suggestions, Adoptions
  volunteers: {
    add: (data) =>
      request("/api/volunteers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: () => request("/api/volunteers"),
  },
  suggestions: {
    add: (data) =>
      request("/api/suggestions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: () => request("/api/suggestions"),
  },
  adoptions: {
    add: (data) =>
      request("/api/adoptions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: () => request("/api/adoptions"),
  },

  // File Upload
  upload: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await request("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res?.url && res.url.startsWith("/") && BASE_URL) {
      res.url = `${BASE_URL}${res.url}`;
    }
    return res;
  },
};
