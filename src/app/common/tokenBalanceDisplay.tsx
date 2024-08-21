import { useContext } from "react";
import { TokenBalanceContext } from "../context/TokenBalanceProvider";

export default function TokenBalanceDisplay() {
  const balance = useContext(TokenBalanceContext);
  return <p>Balance: {balance}</p>;
}
