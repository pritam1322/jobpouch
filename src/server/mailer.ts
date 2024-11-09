import { prisma } from '@/trpc-server/prisma';
import { console } from 'inspector';
import nodemailer from 'nodemailer';

export default async function SendMail(email : string, token: string){
    console.log(email);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const confirmLink = `${baseUrl}/reset-password/${token}`;
    const user = await prisma.user.findUnique({ where: { email} })
    console.log(user);
    const html = `
    <p>Here's your password recovery link</p>
    <a href="${confirmLink}">Reset password here</a>
    <p>Best regards, Libertas</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_ACCOUNT_USER,
      pass: process.env.GOOGLE_ACCOUNT_PASS,
    },
  });

  console.log(transporter);

    if (user) {
    // sending email with nodemailer
        const info = await transporter.sendMail({
        from: '"Pritam" <pritamjat98@gmail.com>', // sender address
        to: email,
        subject: `Reset your password`, // Subject line
        html: html, // html body
        });
    }
}

