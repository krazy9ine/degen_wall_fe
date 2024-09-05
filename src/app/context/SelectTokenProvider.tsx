"use client";

import React, { useState, createContext, useEffect } from "react";
import { TokenAddress } from "../types";
import { WSOL_ADDRESS } from "../constants";

const TOKEN_ADDRESS_KEY = "tokenAddress";

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
      (localStorage.getItem(TOKEN_ADDRESS_KEY) as TokenAddress) || WSOL_ADDRESS
    );
  }, []);
  const onSetTokenAddress = (newTokenAddress: TokenAddress) => {
    if (newTokenAddress !== tokenAddress) {
      setTokenAddress(newTokenAddress);
      localStorage.setItem(TOKEN_ADDRESS_KEY, newTokenAddress);
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
