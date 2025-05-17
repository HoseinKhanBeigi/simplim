import { create } from 'zustand';
import { authService } from '../services/auth';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // PDF state
  files: [],
  currentFile: null,
  currentPage: 1,
  numPages: 0,
  zoom: 1,
  isDrawerOpen: false,

  // Auth actions
  setUser: (user) => {
    console.log('Setting user in store:', user);
    set({ user, isAuthenticated: !!user });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      const userData = await authService.login(username, password);
      console.log('Login successful, user data:', userData);
      
      set({ 
        user: userData, 
        isAuthenticated: true,
        error: null 
      });

      // Redirect to the main page
      window.location.href = '/';
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, username, password) => {
    try {
      set({ isLoading: true, error: null });
      await authService.register(email, username, password);
      
      // After successful registration, automatically log in
      return get().login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
    window.location.href = '/auth';
  },

  // PDF actions
  setFiles: (files) => set({ files }),
  setCurrentFile: (file) => set({ currentFile: file, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setNumPages: (numPages) => set({ numPages }),
  setZoom: (zoom) => set({ zoom }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

  uploadFile: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('file', file);

      const test = await fetch('https://simplimback-production.up.railway.app/pdf/test', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('test', test);

      const response = await fetch('https://simplimback-production.up.railway.app/pdf/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      const fileUrl = URL.createObjectURL(file);
      const newFile = {
        type: 'pdf',
        url: fileUrl,
        name: file.name,
        lastModified: file.lastModified,
        id: data.id
      };

      set((state) => ({
        files: [...state.files, newFile],
        currentFile: newFile,
        currentPage: 1
      }));

      return newFile;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Initialize auth state from localStorage and refresh user data if needed
  initializeAuth: async () => {
    try {
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      // Get user data (will use cache if available)
      const user = authService.getUser();
      if (!user) {
        // If no cached data, check auth and get fresh data
        const isValid = await authService.checkAuth();
        if (!isValid) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        // Get the fresh data
        const freshUser = authService.getUser();
        set({ user: freshUser, isAuthenticated: true });
      } else {
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useStore; 