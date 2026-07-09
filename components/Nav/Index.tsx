import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import GobalSearch from '../search/GobalSearch';
import { EncryptedText } from '../ui/encrypted-text';
import UserChip from '../UserChip';
import MobileNavigation from "./MobileNav";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between fixed z-50 w-full gap-5 p-6  shadow-md  bg-transparent   border-b border-[#aa1010]  [border-image:linear-gradient(90deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1] sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevFlow Logo"
        />
         <EncryptedText
        text=" DevFlow"
        encryptedClassName="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-neutral-900 "
        revealedClassName="dark:text-white text-black"
        revealDelayMs={50}
      />
      </Link>

      <div className=''>
        <GobalSearch/>
      </div>

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
