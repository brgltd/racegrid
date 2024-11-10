"use client";

import { leaderboardAbi } from "@/abis";
import { config } from "@/chains";
import { Chains, getLeaderboardContract } from "@/ethers";
import { useAppContext } from "@/hooks/use-app-context";
import { setState, useStore } from "@/racing-game-r3f/store";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { BigNumber } from "ethers";

interface LeaderboardData {
  player: string;
  time: number;
  date: number;
  timestamp: number;
}

// type IntermediaryLeaderboardData = Omit<LeaderboardData, "date">

interface Hex {
  type: "BigNumber";
  hex: string;
}

type LeaderboardResponse = [string, Hex, Hex];

function formatLeaderboardData(leaderboardData: LeaderboardData) {
  const fullAddress = leaderboardData.player;
  const readableAddress = `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
  return {
    ...leaderboardData,
    player: readableAddress,
  };
}

function parseLeaderboardResponse(
  leaderboardResponse: LeaderboardResponse[],
): LeaderboardData[] {
  return leaderboardResponse.map((item) => {
    const timestamp = BigNumber.from(item[2]).toNumber();
    const leaderboardData = {
      player: item[0],
      time: BigNumber.from(item[1]).toNumber(),
      date: timestamp,
      timestamp,
    };
    return formatLeaderboardData(leaderboardData);
  });
}

function sortLeaderboardData(leaderboardData: LeaderboardData[]) {
  leaderboardData.sort((a, b) => a.timestamp - b.timestamp);
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
    setState({ finished });
  }, []);

  useEffect(() => {
    const getChunckedLeaderboardData = async () => {
      // TODO add chunking

      // TODO: get chains dinamically from sourceChain
      const leaderboardResponse = await getLeaderboardContract(
        Chains.Anvil,
      ).getResultsPaginated(0, BigNumber.from(leaderboardLength));
      const parsedLeaderboardResponse =
        parseLeaderboardResponse(leaderboardResponse);
      sortLeaderboardData(parsedLeaderboardResponse);
      setLeaderboardData(parsedLeaderboardResponse);
    };

    console.log({ leaderboardLength });
    if (leaderboardLength !== undefined) {
      getChunckedLeaderboardData();
    }
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

    const timestampSeconds = Math.floor(Date.now() / 1000);
    const newLeaderboardItem = {
      player: userAddress,
      time: finished,
      date: timestampSeconds,
      timestamp: timestampSeconds,
    } as LeaderboardData;
    const formattedNewLeaderboardItem =
      formatLeaderboardData(newLeaderboardItem);
    const newLeaderboardData = [
      ...leaderboardData,
      formattedNewLeaderboardItem,
    ];
    sortLeaderboardData(newLeaderboardData);
    setLeaderboardData([...leaderboardData, newLeaderboardItem]);
  };

  return (
    <div>
      {!!finished && (
        <>
          <div>Congratulations!</div>
          <div>You've finished the race in {finished}</div>
          <button onClick={onClickUpdateLeaderboard}>UPDATE LEADERBOARD</button>
        </>
      )}

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
