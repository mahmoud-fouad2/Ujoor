"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadMobileAuth } from "@/lib/mobile/web-client";

export default function MobileIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = loadMobileAuth();
    router.replace(auth?.accessToken ? "/m/home" : "/m/login");
  }, [router]);

  return null;
}
