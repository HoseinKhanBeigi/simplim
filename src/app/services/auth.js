const API_URL = 'https://simplimback-production.up.railway.app';

// Add a cache for user data
let userDataCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const authService = {
  async register(email, username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // After successful registration, automatically log in
      return this.login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(username, password) {
    try {
      console.log('Login attempt with:', { username, password });
      
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      console.log('Request body:', formData.toString());
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.access_token);
      
      console.log('Storing token:', data);
      
      // Get user data from /auth/me endpoint
      const userData = await this.getUserData(data.access_token);
      console.log('User data from /auth/me:', userData);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      userDataCache = userData; // Update cache
      lastFetchTime = Date.now();

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    userDataCache = null; // Clear cache
    lastFetchTime = 0;
    window.location.href = '/auth';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    // First try to get from cache
    if (userDataCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      return userDataCache;
    }

    // If not in cache, get from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        userDataCache = parsedUser; // Update cache
        lastFetchTime = Date.now();
        return parsedUser;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },

  // Get user data from /auth/me endpoint
  async getUserData(token) {
    // Check cache first
    if (userDataCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      console.log('Using cached user data');
      return userDataCache;
    }

    try {
      console.log('Fetching fresh user data from /auth/me');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      const formattedUserData = {
        email: userData.email,
        username: userData.username,
        role: userData.role || 'free',
        clarificationsUsed: userData.clarificationsUsed || 0,
        clarificationsLimit: userData.clarificationsLimit || 5
      };

      // Update cache
      userDataCache = formattedUserData;
      lastFetchTime = Date.now();

      return formattedUserData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  // Check if the token is valid and update user data
  async checkAuth() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Only fetch if cache is expired
      if (!userDataCache || Date.now() - lastFetchTime >= CACHE_DURATION) {
        const userData = await this.getUserData(token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
}; 