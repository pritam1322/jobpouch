'use client';
import { faAddressCard } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from "next-auth/react"

export default function JobHeader(){
    const {data : session, status}  = useSession();
    return (
        <header>
            <div className="flex justify-between bg-black py-4 text-white px-8">
                <div className="items-center flex gap-4">
                    <FontAwesomeIcon icon={faAddressCard} className="h-8" />
                    <span className="font-semibold">{session?.user?.name}</span>
                </div>
                <div className="items-center flex gap-4">
                    <span className="font-semibold">Candidate Id - {session?.user?.id}</span>
                </div>
            </div>
        </header>
    )
}