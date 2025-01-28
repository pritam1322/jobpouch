
import authOptions from "@/lib/authOptions";
import { prisma } from "@/trpc-server/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  const body = await request.json();
  const { emailbody, emailId } = body;

  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access, user not logged in." }, { status: 401 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt: string = `You are a job application assistant. Given the following email, please extract the job application details:

    Email Body: ${emailbody}

    Please return the job title, company name, status, referralPerson(this is email), referralPersonName, jobLink, salaryRange, followup and any other relevant details about the job application.
    job title, company name, status (Applied, Accepted, Interview, Offer, Rejected) are required.

    Job Model is as followed :
    model JobApplication {
        id                 Int      @id @default(autoincrement())
        candidateId        Int // Foreign key for the User
        jobTitle           String
        companyName        String
        status             String // e.g., Applied, Interviewing, Offer, etc.
        appliedDate        DateTime @default(now())
        referralPerson     String?
        referralPersonName String?
        jobLink            String?
        techguid           String?
        salaryRange        String?
        followupDate       DateTime @default(now())
    
        User User @relation(fields: [candidateId], references: [id]) // Relation to User model
    }
    If field is not provided then send '' back
    Note: The model may not always generate perfect results, but it should be sufficient for basic job application details.`;

    const result = await model.generateContent(prompt); // Await the response from the AI model

    // Parse the result into individual fields (you might need to adjust this based on the actual response format)
    const text = result.response.text();
    console.log('@@@@@@' + text);
    // Assuming that `text` contains the job application information in a structured way
    const jobDetails = parseJobDetails(text);
    console.log('@@@@@@jobDetails' + JSON.stringify(jobDetails));
    // Save the job application data to the database using Prisma
    if(!jobDetails.jobTitle || !jobDetails.companyName || !jobDetails.status){
        return NextResponse.json({ error: "Incomplete job application details." }, { status: 400 });
    }
    await prisma.jobApplication.create({
      data: {
        candidateId: Number(session.user.id), // Assuming session has the user's ID
        jobTitle: jobDetails.jobTitle,
        companyName: jobDetails.companyName,
        status: jobDetails.status,
        referralPerson: jobDetails.referralPerson ?? '',
        referralPersonName: jobDetails.referralPersonName ?? '',
        jobLink: jobDetails.jobLink ?? '',
        salaryRange: jobDetails.salaryRange ?? '',
        followupDate: jobDetails.followupDate && !isNaN(new Date(jobDetails.followupDate).getTime()) ? new Date(jobDetails.followupDate) : new Date(),
      },
    });

    await prisma.email.delete({
        where: { id: emailId },
    })



    return NextResponse.json({ message: 'Job application saved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

// Helper function to parse job details from the AI's text response
function parseJobDetails(text: string) {
  // Extract values from the structured text using regex or string parsing

  const jobTitle = extractField(text, "jobTitle");
  const companyName = extractField(text, "companyName");
  const status = extractField(text, "status");
  const referralPerson = extractField(text, "referralPerson");
  const referralPersonName = extractField(text, "referralPersonName");
  const jobLink = extractField(text, "jobLink");
  const salaryRange = extractField(text, "salaryRange");
  const followupDate = extractField(text, "followupDate");

  return {
    jobTitle,
    companyName,
    status,
    referralPerson,
    referralPersonName,
    jobLink,
    salaryRange,
    followupDate,
  };
}

// Function to extract field from the text based on a label (e.g., "Job Title:")// Function to extract field from the text based on a label (e.g., "Job Title:")
function extractField(text: string, label: string) {
    const regex = new RegExp(`${label}\\s*[:]?\\s*(.*)`); // Match label followed by the value
    const match = text.match(regex);
  
    if (match) {
      let fieldValue = match[1].trim(); // Extract the value and remove spaces
  
      // Step 1: Clean up any unwanted characters like ': "'
      fieldValue = fieldValue.replace(/^":\s*"|",$/g, '').trim(); // Removes any leading ': "' and trailing ',"'
      
      // Step 2: Clean up unwanted '**'
      fieldValue = fieldValue.replace(/\*\*/g, '').trim();
  
      // Step 3: Handle invalid placeholder values (e.g., 'Not provided in the email')
      const invalidValues = [
        'Not provided in the email',
        'No specific followup date mentioned',
        'Not provided',
        'Not available',
        'No followup information provided in the email',
        '(Not provided in the email)',
        '(Not mentioned in the email)',
        '(Not provided)',
        '(Not available)',
        '(No specific followup date mentioned)',
        '(Not mentioned)',
        '(No followup information provided in the email)',
        `''`
      ];
  
      if (invalidValues.some(invalidValue => fieldValue.includes(invalidValue))) {
        return null; // Replace invalid placeholders with null (or '' if you prefer empty strings)
      }
  
      return fieldValue;
    }
  
    return null; // Return null if the label is not found
  }
  
  
  
