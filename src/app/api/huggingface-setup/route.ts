import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

  
export function parseGeneratedContent(content: string): { emailContent: string, linkedinDMContent: string } {
const [emailContent, linkedinDMContent] = content.split("**Option 2: LinkedIn DM**");

return {
    emailContent: emailContent.replace("**Option 1: Email**", "").trim(),
    linkedinDMContent: linkedinDMContent.trim()
};
}
  

export async function POST(req: Request) {
  try {
    const { jobRole, companyName, personalMessage } = await req.json();

    // Validate required fields
    if (!jobRole || !companyName || !personalMessage) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const prompt = `
    Write a professional email/LinkedIn DM for someone applying for the role of ${jobRole} at ${companyName}.
    Include the following personal message: "${personalMessage}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const { emailContent, linkedinDMContent } = parseGeneratedContent(result.response.text());
    console.log(emailContent, linkedinDMContent);
    return NextResponse.json({ message: 'Content generated successfully', emailContent,  linkedinDMContent}, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}