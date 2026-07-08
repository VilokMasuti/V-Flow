import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import UserChip from '../UserChip';
import MobileNavigation from "./MobileNav";


const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 border-b p-6 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevFlow Logo"
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5 max-sm:hidden">
        {session?.user?.id && (
          <UserChip
            id={session.user.id}
            name={session.user.name ?? "User"}
            email={session.user.email ?? ""}
            image={session.user.image}
            expires={session.expires}
          />
        )}

      </div>
       <MobileNavigation />
    </nav>
  );
};

export default Navbar;
