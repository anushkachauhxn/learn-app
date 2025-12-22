import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { UserProvider } from "../contexts/UserContext";
import Navbar from "../components/Navbar";
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
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
