'use client';
import {signOut} from "next-auth/react";


export default function LogoutButton({
    className = "flex items-center gap-2 p-1 px-4 shadow text-white",
}){
    return (
        <button onClick={()=> signOut()} className={className}>
            <span>Logout</span>
        </button>
    )
}