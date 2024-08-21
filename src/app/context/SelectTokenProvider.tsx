"use client";

import React, { useState, createContext, useEffect } from "react";
import { TokenAddress } from "../types";
import { WSOL_ADDRESS } from "../constants";

export const SelectTokenContext = createContext<{
  tokenAddress: TokenAddress;
  onSetTokenAddress: (newTokenAddress: TokenAddress) => void; //@ts-ignore
}>(null);

export const SelectTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tokenAddress, setTokenAddress] = useState<TokenAddress>(WSOL_ADDRESS);
  useEffect(() => {
    setTokenAddress(
      (localStorage.getItem("tokenAddress") as TokenAddress) || WSOL_ADDRESS
    );
  }, []);
  const onSetTokenAddress = (newTokenAddress: TokenAddress) => {
    if (newTokenAddress !== tokenAddress) {
      setTokenAddress(newTokenAddress);
      localStorage.setItem("tokenAddress", newTokenAddress);
    }
  };
  return (
    <SelectTokenContext.Provider
      value={{
        tokenAddress,
        onSetTokenAddress,
      }}
    >
      {children}
    </SelectTokenContext.Provider>
  );
};
