import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./slices/gamesSlice";
import eventsReducer from "./slices/eventsSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    events: eventsReducer,
  },
});
