import { timeStamp } from "console";
import { FETCH_BALANCE_INTERVAL_MS, WSOL_ADDRESS } from "../constants";
import { BalanceCache, TokenAddress } from "../types";
import { PublicKey, Connection } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const updateBalance = async (
  owner: PublicKey,
  mint: TokenAddress,
  connection: Connection,
  onSetBalance: (balance: number) => void
) => {
  try {
    const balanceCacheString = localStorage.getItem(mint);
    if (balanceCacheString) {
      const { timestamp, balance } = JSON.parse(
        balanceCacheString
      ) as BalanceCache;
      if (
        timestamp &&
        balance &&
        Date.now() - timestamp < FETCH_BALANCE_INTERVAL_MS
      ) {
        onSetBalance(balance);
        return;
      }
    }
    if (mint === WSOL_ADDRESS) {
      const newBalance = await connection.getBalance(owner);
      updateCache(mint, newBalance);
      onSetBalance(newBalance);
    } else {
      const mintPubkey = new PublicKey(mint);
      const [address] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const response = await connection.getTokenAccountBalance(address);
      const newBalance = response?.value?.uiAmount || 0;
      updateCache(mint, newBalance);
      onSetBalance(newBalance);
    }
  } catch (error) {
    console.error(error);
    onSetBalance(0);
  }
};

const updateCache = (mint: TokenAddress, balance: number) => {
  const newBalanceCache: BalanceCache = {
    timestamp: Date.now(),
    balance,
  };
  localStorage.setItem(mint, JSON.stringify(newBalanceCache));
};
