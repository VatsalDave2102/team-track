/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Task, TeamData, TeamMemberData } from "../../utils/types";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { FirebaseError } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import {
  AssignTaskParams,
  CreateTeamParams,
  DeleteTaskParams,
  PostCommentParams,
  UpdateTaskOrderDifferentColumnParams,
  UpdateTaskOrderSameColumnParams,
  UpdateTaskParams,
  UpdateTeamParams,
  uploadTeamImageParams,
} from "./types";

// thunk to create team
export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (teamData: CreateTeamParams, { rejectWithValue }) => {
    try {
      const { teamName, overview, members, owner, image } = teamData;

      // adding team date to firestore
      const refData = await addDoc(collection(db, "teams"), {
        teamName: teamName,
        overview: overview,
        members: members,
        owner: owner,
        image: image,
      });
      toast.success("Team created successfully!");
      const newTeamData = { id: refData.id, ...teamData };

      // returning newly created team with id
      return newTeamData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to get current user's team
export const getCurrentUserTeams = createAsyncThunk(
  "teams/getCurrentUserTeams",
  async (currentUser: string, { rejectWithValue }) => {
    try {
      // getting reference of teams collection
      const teamsRef = collection(db, "teams");

      // query for getting user's team where he is owner/member
      const teamsQuery = query(
        teamsRef,
        or(
          where("owner", "==", currentUser),
          where("members", "array-contains", currentUser)
        )
      );
      const querySnapshot = await getDocs(teamsQuery);
      const teams: TeamData[] = [];

      // mapping team data and returning it
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

// thunk to fetch team members of specific team
export const fetchMembers = createAsyncThunk(
  "team/fetchMembers",
  async (uids: string[], { rejectWithValue }) => {
    try {
      const usersRef = collection(db, "users");
      // query to find those members from users collection
      const q = query(usersRef, where("uid", "in", uids));
      const querySnapshot = await getDocs(q);

      // mapping members data and returning it
      const membersData: TeamMemberData[] = querySnapshot.docs.map((doc) => {
        return {
          name: doc.data().name,
          email: doc.data().email,
          uid: doc.data().uid,
          profileImage: doc.data().profileImage,
        };
      });

      return membersData;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to update team details
export const updateTeam = createAsyncThunk(
  "team/updateTeam",
  async (
    { teamId, newOverview, newMembers }: UpdateTeamParams,
    { rejectWithValue }
  ) => {
    try {
      // getting the team using id
      const teamRef = doc(db, "teams", teamId);

      // updating team in firestore
      await updateDoc(teamRef, {
        overview: newOverview,
        members: newMembers,
      });

      // returning new updates
      toast.success("Team updated successfully!");
      return { newOverview, newMembers };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to delete the team
export const deleteTeam = createAsyncThunk(
  "team/deleteTeam",
  async (teamId: string, { rejectWithValue }) => {
    try {
      const teamRef = doc(db, "teams", teamId);

      // deleting the team
      await deleteDoc(teamRef);
      toast.success("Team deleted successfully!");
      return teamId;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to upload team image
export const uploadTeamImage = createAsyncThunk(
  "team/uploadTeamImage",
  async ({ file, teamId }: uploadTeamImageParams, { rejectWithValue }) => {
    try {
      // checking if team has already an existing image
      const teamDocRef = doc(db, "teams", teamId);
      const teamDocSnapshot = await getDoc(teamDocRef);
      const teamData = teamDocSnapshot.data();

      // if exist then delete that image
      if (teamData && teamData.image) {
        const existingImagePath = teamData.image;
        const existingImageRef = ref(storage, existingImagePath);
        await deleteObject(existingImageRef);
      }

      // uploading the new profile image
      const storageRef = ref(storage, `team-images/${teamId}/image.png`);
      const snapshot = await uploadBytes(storageRef, file);

      // getting the download url
      const downloadURL = await getDownloadURL(snapshot.ref);

      // updating the team in firestore
      await updateDoc(teamDocRef, { image: downloadURL });

      toast.success("Team image updated!");
      return downloadURL;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to assign tasks
export const assignTasks = createAsyncThunk(
  "team/assignTask",
  async ({ teamId, taskData }: AssignTaskParams, { rejectWithValue }) => {
    try {
      // getting team reference
      const teamRef = doc(db, "teams", teamId);
      const team = await getDoc(teamRef);

      // if tasks object already exists then add task to todo
      if (team.data()?.tasks) {
        await updateDoc(teamRef, {
          "tasks.todo": arrayUnion(taskData),
        });
      } else {
        // if not then create a new object and add task
        await setDoc(
          teamRef,
          {
            tasks: { todo: [taskData], ongoing: [], review: [], completed: [] },
          },
          { merge: true }
        );
      }
      toast.success("New task assigned!");
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to update task
export const updateTask = createAsyncThunk(
  "team/updateTask",
  async ({ teamId, taskData }: UpdateTaskParams, { rejectWithValue }) => {
    try {
      // getting team reference
      const teamRef = doc(db, "teams", teamId);
      const teamDoc = await getDoc(teamRef);

      // function to find the task in a array and update it
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

        // updating task data in columns
        const updatedTask = {
          ...tasks,
          todo: updateTaskArray(tasks?.todo),
          ongoing: updateTaskArray(tasks?.ongoing),
          review: updateTaskArray(tasks?.review),
          completed: updateTaskArray(tasks?.completed),
        };

        // update the team
        await updateDoc(teamRef, { tasks: updatedTask });

        toast.success("Task details updated!");
        return updatedTask;
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to post comment
export const postComment = createAsyncThunk(
  "team/postComment",
  async (
    { teamId, taskId, newComment, column }: PostCommentParams,
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
        return { taskId, newComment, column };
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// thunk to update task order in same column when dragged
export const updateTaskOrderSameColumn = createAsyncThunk(
  "team/updateTaskOrderSameColumn",
  async (
    { teamId, updatedTasks, column }: UpdateTaskOrderSameColumnParams,
    { rejectWithValue }
  ) => {
    try {
      // getting the team
      const teamRef = doc(db, "teams", teamId);

      // updating the order
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

// thunk to update task order in different column when dragged
export const updateTaskOrderDifferentColumn = createAsyncThunk(
  "team/updateTaskOrderDifferentColumn",
  async (
    { teamId, updatedTasksObject }: UpdateTaskOrderDifferentColumnParams,
    { rejectWithValue }
  ) => {
    try {
      // getting the team
      const teamRef = doc(db, "teams", teamId);

      // updating the task object in team
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

// thunk to delete the task
export const deleteTask = createAsyncThunk(
  "team/deletTask",
  async (
    { teamId, taskId, updatedTasksArray, column }: DeleteTaskParams,
    { rejectWithValue }
  ) => {
    try {
      // getting the team
      const teamRef = doc(db, "teams", teamId);

      // updating the task's column
      await updateDoc(teamRef, {
        ["tasks." + column]: updatedTasksArray,
      });
      toast.success("Task deleted successfully!");
      return { taskId, column };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
    }
  }
);
