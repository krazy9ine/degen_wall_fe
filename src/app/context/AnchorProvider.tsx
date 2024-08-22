"use client";

import { createContext, useEffect, useRef } from "react";
import AnchorInterface from "../web3/program";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Provider } from "@coral-xyz/anchor";

export const AnchorContext = createContext(null);

export const AnchorProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const anchorInterface = useRef<AnchorInterface>(); // contract interactions
  useEffect(() => {
    if (wallet.connecting) {
      if (!anchorInterface.current)
        anchorInterface.current = new AnchorInterface({
          ...wallet,
          connection,
        } as Provider);
      else
        anchorInterface.current.updateProgram({
          ...wallet,
          connection,
        } as Provider);
    }
  }, [wallet, connection]);
  return (
    <AnchorContext.Provider value={null}>{children}</AnchorContext.Provider>
  );
};
