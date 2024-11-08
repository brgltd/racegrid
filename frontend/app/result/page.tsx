"use client";

import { setState, useStore } from "@/racing-game-r3f/store";
import { useEffect, useState } from "react";

export default function Result() {
  const [finished] = useStore((s) => [s.finished]);

  useEffect(() => {
    console.log(finished);
    setState({ finished: 0 });
  }, []);

  return (
    <div>
      <div>Congratulations!</div>
      <div>You've finished the race is less than 1 minute and will...</div>
      <div>loading action</div>
    </div>
  );
}
