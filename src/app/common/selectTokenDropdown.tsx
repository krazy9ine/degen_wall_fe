import { useContext } from "react";
import { SelectTokenContext } from "../context/SelectTokenProvider";
import { Dropdown } from "primereact/dropdown";
import { TOKEN_DICT } from "../constants";
import { TokenSymbol } from "../types";

// Custom option template to render image and label in the dropdown
const optionTemplate = (option: TokenSymbol) => {
  return (
    <div className="flex align-items-center">
      <img
        alt={option}
        src={`/${option}.png`}
        className="mr-2"
        style={{ width: "20px", height: "20px" }}
      />
      <span>{option}</span>
    </div>
  );
};

// Custom value template to render image and label in the input box
const valueTemplate = (option: TokenSymbol) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <img
          alt={option}
          src={`/${option}.png`}
          className="mr-2"
          style={{ width: "20px", height: "20px" }}
        />
        <span>{option}</span>
      </div>
    );
  }
  return <span>Select a token</span>; // Placeholder when no token is selected
};

export default function SelectTokenDropdown() {
  const context = useContext(SelectTokenContext);

  const handleChange = (e: any) => {
    console.log(e);
    context?.onSetToken(e.value);
  };

  return (
    <Dropdown
      value={context.symbol} // Find the selected token option
      options={Object.keys(TOKEN_DICT)}
      onChange={handleChange}
      optionLabel="label"
      itemTemplate={optionTemplate} // Template for dropdown options
      valueTemplate={valueTemplate} // Template for selected value in the input box
    />
  );
}
