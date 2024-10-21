import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import bcrypt from "bcryptjs";
import { prisma } from '@/trpc-server/prisma';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex'); // Generate a random salt
  const hash = createHash('sha256').update(salt + password).digest('hex'); // Hash the salt + password
  return `${salt}:${hash}`; // Store the salt and hash together
}

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
