import Navbar from "@/components/Nav/Index";

import LeftSidebar from "@/components/Nav/SideBar/LeftNav";
import RightSidebar from "@/components/Nav/SideBar/RightNav";
import { Metadata } from 'next';
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "All Questions",
  description:
    "Browse and search all programming questions on DevFlow. Find expert answers on React, TypeScript, Node.js, and more.",
  openGraph: {
    title: "All Questions | DevFlow",
    description:
      "Browse and search all programming questions on DevFlow. Find expert answers on React, TypeScript, Node.js, and more.",
    siteName: "DevFlow",   // ← MUST repeat this in every child openGraph block
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="  background-light850_dark100  relative w-full">
      <Navbar />

      <div className="flex min-w-0">
        <LeftSidebar />

        <section className="flex min-h-screen min-w-0 flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl min-w-0">{children}</div>
        </section>

        <RightSidebar />
      </div>
    </main>
  );
};

export default RootLayout;
