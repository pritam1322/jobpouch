// src/app/api/fetchAndDisplayEmailsBySubject/getGmailEmailsBySubject.ts
import authOptions from "@/lib/authOptions";
import { prisma } from "@/trpc-server/prisma";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken, subject, maxNoOfEmail, refreshToken } = await req.json();

    if (!accessToken || !subject || !maxNoOfEmail || !refreshToken) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

    // Check if token is valid
    let tokenInfo = await auth.getTokenInfo(accessToken).catch(() => null);
    if (!tokenInfo) {
      console.log("Access token expired. Refreshing...");

      try {
        const { credentials } = await auth.refreshAccessToken();
        if (!credentials.access_token) {
          return NextResponse.json({ error: "Failed to refresh access token" }, { status: 401 });
        }
        auth.setCredentials(credentials);
        tokenInfo = await auth.getTokenInfo(credentials.access_token);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return NextResponse.json({ error: "Failed to refresh access token" }, { status: 401 });
      }
    }

    const gmail = google.gmail({ version: "v1", auth });

    // Fetch emails by subject
    const response = await gmail.users.messages.list({
      userId: "me",
      q: `subject:"${subject}"`, // Ensures better filtering
      maxResults: Number(maxNoOfEmail),
    });

    const messages = response.data.messages || [];
    if (messages.length === 0) {
      return NextResponse.json({ messages: [], message: "No new emails found" });
    }

    let newEmails: any[] = [];
    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
      });

      const snippet = email.data.snippet || "No content available";
      const emailSubject = email.data.payload?.headers?.find((header) => header.name === "Subject")?.value || subject;

      console.log('@@@@@' + JSON.stringify(email.data));
      console.log('@@@@@' + email.data.raw);
      // Check if email already exists in the database
      const existingEmail = await prisma.email.findUnique({
        where: { gmailId: message.id! },
      });

      if (!existingEmail) {
        const savedEmail = await prisma.email.create({
          data: {
            gmailId: message.id!,
            subject: emailSubject,
            snippet,
            userId: Number(session?.user.id),
          },
        });
        newEmails.push(savedEmail);
      }
    }

    return NextResponse.json({ messages: newEmails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
