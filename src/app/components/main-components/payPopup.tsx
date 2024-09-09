import { BackdropCommon, ConnectWalletButton } from "@/app/common";
import { NAME_LENGTH, TICKER_LENGTH } from "@/app/constants";
import { AnchorContext } from "@/app/context/AnchorProvider";
import { PayPopupProps, Socials } from "@/app/types";
import { isValidAddress } from "@/app/web3/misc";
import {
  HTMLInputTypeAttribute,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import urlRegex from "url-regex";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const emptySocials: Socials = {
  payer: "",
  name: "",
  ticker: "",
  token: "",
  website: "",
  twitter: "",
  community: "",
  description: "",
  image: "",
};

export default function PayPopup(props: PayPopupProps) {
  const { popupPay, onClosePopupPay, coloredPixelsDict } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorContext = useContext(AnchorContext);
  const [socials, setSocials] = useState<Socials>(emptySocials);
  const [errorLabels, setErrorLabels] = useState<Socials>(emptySocials);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (popupPay && isInitialRender.current) {
      isInitialRender.current = false;
      setSocials(emptySocials);
      setErrorLabels(emptySocials);
    } else if (!popupPay) {
      isInitialRender.current = true;
    }
  }, [popupPay]);

  const validateName = (name: string) => {
    if (name.length > NAME_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else {
      setSocials((prevSocials) => ({ ...prevSocials, name }));
      setErrorLabels((prevErrorLabels) => ({
        ...prevErrorLabels,
        name: "Placeholder error",
      }));
    }
  };

  const validateTicker = (ticker: string) => {
    if (ticker.length > TICKER_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else {
      setSocials((prevSocials) => ({ ...prevSocials, ticker }));
      setErrorLabels((prevErrorLabels) => ({
        ...prevErrorLabels,
        ticker: "Placeholder error",
      }));
    }
  };

  const isValidUrl = (urlString: string) => {
    return urlRegex({ strict: false, exact: true }).test(urlString);
  };

  const validateWebsite = (website: string) => {
    if (!isValidUrl(website)) console.warn("Invalid url for website");
    setSocials((prevSocials) => ({ ...prevSocials, website }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      website: "Placeholder error",
    }));
  };

  const validateTwitter = (twitter: string) => {
    if (!isValidUrl(twitter)) console.warn("Invalid url for twitter");
    setSocials((prevSocials) => ({ ...prevSocials, twitter }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      twitter: "Placeholder error",
    }));
  };

  const validateCommunity = (community: string) => {
    if (!isValidUrl(community)) console.warn("Invalid url for community");
    setSocials((prevSocials) => ({ ...prevSocials, community }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      community: "Placeholder error",
    }));
  };

  const validateImage = (image: string) => {
    if (!isValidUrl(image)) console.warn("Invalid url for image");
    setSocials((prevSocials) => ({ ...prevSocials, image }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      image: "Placeholder error",
    }));
  };

  const validateToken = (token: string) => {
    if (!isValidAddress(token)) console.warn("Invalid tokenAddress");
    setSocials((prevSocials) => ({ ...prevSocials, token }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      token: "Placeholder error",
    }));
  };

  const validateDescription = (description: string) => {
    setSocials((prevSocials) => ({ ...prevSocials, description }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      description: "Placeholder error",
    }));
  };

  const onPay = () => {
    if (anchorContext) {
      anchorContext.createMetadataAccount(socials, coloredPixelsDict);
    }
  };

  const TextField = (props: {
    id: keyof Socials;
    type: HTMLInputTypeAttribute;
    validate: (value: string) => void;
  }) => {
    const { id: key, type, validate } = props;
    return (
      <div>
        <label htmlFor={`${key}`}>{`${capitalize(key)}${
          type === "url" ? " URL" : ""
        }`}</label>
        <div>
          <input
            id={`${key}`}
            type={type}
            spellCheck="false"
            value={socials[key] || ""}
            onChange={(event) => validate(event.target.value)}
          ></input>
        </div>
        <label htmlFor={`${key}`}>{errorLabels[key]}</label>
      </div>
    );
  };

  return (
    <BackdropCommon open={popupPay}>
      <div ref={menuRef} className="bg-green-100 text-black relative">
        <ConnectWalletButton></ConnectWalletButton>
        <button className="absolute top-0 right-0" onClick={onClosePopupPay}>
          X
        </button>
        <div>
          {TextField({ id: "name", type: "text", validate: validateName })}
          {TextField({ id: "ticker", type: "text", validate: validateTicker })}
          {TextField({ id: "website", type: "url", validate: validateWebsite })}
          {TextField({ id: "twitter", type: "url", validate: validateTwitter })}
          {TextField({
            id: "community",
            type: "url",
            validate: validateCommunity,
          })}
          {TextField({ id: "image", type: "url", validate: validateImage })}
          {TextField({ id: "token", type: "text", validate: validateToken })}
          {TextField({
            id: "description",
            type: "text",
            validate: validateDescription,
          })}
        </div>
        <button onClick={onPay}>Pay</button>
      </div>
    </BackdropCommon>
  );
}
