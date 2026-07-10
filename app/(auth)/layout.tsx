import Image from "next/image";
import { ReactNode } from "react";

import SocialAuthForm from "@/components/auth/SocialAuthForm";
import LineHoverLink from '@/components/ui/line-hover-link';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className=" flex min-h-screen items-center justify-center z-10   px-4 py-10 relative">
  <div className="absolute inset-0  z-0 pointer-events-none">
  <Image
    src="/images/auth-dark.png"
    alt="logo"
    fill
    className="object-cover opacity-40"
  />
  </div>

      <section className=" bg-dark-100  min-w-full  [border-image:linear-gradient(180deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1] border px-4 py-10  sm:min-w-[520px] sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <LineHoverLink
            variant='scribble'>
 <h1 className=" uppercase   font-cabinet primary-text-gradient   ">Join       DevFlow</h1>

            </LineHoverLink>

            <p className="paragraph-regular  text-sm text-neutral-500">To get your questions answered</p>
          </div>
          <Image src="/logo.png" alt="DevFlow Logo" width={110} height={110} className="object-contain" />
        </div>

        {children}

        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
