"use client";

import { leaderboardAbi } from "@/abis";
import { config } from "@/chains";
import { getLeaderboardContract } from "@/ethers";
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
  duration: number;
}

interface FormattedLeaderboard extends BaseLeaderboard {
  formattedDuration: string;
  date: string;
  key: number;
}

interface Hex {
  type: "BigNumber";
  hex: string;
}

type LeaderboardResponse = [string, Hex, Hex];

const CHUNCK_STEP = 2;

let counter = 0;

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
  leaderboardData: BaseLeaderboard,
): FormattedLeaderboard {
  const fullAddress = leaderboardData.player;
  const readableAddress = `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
  const formattedLeaderboard = {
    ...leaderboardData,
    player: readableAddress,
    date: format(leaderboardData.timestamp * 1000, "dd MMM yyyy"),
    formattedDuration: formatRaceDurationToSeconds(leaderboardData.duration),
    key: counter,
  };
  ++counter;
  return formattedLeaderboard;
}

function parseLeaderboardResponse(
  leaderboardResponse: LeaderboardResponse[],
): FormattedLeaderboard[] {
  return leaderboardResponse.map((item) => {
    const timestamp = BigNumber.from(item[2]).toNumber();
    const leaderboardData: BaseLeaderboard = {
      player: item[0],
      duration: BigNumber.from(item[1]).toNumber(),
      timestamp,
    };
    return formatLeaderboardData(leaderboardData);
  });
}

function sortLeaderboardData(leaderboardData: FormattedLeaderboard[]) {
  return [...leaderboardData].sort((a, b) => a.duration - b.duration);
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
      const leaderboardLengthNumber = Number(leaderboardLength);
      const aggregatedLeaderboardData: FormattedLeaderboard[] = [];
      for (let i = 0; i < leaderboardLengthNumber; i += CHUNCK_STEP) {
        const endIndex = Math.min(i + CHUNCK_STEP, leaderboardLengthNumber);
        const leaderboardResponse = await getLeaderboardContract(
          sourceChain?.name,
        ).getResultsPaginated(i, endIndex);
        const parsedLeaderboardResponse =
          parseLeaderboardResponse(leaderboardResponse);
        aggregatedLeaderboardData.push(...parsedLeaderboardResponse);
      }
      const sortedLeaderboardData = sortLeaderboardData(
        aggregatedLeaderboardData,
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
    const newLeaderboardItem: BaseLeaderboard = {
      player: userAddress as string,
      duration: finished,
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
          <button onClick={onClickUpdateLeaderboard}>
            ADD MY RACE TO THE LEADERBOARD
          </button>
        </>
      )}

      {!formattedLeaderboard.length ? (
        <div>No results present on the leaderboard yet!</div>
      ) : (
        <div>
          <h1>Leaderboard</h1>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Medal</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {formattedLeaderboard.map((item, index) => (
                <tr key={item.key}>
                  <td>{index + 1}</td>
                  <td>{item.player}</td>
                  <td>gold</td>
                  <td>{item.formattedDuration}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
