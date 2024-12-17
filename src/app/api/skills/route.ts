import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, skillNames } = body;

    // Convert userId to integer
    const userIdInt = Number(userId);
    if (!userIdInt || isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid userId. It should be an integer." }, { status: 400 });
    }

    if (!skillNames || !Array.isArray(skillNames) || skillNames.length === 0) {
      return NextResponse.json({ error: "Invalid skills data." }, { status: 400 });
    }

    // Store skills as a single comma-separated string
    const skillsString = skillNames.join(", ");

    // Check if user already has a skills entry
    const existingSkill = await prisma.skill.findFirst({
      where: { userId: userIdInt },
    });

    let response;
    if (existingSkill) {
      // Update skills if the user already has data
      const updatedSkills = Array.from(
        new Set([...existingSkill.skills.split(", "), ...skillNames])
      ).join(", ");
      response = await prisma.skill.update({
        where: { id: existingSkill.id },
        data: { skills: updatedSkills },
      });
      return NextResponse.json({ message: "Skills updated successfully", updatedSkill: response }, { status: 200 });
    } else {
      // Create a new skills entry
      const newSkill = await prisma.skill.create({
        data: {
          userId: userIdInt,
          skills: skillsString,
        },
      });
      return NextResponse.json({ message: "Skills added successfully", newSkill }, { status: 201 });
    }
  } catch (error) {
    console.error("Error in POST /skills:", error);
    return NextResponse.json({ error: "Failed to add/update skills.", details: error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Retrieve skills for the specified user
    const userSkills = await prisma.skill.findFirst({
      where: { userId: Number(userId) },
    });

    if (userSkills) {
      return NextResponse.json({
        message: "Skills fetched successfully",
        skills: userSkills.skills.split(", "), // Convert to array
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No skills found for the user." }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in GET /skills:", error);
    return NextResponse.json({ error: "Error while retrieving skills.", details: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, skillName } = body;

    if (!userId || !skillName) {
      return NextResponse.json({ error: "userId and skillName are required." }, { status: 400 });
    }

    const userIdInt = Number(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid userId. It should be an integer." }, { status: 400 });
    }

    const existingSkill = await prisma.skill.findFirst({
      where: { userId: userIdInt },
    });

    if (!existingSkill) {
      return NextResponse.json({ error: "No skills found for the user." }, { status: 404 });
    }

    const updatedSkills = existingSkill.skills
      .split(", ")
      .filter((skill) => skill !== skillName)
      .join(", ");

    const updatedSkill = await prisma.skill.update({
      where: { id: existingSkill.id },
      data: { skills: updatedSkills },
    });

    return NextResponse.json({ message: "Skill deleted successfully", updatedSkill }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /skills:", error);
    return NextResponse.json({ error: "Failed to delete skill.", details: error }, { status: 500 });
  }
}
