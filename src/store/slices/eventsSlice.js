import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEvents, events } from "../../services/events.js";

const JOINED_EVENTS_STORAGE_KEY = "joined_events_v1";

const loadJoinedEvents = () => {
  try {
    const raw = localStorage.getItem(JOINED_EVENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const fetchEventsThunk = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchEvents();
      return res; // expected: array of events
    } catch (error) {
      return rejectWithValue("Unknown error fetching events");
    }
  },
);

const initialState = {
  list: {
    data: [], // array of events
    loading: false,
    error: null,
  },
  joinedEvents: loadJoinedEvents(),
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    toggleJoinEvent: (state, action) => {
      const id = Number(action.payload);
      if (state.joinedEvents.includes(id)) {
        state.joinedEvents = state.joinedEvents.filter(
          (joinedId) => joinedId !== id,
        );
      } else {
        state.joinedEvents.push(id);
      }
      try {
        localStorage.setItem(
          JOINED_EVENTS_STORAGE_KEY,
          JSON.stringify(state.joinedEvents),
        );
      } catch {
        // Handle unavailable localStorage
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });
  },
});

export const { toggleJoinEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
