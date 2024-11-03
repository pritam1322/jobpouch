"use client"; 

import Link from 'next/link';  
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/LoginButton';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(password);
        const result = await signIn('credentials', {
            redirect: false, // Don't redirect automatically
            email,
            password,
        });
    
        if (result?.error) {
        console.error(result.error); // Handle error
        toast.error('Wrong Creds');
        } else {
        router.push('/'); 
        }
    };

    const handleAutofillEmailPassword = () => {
        const email = "teamfree@example.com";
        const password = "teamfree";
        setEmail(email);
        setPassword(password);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Login</h2>
                <LoginButton />
                <div className='rounded-lg shadow-lg bg-gray-200 text-black my-4 p-1 flex max-w-48 mx-auto'>
                    <button onClick={handleAutofillEmailPassword} className="w-full font-semibold">
                    Guest Login
                    </button>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>

                   
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
                            className="mt-1 w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                            className="mt-1 w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Login 
                    </button>
                </form>
            </div>
        </div>
    );
}
