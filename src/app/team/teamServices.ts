import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Comment,
  Task,
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
          tasks: arrayUnion(taskData),
        });
      } else {
        await setDoc(teamRef, { tasks: [taskData] }, { merge: true });
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
      if (teamDoc.exists()) {
        const teamData: TeamData = teamDoc.data() as TeamData;

        // Finding the index of the task within the tasks array
        const taskIndex = teamData.tasks?.findIndex(
          (task) => task.id === taskData.id
        );
        console.log(taskIndex);

        // Modifying the task object with new taskData
        if (taskIndex !== -1 && teamData.tasks) {
          teamData.tasks[taskIndex as number] = {
            ...teamData.tasks[taskIndex as number],
            ...taskData,
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

export const postComment = createAsyncThunk(
  "team/postComment",
  async (
    {
      teamId,
      taskId,
      newComment,
    }: {
      teamId: string;
      taskId: string;
      newComment: Comment;
    },
    { rejectWithValue }
  ) => {
    try {
      const teamRef = doc(db, "teams", teamId);
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData: TeamData = teamDoc.data() as TeamData;

        // Finding the index of the task within the tasks array
        const taskIndex = teamData.tasks?.findIndex(
          (task) => task.id === taskId
        );

        // Modifying the task object with new taskData
        if (taskIndex !== -1 && teamData.tasks) {
          const existingComments = teamData.tasks[taskIndex as number].comments;
          teamData.tasks[taskIndex as number] = {
            ...teamData.tasks[taskIndex as number],
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
