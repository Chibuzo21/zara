// app/(production)/layout.tsx  or wherever your production pages live
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.users.viewer);

  if (user === undefined)
    return <div className='p-8 text-center'>Loading...</div>;

  if (user === null || user.role !== "production") {
    return (
      <div className='p-8 text-center'>
        <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
        <p className='text-gray-600 mt-2'>
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
