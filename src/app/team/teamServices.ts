/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Comment,
  Task,
  Tasks,
  TeamData,
  TeamMemberData,
  TeamOwnerData,
} from "../../utils/types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FirebaseError } from "firebase/app";

export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (
    teamData: {
      teamName: string;
      overview: string;
      members: TeamMemberData[];
      owner: TeamOwnerData;
    },
    { rejectWithValue }
  ) => {
    try {
      const { teamName, overview, members, owner } = teamData;
      await addDoc(collection(db, "teams"), {
        teamName: teamName,
        overview: overview,
        members: members,
        owner: owner,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getCurrentUserTeams = createAsyncThunk(
  "teams/getCurrentUserTeams",
  async (currentUser: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const teamsRef = collection(db, "teams");
      const teamsQuery = query(
        teamsRef,
        or(
          where("owner.email", "==", currentUser.email),
          where("members", "array-contains", currentUser.email)
        )
      );

      const querySnapshot = await getDocs(teamsQuery);
      const teams: TeamData[] = [];
      querySnapshot.forEach((doc) => {
        const team = { ...doc.data(), id: doc.id } as TeamData;
        teams.push(team);
      });
      return teams;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTeam = createAsyncThunk(
  "team/updateTeam",
  async (
    {
      teamId,
      newOverview,
      newMembers,
    }: { teamId: string; newOverview: string; newMembers: TeamMemberData[] },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);
      await updateDoc(teamRef, {
        overview: newOverview,
        members: arrayUnion(...newMembers),
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const assignTasks = createAsyncThunk(
  "team/assignTask",
  async (
    { teamId, taskData }: { teamId: string; taskData: Task },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);

      const team = await getDoc(teamRef);
      if (team.data()?.tasks) {
        await updateDoc(teamRef, {
          "tasks.todo": arrayUnion(taskData),
        });
      } else {
        await setDoc(
          teamRef,
          {
            tasks: { todo: [taskData], ongoing: [], review: [], completed: [] },
          },
          { merge: true }
        );
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTask = createAsyncThunk(
  "team/updateTask",
  async (
    {
      teamId,
      taskData,
    }: {
      teamId: string;
      taskData: {
        id: string;
        description: string;
        deadline: string;
        priority: string;
        assignedTo: TeamMemberData[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);
      const teamDoc = await getDoc(teamRef);

      const updateTaskArray = (taskArray: Task[] | undefined) => {
        return taskArray?.map((task) => {
          if (task.id === taskData.id) {
            return {
              ...task,
              ...taskData,
            };
          }
          return task;
        });
      };
      if (teamDoc.exists()) {
        const teamData: TeamData = teamDoc.data() as TeamData;

        const { tasks } = teamData;
        const updatedTask = {
          ...tasks,
          todo: updateTaskArray(tasks?.todo),
          ongoing: updateTaskArray(tasks?.ongoing),
          review: updateTaskArray(tasks?.review),
          completed: updateTaskArray(tasks?.completed),
        };

        await updateDoc(teamRef, { tasks: updatedTask });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const postComment = createAsyncThunk(
  "team/postComment",
  async (
    {
      teamId,
      taskId,
      newComment,
      column,
    }: {
      teamId: string;
      taskId: string;
      newComment: Comment;
      column: keyof Tasks;
    },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        const teamData: TeamData = teamDoc.data() as TeamData;

        // Finding the index of the task within the tasks array
        const taskArray = teamData.tasks![column];
        const taskIndex = taskArray?.findIndex((task) => task.id === taskId);

        // Modifying the task object with new taskData
        if (taskIndex !== -1 && teamData.tasks) {
          const existingComments = teamData.tasks[column][taskIndex].comments;
          teamData.tasks[column][taskIndex] = {
            ...teamData.tasks[column][taskIndex],
            comments: [...existingComments, newComment],
          };
        }

        // Updating the tasks array in firestore
        await updateDoc(teamRef, {
          tasks: teamData.tasks,
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTaskOrderSameColumn = createAsyncThunk(
  "team/updateTaskOrderSameColumn",
  async (
    {
      teamId,
      updatedTasks,
      column,
    }: { teamId: string; updatedTasks: Task[]; column: keyof Tasks },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);

      await updateDoc(teamRef, {
        ["tasks." + column]: updatedTasks,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTaskOrderDifferentColumn = createAsyncThunk(
  "team/updateTaskOrderDifferentColumn",
  async (
    {
      teamId,
      updatedTasksObject,
    }: { teamId: string; updatedTasksObject: Tasks },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);

      await updateDoc(teamRef, {
        tasks: updatedTasksObject,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteTask = createAsyncThunk(
  "team/deletTask",
  async (
    {
      teamId,
      taskId,
      updatedTasksArray,
      column,
    }: {
      teamId: string;
      taskId: string;
      updatedTasksArray: Task[];
      column: keyof Tasks;
    },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);

      await updateDoc(teamRef, {
        ["tasks." + column]: updatedTasksArray,
      });
      return { taskId, column };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);
