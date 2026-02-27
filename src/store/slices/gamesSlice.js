import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchGames,
  getGameDetails,
  getPopularGames,
  getPublishers,
  getPublisherDetails,
} from "../../services/rawg.js";

const FAV_STORAGE_KEY = "fav_games_v1";

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const fetchGamesThunk = createAsyncThunk(
  "games/fetchGames",
  async (params, { rejectWithValue }) => {
    try {
      // params matches what `searchGames` expects
      const res = await searchGames(params);
      return res; // expected: { results, count }
    } catch (error) {
      return rejectWithValue(error.message || "Unknown error fetching games");
    }
  },
);

export const fetchGameDetailsThunk = createAsyncThunk(
  "games/fetchGameDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getGameDetails(id);
      return res; // expected: single game object
    } catch (error) {
      return rejectWithValue(
        error.message || "Unknown error fetching game details",
      );
    }
  },
);

export const fetchPopularGamesThunk = createAsyncThunk(
  "games/fetchPopular",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getPopularGames(params);
      return res.results || [];
    } catch (error) {
      return rejectWithValue(
        error.message || "Unknown error fetching popular games",
      );
    }
  },
);

export const fetchPublishersThunk = createAsyncThunk(
  "games/fetchPublishers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getPublishers(params);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unknown error fetching publishers",
      );
    }
  },
);

export const fetchPublisherDetailsThunk = createAsyncThunk(
  "games/fetchPublisherDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getPublisherDetails(id);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unknown error fetching publisher details",
      );
    }
  },
);

const initialState = {
  list: {
    data: [], // results
    count: 0,
    loading: false,
    error: null,
  },
  detail: {
    data: null, // single game object
    loading: false,
    error: null,
  },
  popular: {
    data: [],
    loading: false,
    error: null,
  },
  publishers: {
    data: [],
    count: 0,
    loading: false,
    error: null,
  },
  publisherDetail: {
    data: null,
    loading: false,
    error: null,
  },
  favorites: loadFavorites(),
};

export const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const id = Number(action.payload);
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id);
      } else {
        state.favorites.push(id);
      }
      try {
        localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(state.favorites));
      } catch {
        // Handle unavailable localStorage
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGamesThunk
      .addCase(fetchGamesThunk.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchGamesThunk.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.results || [];
        state.list.count = action.payload.count || 0;
      })
      .addCase(fetchGamesThunk.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      })
      // fetchGameDetailsThunk
      .addCase(fetchGameDetailsThunk.pending, (state) => {
        state.detail.loading = true;
        state.detail.error = null;
      })
      .addCase(fetchGameDetailsThunk.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.data = action.payload;
      })
      .addCase(fetchGameDetailsThunk.rejected, (state, action) => {
        state.detail.loading = false;
        state.detail.error = action.payload;
      })
      // fetchPopularGamesThunk
      .addCase(fetchPopularGamesThunk.pending, (state) => {
        state.popular.loading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularGamesThunk.fulfilled, (state, action) => {
        state.popular.loading = false;
        state.popular.data = action.payload;
      })
      .addCase(fetchPopularGamesThunk.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.payload;
      })
      // fetchPublishersThunk
      .addCase(fetchPublishersThunk.pending, (state) => {
        state.publishers.loading = true;
        state.publishers.error = null;
      })
      .addCase(fetchPublishersThunk.fulfilled, (state, action) => {
        state.publishers.loading = false;
        state.publishers.data = action.payload.results || [];
        state.publishers.count = action.payload.count || 0;
      })
      .addCase(fetchPublishersThunk.rejected, (state, action) => {
        state.publishers.loading = false;
        state.publishers.error = action.payload;
      })
      // fetchPublisherDetailsThunk
      .addCase(fetchPublisherDetailsThunk.pending, (state) => {
        state.publisherDetail.loading = true;
        state.publisherDetail.error = null;
      })
      .addCase(fetchPublisherDetailsThunk.fulfilled, (state, action) => {
        state.publisherDetail.loading = false;
        state.publisherDetail.data = action.payload;
      })
      .addCase(fetchPublisherDetailsThunk.rejected, (state, action) => {
        state.publisherDetail.loading = false;
        state.publisherDetail.error = action.payload;
      });
  },
});

export const { toggleFavorite } = gamesSlice.actions;
export default gamesSlice.reducer;
