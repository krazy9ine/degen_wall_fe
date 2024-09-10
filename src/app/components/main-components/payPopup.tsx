import { BackdropCommon, ConnectWalletButton } from "@/app/common";
import { NAME_LENGTH, TICKER_LENGTH, USER_REGEX } from "@/app/constants";
import { AnchorContext } from "@/app/context/AnchorProvider";
import { PayPopupProps, Socials } from "@/app/types";
import { isValidAddress } from "@/app/web3/misc";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  HTMLInputTypeAttribute,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import urlRegex from "url-regex";
import { getDefaultSocials } from "./canvas-components/canvas-util";

const TWITTER_REGEX = /(?:twitter\.com\/|x\.com\/)([A-Za-z0-9_]+)(?:[/?]|$)/;
const INVALID_URL_ERROR = "Invalid URL";

const extractTwitterUser = (url: string) => {
  const match = url.match(TWITTER_REGEX);
  return match ? match[1] : null;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const isValidUrl = (urlString: string) => {
  return urlRegex({ strict: false, exact: true }).test("https://" + urlString);
};

const parseUrl = (urlString: string) => {
  return urlString.replace(/^https?:\/\//, "");
};
const EMPTY_SOCIALS: Socials = {
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

const DEFAULT_SOCIALS = getDefaultSocials();

export default function PayPopup(props: PayPopupProps) {
  const { popupPay, onClosePopupPay, coloredPixelsDict, exitEditMode } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorContext = useContext(AnchorContext);
  const [socials, setSocials] = useState<Socials>(EMPTY_SOCIALS);
  const [errorLabels, setErrorLabels] = useState<Socials>(EMPTY_SOCIALS);
  const isInitialRender = useRef(true);
  const wallet = useWallet();

  useEffect(() => {
    if (popupPay && isInitialRender.current) {
      isInitialRender.current = false;
      setSocials(EMPTY_SOCIALS);
      setErrorLabels(EMPTY_SOCIALS);
    } else if (!popupPay) {
      isInitialRender.current = true;
    }
  }, [popupPay]);

  const validateName = (name: string) => {
    if (name.length > NAME_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else {
      setSocials((prevSocials) => ({ ...prevSocials, name }));
    }
  };

  const validateTicker = (ticker: string) => {
    if (ticker.length > TICKER_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else {
      setSocials((prevSocials) => ({ ...prevSocials, ticker }));
    }
  };

  const validateToken = (token: string) => {
    let errorLabel = "";
    if (token) {
      if (!isValidAddress(token)) errorLabel = "Invalid address";
    }
    setSocials((prevSocials) => ({ ...prevSocials, token }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      token: errorLabel,
    }));
  };

  const validateDescription = (description: string) => {
    setSocials((prevSocials) => ({ ...prevSocials, description }));
  };

  const validateWebsite = (websiteHttps: string) => {
    let website = "";
    let errorLabel = "";
    if (websiteHttps) {
      website = parseUrl(websiteHttps);
      if (!isValidUrl(website)) errorLabel = INVALID_URL_ERROR;
    }
    setSocials((prevSocials) => ({ ...prevSocials, website }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      website: errorLabel,
    }));
  };

  const validateTwitter = (twitterHttps: string) => {
    let twitter = "";
    let errorLabel = "";
    if (twitterHttps) {
      twitter = parseUrl(twitterHttps);
      if (!isValidUrl(twitter)) errorLabel = INVALID_URL_ERROR;
      else {
        const twitterUser = extractTwitterUser(twitter);
        if (!(twitterUser && USER_REGEX.test(twitterUser)))
          errorLabel = "Invalid user";
      }
    }
    setSocials((prevSocials) => ({ ...prevSocials, twitter }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      twitter: errorLabel,
    }));
  };

  const validateCommunity = (communityHttps: string) => {
    let community = "";
    let errorLabel = "";
    if (communityHttps) {
      community = parseUrl(communityHttps);
      if (!isValidUrl(community)) errorLabel = INVALID_URL_ERROR;
    }
    setSocials((prevSocials) => ({ ...prevSocials, community }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      community: errorLabel,
    }));
  };

  const validateImage = (imageHttps: string) => {
    let image = "";
    let errorLabel = "";
    if (imageHttps) {
      image = parseUrl(imageHttps);
      if (!isValidUrl(image)) errorLabel = INVALID_URL_ERROR;
    }
    setSocials((prevSocials) => ({ ...prevSocials, image }));
    setErrorLabels((prevErrorLabels) => ({
      ...prevErrorLabels,
      image: errorLabel,
    }));
  };

  const onPay = async () => {
    console.log(anchorContext, wallet?.publicKey);
    if (anchorContext && wallet?.publicKey) {
      await anchorContext.createMetadataAccount(
        { ...socials, payer: wallet?.publicKey.toString() },
        coloredPixelsDict
      );
      exitEditMode();
      onClosePopupPay();
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
        <label htmlFor={`${key}`}>
          {`${capitalize(key)}${type === "url" ? " URL" : ""}`}
          {` (optional)`}
        </label>
        <div>
          {type === "url" && (
            <label htmlFor={`${key}`} className="bg-slate-500">
              https://
            </label>
          )}{" "}
          <input
            id={`${key}`}
            type={type}
            spellCheck="false"
            placeholder={
              type === "url"
                ? `${DEFAULT_SOCIALS[key]?.replace("https://", "")}`
                : `${DEFAULT_SOCIALS[key]}`
            }
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
