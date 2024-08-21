"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useIsMounted from "./util/useIsMounted";

export default function Home() {
  const mounted = useIsMounted();
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        {mounted && <WalletMultiButton style={{}} />}
      </div>
    </main>
  );
}
