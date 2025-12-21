import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.scss";

const urabnist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Learn App",
  description: "Find exclusive courses for all your learning needs!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urabnist.className}>
        {children}
      </body>
    </html>
  );
}
