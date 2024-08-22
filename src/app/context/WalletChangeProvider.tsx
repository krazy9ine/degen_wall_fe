"use client";

import React, { useState, createContext, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import useInterval from "../hooks/useInterval";

export const WalletChangeContext = createContext(null);

export const WalletChangeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallet = useWallet();
  const [currentPubkey, setCurrentPubkey] = useState(null);
  useInterval(async () => {
    const provider = window //@ts-ignore
      ? window?.solana || window?.phantom || window?.solflare
      : null;
    const newPubkey = provider?.publicKey?.toBase58();
    if (currentPubkey != newPubkey) {
      if (currentPubkey && newPubkey) {
        setCurrentPubkey(newPubkey);
        await wallet.disconnect();
      } else setCurrentPubkey(newPubkey);
    }
  }, 100);
  return (
    <WalletChangeContext.Provider value={null}>
      {children}
    </WalletChangeContext.Provider>
  );
};
