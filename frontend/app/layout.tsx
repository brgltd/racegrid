import { AppLayout } from "@/components/app-layout";
import type { Metadata } from "next";

// TODO: add seo
export const metadata: Metadata = {
  title: "title",
  description: "description",
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
