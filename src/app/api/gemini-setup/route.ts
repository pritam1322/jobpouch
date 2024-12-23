import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request : Request){

    const body = await request.json();
    let { prompt } = body;

    const session = await getSession();

    // Check if the user is authenticated
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized access, user not logged in." }, { status: 401 });
    }

    try{
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        //const prompt = "Explain how AI works";
        if(!prompt){
            return NextResponse.json({ message: 'Prompt is required' }, {status: 400});
        }
        prompt = 'Summarize the following job description by identifying and categorizing the key requirements, responsibilities, preferred skills, and job perks. Provide a clear, concise overview of the job. Add following points 1-**Key Requirements:** 2-**Responsibilities:** 3-**Job Overview:** 4-**Keywords:**. Job Description: {' + prompt + ' }';
        const result = await model.generateContent(prompt);

        const { keyRequirements, responsibilities, jobOverview, keywords } = parseContent(result.response.text());
        
        return NextResponse.json({ message: 'Content generated successfully', keyRequirements, responsibilities, jobOverview, keywords }, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({message: 'Internal server error', error }, {status: 500});
    }
};


const parseContent = (content: string) => {
    // Helper function to extract a specific section by its label
    const extractSection = (label: string, isKeywords = false) => {
        const regex = new RegExp(`(?<=\\*\\*${label}:\\*\\*\\n)(.*?)(?=\\n\\*\\*|$)`, "s");
        const match = content.match(regex)?.[0]?.trim() || "";

        if (isKeywords) {
            // For keywords, split by commas and trim whitespace
            return match.split(",").map((keyword) => keyword.trim());
        }

        // For other sections, handle bullet points
        return match
            .split("\n")
            .filter((item) => item.trim().startsWith("*"))
            .map((item) => item.replace("* ", "").trim());
    };

    return {
        keyRequirements: extractSection("1- Key Requirements"),
        responsibilities: extractSection("2- Responsibilities"),
        jobOverview: content.match(/(?<=\*\*3- Job Overview:\*\*\n)(.*?)(?=\n\*\*|$)/s)?.[0]?.trim() || "",
        keywords: extractSection("4- Keywords", true),
    };
};


  