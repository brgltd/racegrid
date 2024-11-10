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
import { format } from "date-fns";

interface BaseLeaderboard {
  player: string;
  timestamp: number;
}

interface IntermediaryLeaderboard extends BaseLeaderboard {
  time: number;
}

interface FormattedLeaderboard extends BaseLeaderboard {
  time: string;
  date: string;
}

interface Hex {
  type: "BigNumber";
  hex: string;
}

type LeaderboardResponse = [string, Hex, Hex];

function formatRaceDurationToSeconds(miliseconds: number) {
  return `${Math.floor(miliseconds / 1000)} seconds`;
}

function formatRaceDurationToLongText(miliseconds: number) {
  const seconds = Math.floor(miliseconds / 1000);
  const fullMinutes = seconds / 60;
  const flooredMinutes = Math.floor(fullMinutes);
  const decimalsMinutes = fullMinutes - flooredMinutes;
  const fullSeconds = decimalsMinutes * 60;
  const flooredSeconds = Math.floor(fullSeconds);
  return `${flooredMinutes} minutes ${flooredSeconds} seconds`;
}

function formatLeaderboardData(
  leaderboardData: IntermediaryLeaderboard,
): FormattedLeaderboard {
  const fullAddress = leaderboardData.player;
  const readableAddress = `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
  return {
    ...leaderboardData,
    player: readableAddress,
    date: format(leaderboardData.timestamp * 1000, "dd MMM yyyy"),
    time: formatRaceDurationToSeconds(leaderboardData.time),
  };
}

function parseLeaderboardResponse(
  leaderboardResponse: LeaderboardResponse[],
): FormattedLeaderboard[] {
  return leaderboardResponse.map((item) => {
    const timestamp = BigNumber.from(item[2]).toNumber();
    const leaderboardData: IntermediaryLeaderboard = {
      player: item[0],
      time: BigNumber.from(item[1]).toNumber(),
      timestamp,
    };
    return formatLeaderboardData(leaderboardData);
  });
}

function sortLeaderboardData(leaderboardData: FormattedLeaderboard[]) {
  return [...leaderboardData].sort((a, b) => a.timestamp - b.timestamp);
}

export default function LeaderboardPage() {
  const [finished] = useStore((s) => [s.finished]);

  const [formattedLeaderboard, setFormattedLeaderboard] = useState<
    FormattedLeaderboard[]
  >([]);

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
      const sortedLeaderboardData = sortLeaderboardData(
        parsedLeaderboardResponse,
      );
      setFormattedLeaderboard(sortedLeaderboardData);
    };

    if (leaderboardLength) {
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
    const newLeaderboardItem: IntermediaryLeaderboard = {
      player: userAddress as string,
      time: finished,
      timestamp: timestampSeconds,
    };
    const formattedNewLeaderboardItem =
      formatLeaderboardData(newLeaderboardItem);
    const newLeaderboardData = [
      ...formattedLeaderboard,
      formattedNewLeaderboardItem,
    ];
    const sortedLeaderboardData = sortLeaderboardData(newLeaderboardData);
    setFormattedLeaderboard(sortedLeaderboardData);
  };

  return (
    <div>
      {!!finished && (
        <>
          <div>Congratulations!</div>
          <div>
            You've finished the race in {formatRaceDurationToLongText(finished)}
          </div>
          <button onClick={onClickUpdateLeaderboard}>UPDATE LEADERBOARD</button>
        </>
      )}

      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Medal</th>
            <th>Duration</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {formattedLeaderboard.map((item) => (
            <tr key={`${item.player}-${item.timestamp}`}>
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
