import { Metadata } from "next";
import Page from "./page";

export const metadata: Metadata = {
  title: "Race Grid | Leaderboard",
  description: "Leaderboard list for Race Grid challenges.",
};

export default function Layout() {
  return <Page />;
}
