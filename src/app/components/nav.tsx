import ConnectWalletButton from "../common/connectWalletButton";
import SelectTokenDropdown from "../common/selectTokenDropdown";

export default function Nav() {
  return (
    <nav className="flex">
      <p>Hello</p>
      <ConnectWalletButton></ConnectWalletButton>
      <SelectTokenDropdown></SelectTokenDropdown>
    </nav>
  );
}
