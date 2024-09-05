"use client";

import { clusterApiUrl } from "@solana/web3.js";
import AppWalletProvider from "./AppWalletProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useState, createContext } from "react";

const NETWORK = WalletAdapterNetwork.Devnet;

interface RPCContextType {
  setRPC: (url?: string) => void;
}

export const RPCContext = createContext<RPCContextType | undefined>(undefined);

interface RPCProviderProps {
  children: React.ReactNode;
}

export default function RPCProvider({ children }: RPCProviderProps) {
  const [endpoint, setEndpoint] = useState(clusterApiUrl(NETWORK));

  const setRPC = (url = clusterApiUrl(NETWORK)) => {
    setEndpoint(url);
  };

  return (
    <RPCContext.Provider value={{ setRPC }}>
      <AppWalletProvider endpoint={endpoint}>{children}</AppWalletProvider>
    </RPCContext.Provider>
  );
}
