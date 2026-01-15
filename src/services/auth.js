import API from "./api";

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 */
export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.detail || "Registration failed.");
  }
};

/**
 * Login user
 * Saves token and extracts user info from JWT payload
 * @param {Object} data - { email, password }
 */
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);

    const token = res.data?.access_token;
    if (token) {
      localStorage.setItem("token", token);

      // Decode JWT payload to get user info
      let userInfo;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userInfo = {
          name: payload.name || payload.email || "User",
          email: payload.sub || payload.email || "",
        };
      } catch {
        userInfo = { name: "User", email: "" };
      }

      localStorage.setItem("user", JSON.stringify(userInfo));
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.detail || "Login failed.");
  }
};

/**
 * Logout user (clear token & user info)
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Check if user is authenticated (JWT not expired)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.exp ? payload.exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

/**
 * Get logged-in user info
 * @returns {Object} - { name, email }
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      return {
        name: parsed.name || parsed.email || "User",
        email: parsed.email || "",
      };
    } catch {
      localStorage.removeItem("user");
    }
  }

  // Fallback: decode JWT if user info missing
  const token = localStorage.getItem("token");
  if (!token) return { name: "User", email: "" };

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || payload.email || "User",
      email: payload.sub || payload.email || "",
    };
  } catch {
    return { name: "User", email: "" };
  }
};
