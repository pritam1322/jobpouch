import bcrypt from "bcryptjs";
import { prisma } from "@/trpc-server/prisma";
import { NextResponse } from "next/server";

export async function POST(request : Request,){
    const body = await request.json();
    const { token, password } = body;

    if(!password && !token){
        return NextResponse.json({ error: 'Field required' }, { status: 400 });
    }

    const pass = await prisma.passwordResetToken.findUnique({
        where: {token: token}
    })

    if(!pass?.email){
        throw new Error('Invalid email');
    }

    if(pass?.expires && pass.expires < new Date()){
        throw new Error('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    pass?.email && await prisma.user.update({
        where: { email: pass.email },
        data: { password: hashedPassword }
    });
    return NextResponse.json({message: 'Password updated successfull'},{ status: 201 });
}