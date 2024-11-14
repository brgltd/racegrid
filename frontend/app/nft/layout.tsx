import { Metadata } from "next";
import Page from "./page";

export const metadata: Metadata = {
  title: "Race Grid | Mint NFT",
  description: "Mint your own car NFT with Race Grid",
};

export default function Layout() {
  return <Page />;
}
