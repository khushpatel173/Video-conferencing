import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
function AuthLayout({children,authentication=true}) {
    const loading = useSelector((state) => state.auth.loading);
    const authStatus = useSelector((state) => state.auth.status);
    console.log("AuthLayout rendered");
    console.log(authStatus);
    const navigate = useNavigate();

    useEffect(()=>{
          if(loading) return;
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
    } , [authentication, authStatus , navigate]);
    if(loading){
        console.log("loading");
        
        return <h1>Loading...</h1>;
    }
       return <>{children}</>;
}

export default AuthLayout