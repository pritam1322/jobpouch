"use client"; 

import Link from 'next/link';  
import bcrypt from "bcryptjs";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/LoginButton';
import { useSession } from 'next-auth/react';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedType, setSelectedType] = useState('Candidate');
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { data: session} = useSession();

    if(session?.user){
        router.push('/');
        return null;
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password: hashedPassword, name }),
            });

            if (res.ok) {
                router.push("/login");
                console.log(res.body);
            } else {
                console.error("Signup failed");
            }
        } catch (error) {
            console.error("Error in signup:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full my-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign up to JobPouch</h2>
                <LoginButton />
                <form className="space-y-6" onSubmit={handleSignUp}>

                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border text-black bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Pritam Jathar"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border text-black bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border text-black bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Select Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="select select-bordered mt-1 w-full px-3 py-2 border text-gray-700 bg-gray-100 border-gray-300 rounded-lg shadow-sm"
                            >
                            <option value="Recuiter">Recuiter</option>
                            <option value="Candidate">Candidate</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end">
                        
                        <div className="text-sm">
                            <Link href="/forgot-password" className="text-indigo-500 hover:text-indigo-500 font-semibold">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Sign up
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
