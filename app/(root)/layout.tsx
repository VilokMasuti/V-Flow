import { ReactNode } from "react";

import Navbar from "@/components/Nav/Index";
import LeftNav from "@/components/Nav/SideBar/LeftNav";
import RightNav from "@/components/Nav/SideBar/RightNav";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="background-light850_dark100 realtive">
      <Navbar />
      <div className="flex">
        <LeftNav />
        <section className="flex min-h-screen min-w-0 flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full min-w-0 max-w-5xl">{children}</div>
        </section>

        <RightNav />
      </div>
    </main>
  );
};

export default RootLayout;
