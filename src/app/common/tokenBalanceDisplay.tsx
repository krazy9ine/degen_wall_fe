import { useContext, useEffect, useState } from "react";
import { SelectTokenContext } from "../context/SelectTokenProvider";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { WSOL_ADDRESS } from "../constants";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export default function TokenBalanceDisplay() {
  const selectTokenContext = useContext(SelectTokenContext);
  const wallet = useWallet();
  const connectionContext = useConnection();
  const [balance, setBalance] = useState(0);

  const onSetBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  useEffect(() => {
    const updateBalance = async () => {
      try {
        const owner = wallet.publicKey;
        if (owner) {
          if (selectTokenContext.tokenAddress === WSOL_ADDRESS) {
            const newBalance = await connectionContext.connection.getBalance(
              owner
            );
            onSetBalance(newBalance);
          } else {
            const mintPubkey = new PublicKey(selectTokenContext.tokenAddress);
            const [address] = PublicKey.findProgramAddressSync(
              [
                owner.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mintPubkey.toBuffer(),
              ],
              ASSOCIATED_TOKEN_PROGRAM_ID
            );
            const newBalance =
              await connectionContext.connection.getTokenAccountBalance(
                address
              );
            onSetBalance(newBalance?.value?.uiAmount || 0);
          }
        } else onSetBalance(0);
      } catch (error) {
        console.error(error);
        onSetBalance(0);
      }
    };
    if (!wallet.connected) onSetBalance(0);
    else if (selectTokenContext?.tokenAddress) updateBalance();
  }, [
    wallet.connected,
    wallet.publicKey,
    connectionContext.connection,
    selectTokenContext.tokenAddress,
  ]);
  return <p>Balance: {balance}</p>;
}
