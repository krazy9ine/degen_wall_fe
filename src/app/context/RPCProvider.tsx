"use client";

import { clusterApiUrl } from "@solana/web3.js";
import AppWalletProvider from "./AppWalletProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useState, createContext, useEffect } from "react";
import { isHealthyEndpoint } from "../web3/misc";
import { RPC_URL_KEY } from "../constants";

const NETWORK = WalletAdapterNetwork.Devnet;

interface RPCContextType {
  setRPC: (url?: string) => Promise<boolean>;
}

//@ts-ignore
export const RPCContext = createContext<RPCContextType>(undefined);

interface RPCProviderProps {
  children: React.ReactNode;
}

export default function RPCProvider({ children }: RPCProviderProps) {
  const [endpoint, setEndpoint] = useState(
    localStorage.getItem(RPC_URL_KEY) || clusterApiUrl(NETWORK)
  );

  const setRPC = async (url = "") => {
    if (url && (await isHealthyEndpoint(url))) {
      setEndpoint(url);
      return true;
    }
    setEndpoint(clusterApiUrl(NETWORK));
    return false;
  };

  return (
    <RPCContext.Provider value={{ setRPC }}>
      <AppWalletProvider endpoint={endpoint}>{children}</AppWalletProvider>
    </RPCContext.Provider>
  );
}
