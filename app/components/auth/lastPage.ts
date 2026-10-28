// Trang người dùng đang xem trước khi vào /login, lưu trong localStorage
// để sau khi đăng nhập thì quay lại đó (ví dụ "/products?category=beauty&page=2").
export const LAST_PAGE_KEY = "lastPage";

// /login và /register không bao giờ được lưu: quay lại chúng sau khi đăng nhập là vô nghĩa.
function isAuthPage(path: string) {
  return /^\/(login|register)(\/|\?|$)/.test(path);
}

// Chỉ nhận đường dẫn trong trang này: "/..." nhưng không phải "//other-site.com" (sẽ thành open redirect).
function isSafePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !isAuthPage(path);
}

export function saveLastPage(path: string) {
  if (isSafePath(path)) localStorage.setItem(LAST_PAGE_KEY, path);
}

// Đọc trang đã lưu một lần (rồi xóa đi) để chuyển hướng sau khi đăng nhập. Mặc định là "/".
export function takeLastPage() {
  const path = localStorage.getItem(LAST_PAGE_KEY);
  localStorage.removeItem(LAST_PAGE_KEY);
  return path && isSafePath(path) ? path : "/";
}
