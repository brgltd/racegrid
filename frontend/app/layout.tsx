import { AppLayout } from "@/components/app-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Race Grid | Home",
  description: "Blockchain racing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `AppLayout` is a client component while `RootLayout` is a
  // server component to allow SEO metadata.
  return <AppLayout>{children}</AppLayout>;
}
