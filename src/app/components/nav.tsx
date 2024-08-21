import {
  ConnectWalletButton,
  SelectTokenDropdown,
  TokenBalanceDisplay,
} from "../common";

export default function Nav() {
  return (
    <nav className="flex">
      <ConnectWalletButton></ConnectWalletButton>
      <SelectTokenDropdown></SelectTokenDropdown>
      <TokenBalanceDisplay></TokenBalanceDisplay>
    </nav>
  );
}
