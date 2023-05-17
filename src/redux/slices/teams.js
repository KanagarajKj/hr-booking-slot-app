import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   hrMembers :[],
   selectedHR:'',
   events:[]
}

const teamSlice = createSlice({
  name: 'teamData',
  initialState,
  reducers: {
    setHrMembers: (state, action) => {
      state.hrMembers = action.payload;
    },
    setSelecetedHR: (state, action) => {
      state.selectedHR = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { setHrMembers, setSelecetedHR, setEvents } = teamSlice.actions;

export default teamSlice.reducer;