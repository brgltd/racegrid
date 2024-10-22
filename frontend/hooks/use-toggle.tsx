import { useStore } from "./use-store";

import type { ComponentType, PropsWithChildren } from "react";
import type { IState } from "./use-store";

type IStateKey = keyof IState;

export const useToggle =
  <P extends {}>(
    ToggledComponent: ComponentType<P>,
    // toggle: IStateKey | IStateKey[],
    toggle: any,
  ) =>
  (props: PropsWithChildren<P>) => {
    const keys = Array.isArray(toggle) ? toggle : [toggle];
    // @ts-ignore
    const values = useStore((state) => keys.map((key) => state[key]));
    return values.every((v) => !!v) ? (
      <ToggledComponent {...props} />
    ) : props.children ? (
      <>{props.children}</>
    ) : null;
  };
