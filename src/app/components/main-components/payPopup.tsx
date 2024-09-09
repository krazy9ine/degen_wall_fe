import { BackdropCommon, ConnectWalletButton } from "@/app/common";
import { NAME_LENGTH, TICKER_LENGTH } from "@/app/constants";
import { PayPopupProps, Socials } from "@/app/types";
import { isValidAddress } from "@/app/web3/misc";
import { HTMLInputTypeAttribute, useEffect, useRef, useState } from "react";
import urlRegex from "url-regex";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function PayPopup(props: PayPopupProps) {
  const { popupPay, onClosePopupPay, coloredPixelsDict } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const [socials, setSocials] = useState<Socials>({});
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (popupPay && isInitialRender.current) {
      isInitialRender.current = false;
      setSocials({});
    } else if (!popupPay) {
      isInitialRender.current = true;
    }
  }, [popupPay]);

  const validateName = (name: string) => {
    if (name.length > NAME_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else setSocials((prevSocials) => ({ ...prevSocials, name }));
  };

  const validateTicker = (ticker: string) => {
    if (ticker.length > TICKER_LENGTH) {
      console.warn(`Name can't be bigger than ${NAME_LENGTH}`);
    } else setSocials((prevSocials) => ({ ...prevSocials, ticker }));
  };

  const isValidUrl = (urlString: string) => {
    return urlRegex({ strict: false, exact: true }).test(urlString);
  };

  const validateWebsite = (website: string) => {
    if (!isValidUrl(website)) console.warn("Invalid url for website");
    setSocials((prevSocials) => ({ ...prevSocials, website }));
  };

  const validateTwitter = (twitter: string) => {
    if (!isValidUrl(twitter)) console.warn("Invalid url for twitter");
    setSocials((prevSocials) => ({ ...prevSocials, twitter }));
  };

  const validateCommunity = (community: string) => {
    if (!isValidUrl(community)) console.warn("Invalid url for community");
    setSocials((prevSocials) => ({ ...prevSocials, community }));
  };

  const validateImage = (image: string) => {
    if (!isValidUrl(image)) console.warn("Invalid url for image");
    setSocials((prevSocials) => ({ ...prevSocials, image }));
  };

  const validateToken = (token: string) => {
    if (!isValidAddress(token)) console.warn("Invalid tokenAddress");
    setSocials((prevSocials) => ({ ...prevSocials, token }));
  };

  const validateDescription = (description: string) => {
    setSocials((prevSocials) => ({ ...prevSocials, description }));
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
      </div>
    );
  };

  return (
    <BackdropCommon open={popupPay}>
      <div ref={menuRef} className="bg-green-100 text-black">
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
          {TextField({ id: "community", type: "url", validate: validateImage })}
          {TextField({ id: "token", type: "text", validate: validateToken })}
          {TextField({
            id: "description",
            type: "text",
            validate: validateDescription,
          })}
        </div>
      </div>
    </BackdropCommon>
  );
}
