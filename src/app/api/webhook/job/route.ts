import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const { title, company, link, referralPerson, email } = body;

  // Ensure session is loaded and email is present
  if (!email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  console.log(title, company, link, referralPerson, email);
  // Fetch the user based on email
  const candidate = await prisma.user.findUnique({
    where: { email },
  });


  // Validate incoming data
  if (!title || !company || !link) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }


  if (!candidate) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  const techguid = uuidv4();

  try {
    // Create a new job entry in the database using Prisma
    const newApplication = await prisma.jobApplication.create({
      data: {
        candidateId: candidate.id,
        jobTitle: title,
        companyName: company,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
        referralPerson: referralPerson || null,
        jobLink: link,
        techguid
      },
    });
    console.log(newApplication);
    return NextResponse.json({ message: "Job added successfully", techguid: techguid  }, { status: 201 }); // 201 = Created
  } catch (error) {
    console.error("Error adding job:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  // Optionally handle GET requests
  return new Response(JSON.stringify({ message: 'Webhook GET request' }), { status: 200 });
}


export async function PUT(request: Request) {
  const body = await request.json();
  const { techguid, status, email } = body;

  // Ensure session is loaded and email is present
  if (!email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Fetch the user based on email
  const candidate = await prisma.user.findUnique({
    where: { email },
  });

  // Validate incoming data
  if (!status || !techguid) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!candidate) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  try {
    
    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        techguid
      },
    })

    if(!jobApplication) {
      return NextResponse.json({ error: "No job found with this techguid" }, { status: 500 });
    }

    // Update the job application status using the job application ID
    const updateApplication = await prisma.jobApplication.update({
      where: { id: jobApplication.id },
      data: {
        status: status,
      },
    });

    console.log(updateApplication);
    return NextResponse.json({ message: "Job updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
