"use client";

import { leaderboardAbi } from "@/abis";
import { config } from "@/wagmi";
import { getLeaderboardContract } from "@/ethers";
import { useAppContext } from "@/hooks/use-app-context";
import { setState, useStore } from "@/racing-game-r3f/store";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { BigNumber } from "ethers";
import { format } from "date-fns";
import { Button } from "@/components/button";
import { CircularProgress, Skeleton } from "@mui/material";

interface BaseLeaderboard {
  player: string;
  timestamp: number;
  duration: number;
}

interface FormattedLeaderboard extends BaseLeaderboard {
  formattedDuration: string;
  date: string;
  key: number;
  shortAddress: string;
}

interface Hex {
  type: "BigNumber";
  hex: string;
}

type LeaderboardResponse = [string, Hex, Hex];

const CHUNCK_STEP = 5;

const NUM_CALLS_TO_SLEEP = 20;

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
  return `${flooredMinutes > 0 ? `${flooredMinutes} minute${flooredMinutes > 1 ? "s" : ""} and ` : ""}${flooredSeconds} seconds`;
}

function formatLeaderboardData(
  leaderboardData: BaseLeaderboard,
): FormattedLeaderboard {
  const fullAddress = leaderboardData.player;
  const shortAddress = `${fullAddress.slice(0, 4)}...${fullAddress.slice(-4)}`;
  const formattedLeaderboard = {
    ...leaderboardData,
    shortAddress: shortAddress,
    date: format(leaderboardData.timestamp * 1000, "dd MMMM yyyy"),
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
  const [localFinished, setLocalFinished] = useState(finished);
  const [formattedLeaderboard, setFormattedLeaderboard] = useState<
    FormattedLeaderboard[]
  >([]);
  const [isUpdatingLeaderboard, setIsUpdatingLeaderboard] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { sourceChain, userAddress, handleError } = useAppContext();

  const { writeContractAsync } = useWriteContract();

  const { data: leaderboardLength, isPending } = useReadContract({
    address: sourceChain?.leaderboard,
    abi: leaderboardAbi,
    functionName: "getResultsLength",
    chainId: sourceChain?.definition?.id,
    query: { enabled: !!sourceChain },
  });

  useEffect(() => {
    const getChunckedLeaderboardData = async () => {
      const leaderboardLengthNumber = Number(leaderboardLength);
      const aggregatedLeaderboardData: FormattedLeaderboard[] = [];
      let numCalls = 0;
      for (let i = 0; i < leaderboardLengthNumber; i += CHUNCK_STEP) {
        const endIndex = Math.min(i + CHUNCK_STEP, leaderboardLengthNumber);
        const leaderboardResponse = await getLeaderboardContract(
          sourceChain?.name,
        ).getResultsPaginated(i, endIndex);
        const parsedLeaderboardResponse =
          parseLeaderboardResponse(leaderboardResponse);
        aggregatedLeaderboardData.push(...parsedLeaderboardResponse);
        ++numCalls;
        // If too many calls, sleep for some time to avoid rate limit on public rpcs.
        if (numCalls === NUM_CALLS_TO_SLEEP) {
          await sleep();
          numCalls = 0;
        }
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
    setIsUpdatingLeaderboard(true);
    try {
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
      setIsSuccess(true);
      setState({ finished: 0 });
    } catch (error) {
      setIsSuccess(false);
      handleError(error);
    }
    setIsUpdatingLeaderboard(false);
  };

  return (
    <div>
      {(!!isSuccess || !!finished) && (
        <div className="mb-8 text-lg">
          <div className="mb-2">Congratulations!</div>
          <div>
            You've finished the race in{" "}
            {formatRaceDurationToLongText(localFinished)}
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>

        {isPending ? (
          <div className="mt-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="mb-8" key={i}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={350}
                  height={50}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              className="my-6 flex flex-row align-center"
              style={{ display: "flex", alignItems: "center" }}
            >
              {!isSuccess && !!finished && (
                <>
                  <Button
                    onClick={onClickUpdateLeaderboard}
                    isDisabled={isUpdatingLeaderboard}
                  >
                    ADD MY RACE IN THE LEADERBOARD
                  </Button>

                  {isUpdatingLeaderboard && (
                    <div className="ml-4 flex flex-row align-center justify-center">
                      <CircularProgress size={20} />
                    </div>
                  )}
                </>
              )}

              {isSuccess && !isUpdatingLeaderboard && (
                <div className="flex flex-row align-center justify-center">
                  Race entry added successfully!
                </div>
              )}
            </div>

            <table>
              <thead>
                <tr className="*:border-b-2 *:px-12 *:py-6 text-left *:font-bold">
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Duration</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {formattedLeaderboard.map((item, index) => (
                  <tr key={item.key} className="*:px-12 *:py-6">
                    <td>{index + 1}</td>
                    <td title={item.player}>{item.shortAddress}</td>
                    <td>{item.formattedDuration}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
