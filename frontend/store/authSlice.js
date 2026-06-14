import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status : false , 
    userData : null , 
    loading : true
}

const authSlice = createSlice({
    name : 'auth' , 
    initialState , 
    reducers : {
        login : (state , action)=>{
            state.status = true;
            state.userData = action.payload;
        } , 
        logout : (state)=>{
            state.status = false , 
            state.userData = null
        } , 
        setLoading : (state)=>{
            state.loading = false;
        }
    }
})


export default authSlice.reducer;
export const {login,logout , setLoading} = authSlice.actions;
