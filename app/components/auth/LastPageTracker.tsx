"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { saveLastPage } from "@/app/components/auth/lastPage";

// Saves the current page (path + query) to localStorage every time the URL changes.
// Every way of reaching /login (header link, "login required" redirects, an expired token...)
// then finds the previous page already saved, and the login page can go back to it.
// Rendered in app/layout.tsx inside its own <Suspense>, because useSearchParams needs one.
export default function LastPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    saveLastPage(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
