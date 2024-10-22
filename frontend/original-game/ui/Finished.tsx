import { useEffect, useState } from "react";
import { useStore } from "../store";

export const Finished = (): JSX.Element => {
  const [reset, session, time] = useStore(
    ({ actions: { reset }, finished, session }) => [reset, session, finished],
  );
  const [position, setPosition] = useState<number>(0);

  return (
    <div className="finished">
      <div className="finished-header"></div>
      <div className="finished-leaderboard"></div>
      <div className="finished-restart">
        <button className="restart-btn" onClick={reset}>
          Restart
        </button>
      </div>
    </div>
  );
};
