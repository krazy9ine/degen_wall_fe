"use client";

import { createContext, useEffect, useRef } from "react";
import AnchorInterface from "../web3/anchorInterface";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export const AnchorContext = createContext<AnchorInterface | undefined>(
  undefined
);

export const AnchorProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useAnchorWallet();
  const prevPubkey = useRef("");
  const { connection } = useConnection();
  const anchorInterface = useRef<AnchorInterface>(); // contract interactions
  useEffect(() => {
    const currentPubkey = wallet?.publicKey?.toString();
    if (wallet && currentPubkey !== prevPubkey.current) {
      prevPubkey.current = currentPubkey as string;
      if (!anchorInterface.current)
        anchorInterface.current = new AnchorInterface(connection, wallet);
      else anchorInterface.current.updateProgram(connection, wallet);
    } else if (!wallet) {
      prevPubkey.current = "";
    }
  }, [wallet, connection]);

  return (
    <AnchorContext.Provider value={anchorInterface.current}>
      {children}
    </AnchorContext.Provider>
  );
};
