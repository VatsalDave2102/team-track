import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { teamSlice } from "./team/teamSlice";

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    team: teamSlice.reducer
})

export default rootReducer