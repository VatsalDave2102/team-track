import { createAsyncThunk } from "@reduxjs/toolkit";
import { TeamMemberData, TeamOwnerData } from "../../utils/types";
import { addDoc, collection } from "firebase/firestore";
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
        name: teamName,
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
