import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

const DASHBOARDS: Record<string, string> = {
  owner: "/dashboard/owner",
  admin: "/dashboard/owner",
  sales: "/dashboard/sales",
  transport_sales: "/dashboard/sales",
  production: "/dashboard/production",
  packaging: "/dashboard/packaging",
};

export function useRoleGuard(allowedRoles: string[]) {
  const user = useQuery(api.users.viewer);
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role ?? "")) {
      router.replace(DASHBOARDS[user.role ?? ""] ?? "/login");
    }
  }, [user, router]);

  return {
    user,
    isAllowed:
      user !== undefined &&
      user !== null &&
      allowedRoles.includes(user.role ?? ""),
    isLoading: user === undefined,
  };
}
