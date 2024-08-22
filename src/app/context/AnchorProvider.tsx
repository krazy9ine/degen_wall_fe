"use client";

import { createContext, useEffect, useRef } from "react";
import AnchorInterface from "../web3/program";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

export const AnchorContext = createContext<AnchorInterface | undefined>(
  undefined
);

export const AnchorProvider = ({ children }: { children: React.ReactNode }) => {
  const walletState = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const anchorInterface = useRef<AnchorInterface>(); // contract interactions
  useEffect(() => {
    if (walletState.connecting && wallet) {
      if (!anchorInterface.current)
        anchorInterface.current = new AnchorInterface(connection, wallet);
      else anchorInterface.current.updateProgram(connection, wallet);
    }
  }, [wallet, walletState, connection]);

  return (
    <AnchorContext.Provider value={anchorInterface.current}>
      {children}
    </AnchorContext.Provider>
  );
};
