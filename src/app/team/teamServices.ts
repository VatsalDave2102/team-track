import { createAsyncThunk } from "@reduxjs/toolkit";
import { TeamData, TeamMemberData, TeamOwnerData } from "../../utils/types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  or,
  query,
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
