// The page the user was on before going to /login, saved in localStorage
// so that after logging in they come back to it (e.g. "/products?category=beauty&page=2").
export const LAST_PAGE_KEY = "lastPage";

// /login and /register are never saved: coming back to them after logging in makes no sense.
function isAuthPage(path: string) {
  return /^\/(login|register)(\/|\?|$)/.test(path);
}

// Only paths inside this site: "/..." but not "//other-site.com" (that would be an open redirect).
function isSafePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !isAuthPage(path);
}

export function saveLastPage(path: string) {
  if (isSafePath(path)) localStorage.setItem(LAST_PAGE_KEY, path);
}

// Read the saved page once (it is removed), for the redirect after logging in. Falls back to "/".
export function takeLastPage() {
  const path = localStorage.getItem(LAST_PAGE_KEY);
  localStorage.removeItem(LAST_PAGE_KEY);
  return path && isSafePath(path) ? path : "/";
}
