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
  const [showAll, setShowAll] = useState(false);

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

  async function handleRemoveSkill(skill: string) {
    const response = await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, skillName: skill }),
    });
    if (response.ok) {
      setSubmittedSkills((prev) => prev.filter((s) => s !== skill));
    }
  }

  const visibleSkills = showAll ? submittedSkills : submittedSkills.slice(0, 4);

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
      {/* <div className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Primary Skill:  {primarySkill || "Not set yet."}</h2>
        <p className="text-lg bg-gray-800 text-white w-1/3 px-4 py-3 rounded-md mb-6">{primarySkill || "Not set yet."}</p>
        <h2 className="text-lg font-semibold mb-4">Your Skills:</h2>
        {submittedSkills.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-800 text-white px-4 py-3 rounded-md shadow-md"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-400 hover:text-white"
                    aria-label={`Remove ${skill}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {submittedSkills.length > 4 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 text-indigo-500 hover:underline"
              >
                {showAll ? "Show Less" : "Show All"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-400">No skills submitted yet. Start adding!</p>
        )}
      </div> */}
    </section>
  );
}