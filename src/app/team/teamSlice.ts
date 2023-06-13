import { createSlice } from "@reduxjs/toolkit";
import { createTeam, getCurrentUserTeams } from "./teamServices";
import { TeamData } from "../../utils/types";

interface TeamState {
  teamList: TeamData[];
  error: string | null;
  isLoading: boolean;
}
const initialState: TeamState = {
  teamList: [],
  error: null,
  isLoading: false,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTeam.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUserTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamList = action.payload as TeamData[];
        console.log(action.payload);
      })
      .addCase(getCurrentUserTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
