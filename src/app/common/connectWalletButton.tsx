import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "../util/useIsMounted";

export default function ConnectWalletButton() {
  const mounted = useIsMounted();
  return <>{mounted && <WalletMultiButton style={{}} />}</>;
}
