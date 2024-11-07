import { Chain, supportedChainsMap } from "@/chains";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";

type AppContext =
  | {
      sourceChain: Chain;
      setSourceChain: Dispatch<SetStateAction<Chain>>;
      isClient: boolean;
      userAddress: Address | undefined;
      isToastOpen: boolean;
      setIsToastOpen: Dispatch<SetStateAction<boolean>>;
      toastMessage: string;
      setToastMessage: Dispatch<SetStateAction<string>>;
      handleError: (error: unknown) => void;
    }
  | undefined;

const appContext = createContext<AppContext>(undefined);

export const AppProvider = ({ children }: PropsWithChildren<object>) => {
  const [sourceChain, setSourceChain] = useState<Chain>(null!);
  const [isClient, setIsClient] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { address: userAddress } = useAccount();

  const chainId = useChainId();

  const handleError = (error: unknown) => {
    const errorString = error?.toString() || "";
    if (errorString.includes("User rejected the request")) {
      return;
    }
    if (errorString.includes("Connector not connected")) {
      setToastMessage("Please connect a wallet");
    } else {
      setToastMessage("Unexpected error. Please try again");
      console.error(error);
    }
    setIsToastOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const connectedChain = supportedChainsMap[chainId];
    setSourceChain(connectedChain);
  }, [chainId]);

  return (
    <appContext.Provider
      value={{
        sourceChain,
        setSourceChain,
        isClient,
        userAddress,
        isToastOpen,
        setIsToastOpen,
        toastMessage,
        setToastMessage,
        handleError,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
