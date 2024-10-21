'use client'
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {signIn} from "next-auth/react";

export default function LoginButton(){
    return (
        <div className="shadow shadow-black/100 p-1 m-2 rounded-full items-center border-b mb-4">
            <button
                onClick={() => signIn('google')}
                className="flex gap-2 mx-auto items-center">
                <FontAwesomeIcon icon={faGoogle} className="h-5"/>
                <span className="text-center text-sm">Continue with Google</span>
            </button>
        </div>
    )
}