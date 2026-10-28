import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ShopProvider from "@/app/components/shop/ShopProvider";
import StoreProvider from "@/app/store/StoreProvider";
import LastPageTracker from "@/app/components/auth/LastPageTracker";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});


export const metadata: Metadata = {
  title: {
    default: "Northline",
    template: "%s | Northline",
  },
  description: "Cửa hàng trực tuyến demo (làm đẹp, nước hoa, nội thất, thực phẩm) xây dựng bằng Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      {/* Tiện ích trình duyệt (Grammarly, ColorZilla...) thêm thuộc tính vào <body> trước khi React tải xong. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Redux store (giỏ hàng) và state danh sách yêu thích, dùng chung cho header và các trang. */}
        {/* Ghi nhớ trang hiện tại để trang đăng nhập quay lại được. Có Suspense riêng: nó đọc query string. */}
        <Suspense fallback={null}>
          <LastPageTracker />
        </Suspense>
        <StoreProvider>
          <ShopProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </ShopProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
