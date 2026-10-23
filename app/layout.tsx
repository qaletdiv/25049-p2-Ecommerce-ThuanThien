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
      {/* Browser extensions (Grammarly, ColorZilla...) add attributes to <body> before React loads. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Redux store (cart) and wishlist state, shared by the header and the pages. */}
        {/* Remembers the current page so the login page can come back to it. Own Suspense: it reads the query string. */}
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
