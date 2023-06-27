/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createSlice } from "@reduxjs/toolkit";
import {
  assignTasks,
  createTeam,
  deleteTask,
  deleteTeam,
  fetchMembers,
  getCurrentUserTeams,
  postComment,
  updateTask,
  updateTaskOrderDifferentColumn,
  updateTaskOrderSameColumn,
  updateTeam,
  uploadTeamImage,
} from "./teamServices";
import {
  Comment,
  Task,
  Tasks,
  TeamData,
  TeamMemberData,
} from "../../utils/types";

interface TeamState {
  teamList: TeamData[];
  error: string | null;
  isLoading: boolean;
  activeTeam: string | null;
  uploadComment: boolean;
  isTaskDelete: boolean;
  isTeamDelete: boolean;
  activeTask: string | null;
  activeTeamMembers: TeamMemberData[] | null;
}
const initialState: TeamState = {
  teamList: [],
  error: null,
  isLoading: false,
  activeTeam: null,
  activeTask: null,
  uploadComment: false,
  isTaskDelete: false,
  isTeamDelete: false,
  activeTeamMembers: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setActiveTeam: (state, action) => {
      state.activeTeam = action.payload;
    },
    clearTeamMembers: (state) => {
      state.activeTeamMembers = null;
    },
    updateTaskOrderSame: (state, action) => {
      const {
        updatedTasks,
        column,
      }: { updatedTasks: Task[]; column: keyof Tasks } = action.payload;
      const teamIndex = state.teamList.findIndex(
        (team) => team.id === state.activeTeam
      );
      state.teamList[teamIndex].tasks![column] = updatedTasks;
    },
    updateTaskOrderDifferent: (state, action) => {
      const updatedTasksObject = action.payload;
      const teamIndex = state.teamList.findIndex(
        (team) => team.id === state.activeTeam
      );
      state.teamList[teamIndex].tasks = updatedTasksObject;
    },

    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamList.push(action.payload as TeamData);
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
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeTeamMembers = action.payload as TeamMemberData[];
      })
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const teamIndex = state.teamList.findIndex(
          (team) => team.id === state.activeTeam
        );
        state.teamList[teamIndex].overview = action.payload
          ?.newOverview as string;
        state.teamList[teamIndex].members = action.payload
          ?.newMembers as string[];
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload as string;
      })
      .addCase(uploadTeamImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadTeamImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const teamIndex = state.teamList.findIndex(
          (team) => team.id === state.activeTeam
        );
        state.teamList[teamIndex].image = action.payload;
      })
      .addCase(uploadTeamImage.rejected, (state, action) => {
        state.isLoading = false;
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
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const teamIndex = state.teamList.findIndex(
          (team) => team.id === state.activeTeam
        );
        state.teamList[teamIndex].tasks = action.payload as Tasks;
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(postComment.pending, (state) => {
        state.error = null;
        state.uploadComment = true;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.error = null;
        state.uploadComment = false;
        const { taskId, newComment, column } = action.payload as {
          taskId: string;
          newComment: Comment;
          column: keyof Tasks;
        };
        const teamIndex = state.teamList.findIndex(
          (team) => team.id === state.activeTeam
        );

        if (state.teamList[teamIndex].tasks) {
          const taskIndex = state.teamList[teamIndex].tasks![column].findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            state.teamList[teamIndex].tasks![column][taskIndex].comments.push(
              newComment
            );
          }
        }
      })
      .addCase(postComment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.uploadComment = false;
      })

      .addCase(updateTaskOrderSameColumn.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateTaskOrderSameColumn.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateTaskOrderDifferentColumn.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateTaskOrderDifferentColumn.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isTaskDelete = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isTaskDelete = false;
        state.error = null;
        const { taskId, column } = action.payload as {
          taskId: string;
          column: keyof Tasks;
        };
        const teamIndex = state.teamList.findIndex(
          (team) => team.id === state.activeTeam
        );
        if (teamIndex !== -1 && state.teamList[teamIndex]?.tasks) {
          const tasks = state.teamList[teamIndex].tasks;
          if (tasks)
            tasks[column] = tasks[column].filter((task) => task.id !== taskId);
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isTaskDelete = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTeam.pending, (state) => {
        state.isTeamDelete = true;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        const deleteTeamId = action.payload as string;
        state.isTeamDelete = false;
        state.teamList = state.teamList.filter(
          (team) => team.id !== deleteTeamId
        );
      });
  },
});

export const {
  setActiveTeam,
  clearTeamMembers,
  updateTaskOrderSame,
  updateTaskOrderDifferent,
  setActiveTask,
} = teamSlice.actions;
