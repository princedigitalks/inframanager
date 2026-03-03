"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D31A6]"></div>
    </div>
  );
}
