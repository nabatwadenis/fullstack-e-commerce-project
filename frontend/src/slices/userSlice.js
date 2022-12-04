import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

const initialState = {
    list:[],
    status: null,
};

export const usersFetch = createAsyncThunk("users/usersFetch", async () =>{
    try{
        const response = await axios.get(`${url}/users`, setHeaders());
        return response.data;

    }catch(err){
        console.log(err);
    }
})

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: {
        [usersFetch.pending]: (state, action) =>{
            state.status = "pending";
        },
        [usersFetch.fulfilled]: (state, action) =>{
            state.list = action.payload;
            state.status = "success";
        },
        [usersFetch.rejected]: (state, action) =>{
            state.status = "rejected";
        }

    }
})

export  default usersSlice.reducer;