import create from "zustand";
import shallow from "zustand/shallow";
import type { GetState, SetState, StateSelector } from "zustand";

export const dpr = 1.5 as const;
export const levelLayer = 1 as const;

export const booleans = {
  shadows: true,
  editor: false,
};

type Booleans = keyof typeof booleans;

type BaseState = Record<Booleans, boolean>;

export interface IState extends BaseState {
  dpr: number;
}

const useStoreImpl = create<IState>(
  (set: SetState<IState>, get: GetState<IState>) => {
    return {
      ...booleans,
      dpr,
    };
  },
);

export const useStore = <T>(sel: StateSelector<IState, T>) =>
  useStoreImpl(sel, shallow);
