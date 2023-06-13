import { createSlice } from "@reduxjs/toolkit"
import { createTeam } from "./teamServices"

interface TeamState{
    teamList : string[],
    error: string | null,
    isLoading: boolean
}
const initialState: TeamState = {
    teamList : [],
    error: null,
    isLoading: false
}

export const  teamSlice = createSlice({
    name:'team',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(createTeam.pending, (state)=>{
            state.isLoading = true
        }).addCase(createTeam.fulfilled, (state)=>{
            state.isLoading = false
        }).addCase(createTeam.rejected,(state,action)=>{
            state.isLoading = false
            state.error = action.payload as string
        })
    }
})