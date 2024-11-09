"use client";

import { raceGridNftAbi } from "@/abis";
import { useAppContext } from "@/hooks/use-app-context";
import { setState, useStore } from "@/racing-game-r3f/store";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

export default function LeaderboardPage() {
  const [finished] = useStore((s) => [s.finished]);

  const { sourceChain } = useAppContext();

  // to handle chunking and sorting might need to use viem directly
  // const { data: userToken } = useReadContract({
  //   address: sourceChain?.raceGridNFT,
  //   abi: raceGridNftAbi,
  //   functionName: "getResultsPaginated",
  //   // @ts-ignore
  //   args: [userAddress],
  //   chainId: sourceChain?.definition?.id,
  //   query: { enabled: !!sourceChain },
  // });

  useEffect(() => {
    const getChunckedLeaderboardData = async () => {
      // TODO
    };

    console.log(finished);
    setState({ finished: 0 });
    getChunckedLeaderboardData();
  }, []);

  return (
    <div>
      <div>Congratulations!</div>
      <div>You've finished the race in xyz</div>
      <button>UPDATE LEADERBOARD</button>

      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Medal</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>x</td>
            <td>x</td>
            <td>x</td>
            <td>x</td>
          </tr>
          <tr>
            <td>x</td>
            <td>x</td>
            <td>x</td>
            <td>x</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
