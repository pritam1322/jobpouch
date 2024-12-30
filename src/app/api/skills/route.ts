import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, skillNames, primarySkill } = await request.json();
    const userIdInt = Number(userId);

    // Ensure skillNames is an array or default to an empty array
    const skillsArray = Array.isArray(skillNames) ? skillNames : [];

    const existingSkill = await prisma.skill.findFirst({ where: { userId: userIdInt } });

    if (existingSkill) {
      // Merge existing skills with new ones, avoiding duplicates
      const updatedSkills = Array.from(new Set([...existingSkill.skills.split(", "), ...skillsArray]));
      const response = await prisma.skill.update({
        where: { id: existingSkill.id },
        data: {
          skills: updatedSkills.join(", "), // Join skills into a single string
          primarySkill: primarySkill || existingSkill.primarySkill,
        },
      });
      return NextResponse.json({ updatedSkill: response });
    } else {
      // Create new skill entry
      const skillsString = skillsArray.join(", ");
      const newSkill = await prisma.skill.create({
        data: { userId: userIdInt, skills: skillsString, primarySkill },
      });
      return NextResponse.json({ newSkill });
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const userSkills = await prisma.skill.findFirst({ where: { userId: Number(userId) } });

  if (userSkills) {
    return NextResponse.json({ skills: userSkills.skills.split(", "), primarySkill: userSkills.primarySkill });
  } else {
    return NextResponse.json({ skills: [], primarySkill: null });
  }
}

export async function DELETE(request: Request) {
  const { userId, skillName } = await request.json();

  const existingSkill = await prisma.skill.findFirst({ where: { userId: Number(userId) } });

  if (existingSkill) {
    const updatedSkills = existingSkill.skills.split(", ").filter((skill) => skill !== skillName);
    const response = await prisma.skill.update({
      where: { id: existingSkill.id },
      data: { skills: updatedSkills.join(", ") },
    });
    return NextResponse.json({ updatedSkill: response });
  }
  return NextResponse.json({ error: "Skill not found" }, { status: 404 });
}
