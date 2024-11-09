"use client";

import { leaderboardAbi, raceGridNftAbi } from "@/abis";
import { config } from "@/chains";
import { useAppContext } from "@/hooks/use-app-context";
import { setState, useStore } from "@/racing-game-r3f/store";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import { InstancedMesh } from "three";
import { Address } from "viem";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";

interface LeaderboardData {
  player: string;
  time: number;
  date: number;
}

export default function LeaderboardPage() {
  const [finished] = useStore((s) => [s.finished]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  const { sourceChain, userAddress } = useAppContext();

  const { writeContractAsync } = useWriteContract();

  const { data: leaderboardLength } = useReadContract({
    address: sourceChain?.leaderboard,
    abi: leaderboardAbi,
    functionName: "getResultsLength",
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain },
  });

  useEffect(() => {
    console.log(finished);
    setState({ finished: 0 });
  }, []);

  // TODO: verify this runs only once
  useEffect(() => {
    const getChunckedLeaderboardData = async () => {
      // TODO add chunking
    };

    getChunckedLeaderboardData();
  }, [leaderboardLength]);

  const onClickUpdateLeaderboard = async () => {
    // Currently open for hackathon. For any mainnet deployment `updateLeaderboard` should be updated to be `onlyOnwer`.
    const hash = await writeContractAsync({
      address: sourceChain?.leaderboard,
      abi: leaderboardAbi,
      functionName: "updateLeaderboard",
      args: [userAddress as Address, BigInt(finished)],
      chainId: sourceChain?.definition?.id,
    });
    await waitForTransactionReceipt(config, {
      hash,
      chainId: sourceChain?.definition?.id,
    });

    // TODO: handle sorting on init and in-memory updates
    const newLeaderboardItem = {
      player: userAddress,
      time: finished,
      date: Math.floor(Date.now() / 1000),
    } as LeaderboardData;
    setLeaderboardData([...leaderboardData, newLeaderboardItem]);
  };

  return (
    <div>
      <div>Congratulations!</div>
      <div>You've finished the race in xyz</div>
      <button onClick={onClickUpdateLeaderboard}>UPDATE LEADERBOARD</button>

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
          {leaderboardData.map((item) => (
            <tr key={`${item.player}-${item.date}`}>
              <td>{item.player}</td>
              <td>gold</td>
              <td>{item.time}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
