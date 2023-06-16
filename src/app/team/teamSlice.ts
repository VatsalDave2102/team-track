import { createSlice } from "@reduxjs/toolkit";
import {
  assignTasks,
  createTeam,
  getCurrentUserTeams,
  postComment,
  updateTask,
  updateTeam,
} from "./teamServices";
import { TeamData } from "../../utils/types";

interface TeamState {
  teamList: TeamData[];
  error: string | null;
  isLoading: boolean;
  activeTeam: string | null;
}
const initialState: TeamState = {
  teamList: [],
  error: null,
  isLoading: false,
  activeTeam: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setActiveTeam: (state, action) => {
      state.activeTeam = action.payload;
    },
  },
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
      })
      .addCase(getCurrentUserTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTeam.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload as string;
      })
      .addCase(assignTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignTasks.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(postComment.pending, (state) => {
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setActiveTeam } = teamSlice.actions;
