import { configureStore } from '@reduxjs/toolkit';
import teamSlice from "./redux/slices/teams"

export const store = configureStore({
  reducer: {
    teamData: teamSlice,
  },
});
