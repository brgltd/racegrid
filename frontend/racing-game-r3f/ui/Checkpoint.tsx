import { useEffect } from "react";

import { setState, useStore } from "../store";

export function Checkpoint() {
  const [bestCheckpoint, checkpoint] = useStore(
    ({ bestCheckpoint, checkpoint }) => [bestCheckpoint, checkpoint],
  );

  const isBetter = !bestCheckpoint || checkpoint < bestCheckpoint;
  const diff = bestCheckpoint ? checkpoint - bestCheckpoint : checkpoint;

  useEffect(() => {
    if (!checkpoint) return;
    const timeout = setTimeout(() => {
      const best = checkpoint && isBetter ? checkpoint : bestCheckpoint;
      setState({ bestCheckpoint: best, checkpoint: 0 });
    }, 3000);
    return () => clearTimeout(timeout);
  });

  const color = isBetter ? "green" : "red";

  return <div className="checkpoint"></div>;
}
