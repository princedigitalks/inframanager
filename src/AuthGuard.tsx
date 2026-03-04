"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "./store/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (token && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [token, pathname, router, mounted]);

  if (!mounted) {
    return null;
  }

  if (!token && pathname !== "/login") {
    return null;
  }

  if (token && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
