import { generateResetToken } from "@/components/token/generateResetToken";
import SendMail from "@/server/mailer";
import { prisma } from "@/trpc-server/prisma";

import { NextResponse } from "next/server";

export async function POST(request : Request,){
    const body = await request.json();
    const { email } = body;

    if(!email){
        return NextResponse.json({ error: 'Field required' }, { status: 400 });
    }

    const resetToken = generateResetToken();
    const expires = new Date(Date.now() + 3600000); // 1-hour expiration
    console.log(resetToken);
    const pass = await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expires,
        },
      });
    await SendMail(email, resetToken);

    return NextResponse.json({message: ''},{ status: 201 });
}