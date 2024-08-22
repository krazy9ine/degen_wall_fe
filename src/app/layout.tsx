import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./context/AppWalletProvider";
import { WalletChangeProvider } from "./context/WalletChangeProvider";
import { SelectTokenProvider } from "./context/SelectTokenProvider";
import { TokenBalanceProvider } from "./context/TokenBalanceProvider";
import { AnchorProvider } from "./context/AnchorProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {
          <AppWalletProvider>
            <WalletChangeProvider>
              <AnchorProvider>
                <SelectTokenProvider>
                  <TokenBalanceProvider>{children}</TokenBalanceProvider>
                </SelectTokenProvider>
              </AnchorProvider>
            </WalletChangeProvider>
          </AppWalletProvider>
        }
      </body>
    </html>
  );
}
