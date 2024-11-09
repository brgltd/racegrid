"use client";

import { setState, useStore } from "@/racing-game-r3f/store";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [finished] = useStore((s) => [s.finished]);

  useEffect(() => {
    console.log(finished);
    setState({ finished: 0 });
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
