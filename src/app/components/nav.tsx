import {
  ConnectWalletButton,
  SelectTokenDropdown,
  TokenBalanceDisplay,
} from "../common";
import { SettingsMenu } from "./nav-components";

export default function Nav() {
  return (
    <nav className="flex">
      <ConnectWalletButton></ConnectWalletButton>
      <SelectTokenDropdown></SelectTokenDropdown>
      <TokenBalanceDisplay></TokenBalanceDisplay>
      <SettingsMenu></SettingsMenu>
    </nav>
  );
}
