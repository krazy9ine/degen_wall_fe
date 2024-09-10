import { useContext } from "react";
import { SelectTokenContext } from "../context/SelectTokenProvider";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { TOKEN_DICT } from "../constants";
import { TokenSymbol } from "../types";

export default function SelectTokenDropdown() {
  const context = useContext(SelectTokenContext);
  const handleChange = (selectedOption: { value: TokenSymbol }) => {
    context?.onSetToken(selectedOption.value);
  };
  return (
    <Dropdown
      options={Object.keys(TOKEN_DICT)}
      value={context?.symbol} //@ts-ignore
      onChange={handleChange}
    ></Dropdown>
  );
}
