"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";
import { toast } from "sonner";

const SocialAuthForm = () => {
  const buttonClass =
    "   cursor-pointer  background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
      toast.success("Login successful");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong ", {
        description: "please try again later wrong with O-Auth p",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>

      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image src="/icons/google.svg" alt="Google Logo" width={20} height={20} className="mr-2.5 object-contain" />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
