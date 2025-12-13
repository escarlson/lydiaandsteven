import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css"
import Header from "./components/Header";
import BootstrapClient from "./components/BootstrapClient";

export const metadata: Metadata = {
  title: "Lydia & Steven",
  description: "The wedding of Lydia O'Reilly and Steven Carlson.",
};

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <Header />
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
