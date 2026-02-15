import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mao ❤️ Pi - 我们的爱情纪念册",
  description: "记录我们一起走过的每一个美好瞬间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
