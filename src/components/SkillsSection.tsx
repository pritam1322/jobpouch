"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";

export default function SkillsSection() {
  const { data: session, status } = useSession();
  const [skillsInput, setSkillsInput] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [submittedSkills, setSubmittedSkills] = useState<string[]>([]);

  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchSkills() {
      if (!userId) return;
      const response = await fetch(`/api/skills?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmittedSkills(data.skills || []);
        setPrimarySkill(data.primarySkill || "");
      }
    }
    fetchSkills();
  }, [userId]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function handleAddSkills(ev: React.FormEvent) {
    ev.preventDefault();
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const updates: { userId: string; skillNames?: string[]; primarySkill?: string } = { userId };

    if (skillsInput.trim()) {
      updates.skillNames = skillsInput.split(",").map((skill) => skill.trim());
    }

    if (primarySkill.trim()) {
      updates.primarySkill = primarySkill;
    }

    const response = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.updatedSkill.skills) {
        setSubmittedSkills(data.updatedSkill.skills.split(", "));
      }
      if (data.updatedSkill.primarySkill) {
        setPrimarySkill(data.updatedSkill.primarySkill);
      }
      setSkillsInput("");
    }
  }


  return (
    <section className=" text-gray-400 py-10  mt-2 justify-center mx-auto">
      <div className="flex flex-col my-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Add Your Skills</h1>
        <form onSubmit={handleAddSkills} className="w-1/2">
          <label htmlFor="primarySkill" className="label">
            <span className="label-text text-lg">Enter your primary skill:</span>
          </label>
          <Input
            id="primarySkill"
            type="text"
            placeholder="e.g., Data Science, Node.js Developer"
            value={primarySkill}
            onChange={(ev) => setPrimarySkill(ev.target.value)}
            className="input input-bordered border border-gray-50"
          />
          <label htmlFor="skillsInput" className="label">
            <span className="label-text text-lg">Enter your skills (comma-separated):</span>
          </label>
          <Textarea 
            id="skillsInput"
            placeholder="JavaScript, Python, React"
            value={submittedSkills}
            onChange={(ev) => setSkillsInput(ev.target.value)}
            className="min-h-[120px] border border-gray-50"
          />
          <Button type="submit" variant="destructive" className="w-2/5 my-6">Add</Button>
        </form>
      </div>
    </section>
  );
}