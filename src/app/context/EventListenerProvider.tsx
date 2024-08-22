"use client";

import { createContext, useEffect, useRef } from "react";
import AnchorInterface from "../web3/program";
import { useConnection } from "@solana/wallet-adapter-react";
import { MetadataAccountParsed } from "../types";

export const EventListenerContext = createContext<
  (setEventHandler: (event: MetadataAccountParsed) => void) => void //@ts-ignore
>(null);

export const EventListenerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connection } = useConnection();
  const anchorInterface = useRef<AnchorInterface>();
  const isInitialRender = useRef(true);
  const onEvent = useRef<(event: MetadataAccountParsed) => void>();
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      anchorInterface.current = new AnchorInterface(connection);
      anchorInterface.current.registerEventListener(onEvent.current);
    }
  }, [connection]);

  const setEventHandler = (handler: (event: MetadataAccountParsed) => void) => {
    onEvent.current = handler;
  };
  return (
    <EventListenerContext.Provider value={setEventHandler}>
      {children}
    </EventListenerContext.Provider>
  );
};
