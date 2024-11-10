"use client";

import { RacingGame } from "@/components/racing-game";
import { useReadNFT } from "@/hooks/use-read-nft";
import { useStore } from "@/racing-game-r3f/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Challenge() {
  const [isGameAllowed] = useStore((s) => [s.isGameAllowed]);
  const router = useRouter();

  useEffect(() => {
    if (!isGameAllowed) {
      router.push("/");
    }
  }, [isGameAllowed]);

  return isGameAllowed ? <RacingGame /> : null;
}
