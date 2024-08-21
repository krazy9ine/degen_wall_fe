import ConnectWalletButton from "../common/connectWalletButton";
import SelectTokenDropdown from "../common/selectTokenDropdown";
import TokenBalance from "../common/tokenBalance";

export default function Nav() {
  return (
    <nav className="flex">
      <ConnectWalletButton></ConnectWalletButton>
      <SelectTokenDropdown></SelectTokenDropdown>
      <TokenBalance></TokenBalance>
    </nav>
  );
}
