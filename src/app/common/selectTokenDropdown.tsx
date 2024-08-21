import { useContext } from "react";
import { SelectTokenContext } from "../context/SelectTokenProvider";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { TOKEN_ARRAY } from "../constants";
import { TokenAddress } from "../types";

export default function SelectTokenDropdown() {
  const context = useContext(SelectTokenContext);
  const handleChange = (selectedOption: { value: TokenAddress }) => {
    context?.onSetTokenAddress(selectedOption.value);
  };
  return (
    <Dropdown
      options={TOKEN_ARRAY}
      value={context?.tokenAddress} //@ts-ignore
      onChange={handleChange}
    ></Dropdown>
  );
}
