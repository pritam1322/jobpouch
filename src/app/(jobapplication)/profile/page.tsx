'use client';

import SkillsSection from "@/components/SkillsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc-client/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { data: session } = useSession();
    const updateUser = trpc.updateUserNameEmail.useMutation();

    async function handleProfileSave(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        try {
            const formData = new FormData(ev.currentTarget);
            const response = await updateUser.mutateAsync({
                userId: Number(session?.user?.id),
                name: formData.get('name') as string,
            });
            if (response) {
                toast.success('Profile updated!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('An error occurred while saving your profile.');
        }
    }

    return (
        <section className="mt-8 mx-4 w-full">
            <div>
                <span className="font-bold lg:text-3xl sm:text-xl">Profile Page</span>
            </div>
            <span className="text-sm text-gray-400">Welcome to your profile page.</span>

            <form onSubmit={handleProfileSave}>
                <section className="mt-12 mb-6 w-1/2 text-gray-400">
                    <label htmlFor="name" className="text-md my-2 block">Name</label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={session?.user?.name || ""}
                        className="my-1 border border-gray-50"
                    />

                    <label htmlFor="email" className="text-md mt-2  block">Email</label>
                    <Input
                        id="email"
                        name="email"
                        type="text"
                        disabled
                        value={session?.user?.email || ""}
                        className="mt-1 border border-gray-50"
                    />
                </section>
                <Button type="submit" variant="destructive" className="w-1/5">Save</Button>
            </form>

            <SkillsSection />
        </section>
    );
}
