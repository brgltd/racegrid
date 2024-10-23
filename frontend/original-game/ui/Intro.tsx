import { Suspense, useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import type { ReactNode } from "react";

import { useStore } from "../store";
import { Keys } from "./Keys";

export function Intro({ children }: { children: ReactNode }): JSX.Element {
  // const [clicked, setClicked] = useState(false);
  const [clicked, setClicked] = useState(true);
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();
  const [set] = useStore((state) => [state.set]);

  useEffect(() => {
    if (clicked && !loading) set({ ready: true });
  }, [clicked, loading]);

  useEffect(() => {
    if (progress === 100) setLoading(false);
  }, [progress]);

  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <div
        className={`fullscreen bg ${loading ? "loading" : "loaded"} ${clicked && "clicked"}`}
      >
        <div className="stack">
          <div className="intro-keys">
            <Keys style={{ paddingBottom: 20 }} />
            <a className="start-link" href="#" onClick={() => setClicked(true)}>
              {loading ? `loading ${progress.toFixed()} %` : "Click to start"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
