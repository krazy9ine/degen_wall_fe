import { WSOL_ADDRESS } from "../constants";
import { TokenAddress } from "../types";
import { PublicKey, Connection } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const getBalance = async (
  owner: PublicKey,
  mint: TokenAddress,
  connection: Connection,
  onSetBalance: (balance: number) => void
) => {
  try {
    if (mint === WSOL_ADDRESS) return await connection.getBalance(owner);
    const mintPubkey = new PublicKey(mint);
    const [address] = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return await connection.getTokenAccountBalance(address);
  } catch (error) {
    console.error(error);
    return 0;
  }
};
