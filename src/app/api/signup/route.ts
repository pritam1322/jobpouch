import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { prisma } from '@/trpc-server/prisma';


export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(password, salt);

  // Create a new user
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name
    },
  });

  // Respond with the created user (omit the password for security)
  return NextResponse.json({ user: { id: user.id, email: user.email , name: user.name} }, { status: 201 });
}
