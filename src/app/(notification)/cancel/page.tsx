'use client'
import { useRouter } from "next/navigation"

export default function CancelPage(){
    const router = useRouter();
    return(
        <section>
            <div className="hero bg-base-200 min-h-screen text-white">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">
                        Payment Cancel. Please refresh the page and navigate to pricing page again.
                    </p>
                    <button className="btn btn-primary" onClick={() => router.push('/pricing')}>Get Started</button>
                    </div>
                </div>
            </div>
        </section>
    )
}