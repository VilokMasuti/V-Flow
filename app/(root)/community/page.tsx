import type { Metadata } from "next";


import UserCard from '@/components/cards/UserCard';
import CommonFilter from '@/components/filters/CommonFilter';
import Pagination from '@/components/Pagination';
import LocalSearch from '@/components/search/LocalSearch';
import DataRenderer from '@/components/ui/DataRenderer';
import { UserFilters } from '@/constants/Filter';
import ROUTES from '@/constants/routes';
import { EMPTY_USERS } from '@/constants/states';
import { getUsers } from '@/lib/actions/user.action';

export const metadata: Metadata = {
  title: "Community | V-Flow",
  description: "Discover developers and community members on V-Flow.",
  openGraph: {
    title: "Community | V-Flow",
    description: "Discover developers and community members on V-Flow.",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "V-Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | V-Flow",
    description: "Discover developers and community members on V-Flow.",
    images: ["/images/logo.png"],
  },
};

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  })
  const { users, isNext } = data || {};
  return (
          <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="There are some great devs here!"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={UserFilters}
          otherClasses=' min-h-[49px] sm:min-w-[170px]'
        />

      </div>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
      <Pagination isNext={isNext || false} page={page} containerClasses=' mt-12' />
    </div>

  )
}
export default Community;
