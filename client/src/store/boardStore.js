import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = '/api/boards';

export const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ boards: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBoard: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentBoard: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createBoard: async (title, description) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post(
        API_URL,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        boards: [response.data, ...state.boards],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateBoard: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(
        `${API_URL}/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        boards: state.boards.map((b) => (b._id === id ? response.data : b)),
        currentBoard: state.currentBoard?._id === id ? response.data : state.currentBoard,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteBoard: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        boards: state.boards.filter((b) => b._id !== id),
        currentBoard: state.currentBoard?._id === id ? null : state.currentBoard,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setCurrentBoard: (board) => set({ currentBoard: board }),
}));

