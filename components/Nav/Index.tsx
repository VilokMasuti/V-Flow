import { auth } from "@/auth";
import Image from 'next/image';
import Link from "next/link";
import GobalSearch from '../search/GobalSearch';
import UserChip from '../UserChip';
import MobileNavigation from "./MobileNav";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between  z-50  w-full gap-5 p-6  shadow-md   fixed top-0   left-0 h-20  border-b border-[#aa1010]  [border-image:linear-gradient(90deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1] sm:px-12">
     <Link href="/" className="flex items-center  ">

 <Image
 width={110}
 height={110}
  src="/logo.png"
  alt="DevFlow Logo"
  className=" object-contain"
/>




</Link>
 <div className='flex-between gap-5 '>
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
