import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mao ❤️ Yi - 我们的爱情纪念册",
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
        {children}
      </body>
    </html>
  );
}
