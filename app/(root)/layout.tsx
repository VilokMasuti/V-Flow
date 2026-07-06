import Navbar from "@/components/Nav/Index";
import LeftSidebar from "@/components/Nav/SideBar/LeftNav";
import RightSidebar from "@/components/Nav/SideBar/RightNav";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="   background-light800_darkgradient relative w-full">
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
