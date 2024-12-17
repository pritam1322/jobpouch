"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function SkillsSection() {
  const { data: session, status } = useSession();
  const [skillsInput, setSkillsInput] = useState("");
  const [submittedSkills, setSubmittedSkills] = useState<string[]>([]);

  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchSkills() {
      if (!userId) return;
      const response = await fetch(`/api/skills?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmittedSkills(data.skills || []);
      }
    }
    fetchSkills();
  }, [userId]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  async function handleAddSkills(ev: React.FormEvent) {
    ev.preventDefault();
    const skillsArray = skillsInput.split(",").map((skill) => skill.trim());
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, skillNames: skillsArray }),
    });
    if (response.ok) {
      const data = await response.json();
      setSubmittedSkills(data.updatedSkill.skills.split(", "));
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

  return (
    <section className="bg-gray-950 text-white py-10 px-4 mt-8">
      <div className="flex flex-col max-w-5xl my-8 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Add Your Skills</h1>
        <form onSubmit={handleAddSkills} className="form-control w-full max-w-lg mx-auto">
          <label htmlFor="skillsInput" className="label">
            <span className="label-text text-lg">Enter your skills (comma-separated):</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              id="skillsInput"
              type="text"
              placeholder="JavaScript, Python, React"
              value={skillsInput}
              onChange={(ev) => setSkillsInput(ev.target.value)}
              className="input input-bordered w-full bg-gray-800 border-gray-700 text-gray-100 px-4 py-2 rounded-md"
            />
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="mt-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Skills:</h2>
        {submittedSkills.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {submittedSkills.map((skill, index) => (
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
        ) : (
          <p className="text-gray-400">No skills submitted yet. Start adding!</p>
        )}
      </div>
    </section>
  );
}
