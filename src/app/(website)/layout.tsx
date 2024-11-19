import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "@/lib/reactQuery-provider";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-neutral-900">
      <body>
        <SessionWrapper >
          <Provider>
            <Toaster />
            <Header />
            {children}
            <Analytics />
          </Provider>
        </SessionWrapper>
      </body>
    </html>
  );
}
