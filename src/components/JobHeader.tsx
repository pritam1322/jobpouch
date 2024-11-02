'use client';
import { faAddressCard, faChartSimple, faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobHeader(){
    const {data : session, status}  = useSession();
    const router = useRouter();
    if(status === 'unauthenticated'){
        router.push('/');
      }
    return (
        <header>
            <div className="flex justify-between bg-black py-4 text-white px-8">
                <div className="flex gap-8 items-center">
                    <div className="items-center flex gap-4">
                        <FontAwesomeIcon icon={faAddressCard} className="h-8" />
                        <Link href={'/viewJobApplication'}  className="font-semibold">{session?.user?.name}</Link>
                    </div>
                    <div className="items-center flex gap-1">
                        <FontAwesomeIcon icon={faChartSimple} className="h-5" />
                        <Link href={'/stats'} className="hover:text-gray-400 text-md font-semibold">Statistics</Link>
                    </div>
                    <div className="items-center flex gap-1">
                        <FontAwesomeIcon icon={faFile} className="h-5" />
                        <Link href={'/resume'} className="hover:text-gray-400 text-md font-semibold">Resume</Link>
                    </div>
                </div>
                <div className="items-center flex gap-8">
                    <Link href={'/'}  className="font-semibold">Home</Link>
                    <span className="font-semibold">{session?.user?.email}</span>
                </div>
            </div>
        </header>
    )
}