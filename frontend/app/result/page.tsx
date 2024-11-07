"use client";

import { setState, useStore } from "@/racing-game-r3f/store";
import { useEffect } from "react";

export default function Result() {
  const [finished] = useStore((s) => [s.finished]);

  useEffect(() => {
    console.log(finished);
    setState({ finished: 0 });
  }, []);

  return <div>result</div>;
}
