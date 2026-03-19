import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TabGuardian",
  description: "Your simple and reliable medication reminder and proof system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
