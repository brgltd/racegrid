import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";
import { useStore } from "../store";

export const readableTime = (time: number): string => (time / 1000).toFixed(1);

const getTime = (finished: number, start: number, shouldReset = false) => {
  if (shouldReset) {
    return `${readableTime(0)}`;
  }
  const time = start && !finished ? Date.now() - start : 0;
  return `${readableTime(time)}`;
};

export function Clock({ shouldReset }: { shouldReset: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { finished, start } = useStore(({ finished, start }) => ({
    finished,
    start,
  }));

  let text = getTime(finished, start, shouldReset);

  useEffect(() => {
    let lastTime = 0;
    return addEffect((time) => {
      if (!ref.current || time - lastTime < 100) return;
      lastTime = time;
      text = getTime(finished, start, shouldReset);
      if (ref.current.innerText !== text) {
        ref.current.innerText = text;
      }
    });
  }, [finished, start]);

  return (
    <div className="clock">
      <span ref={ref}>{text}</span>
    </div>
  );
}
