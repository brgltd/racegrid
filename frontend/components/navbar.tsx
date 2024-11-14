"use client";

import { cn } from "@/utils/cn";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isChallengePage = pathname === "/challenge";
  const isHomepage = pathname === "/";
  const isMintPage = pathname === "/nft";
  const isLeaderboardPage = pathname === "/leaderboard";
  const baseItemStyle =
    "mr-12 hover-glow hover:text-blue-400 transition-all border-t-2 border-transparent";
  const activeItemStyle = "border-t-2 border-white";
  return isChallengePage ? null : (
    <nav>
      <ul className="flex lg:flex-row flex-col lg:items-center mt-6 mb-16 justify-center">
        <ul className="flex flex-row flex-wrap mb-8 lg:mb-0 gap-y-6">
          <li className={cn(baseItemStyle, isHomepage ? activeItemStyle : "")}>
            <Link href="/">RACEGRID</Link>
          </li>
          <li className={cn(baseItemStyle, isMintPage ? activeItemStyle : "")}>
            <Link href="/nft">MINT NFT</Link>
          </li>
          <li
            className={cn(
              baseItemStyle,
              isLeaderboardPage ? activeItemStyle : "",
            )}
          >
            <Link href="/leaderboard">LEADERBOARD</Link>
          </li>
        </ul>
        <li className="lg:ml-auto">
          <ConnectButton
            chainStatus="full"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </li>
      </ul>
    </nav>
  );
}
