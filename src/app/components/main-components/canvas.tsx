"use client";

import { WSOL_ADDRESS } from "@/app/constants";
import { EventListenerContext } from "@/app/context/EventListenerProvider";
import {
  CanvasLayout,
  MetadataAccountParsed,
  MetadataItem,
  Socials,
} from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import urlRegex from "url-regex";

const DEFAULLT_PAYER = "DEGenPMwjmLCw9LmdvfCUK5M4XKrbep2rts4DDqG3J5x";
const DEFAULT_TOKEN = WSOL_ADDRESS;
const DEFAULT_WEBSITE = "https://cacat.com";
const DEFAULT_TWITTER = "https://x.com";
const DEFAULT_COMMUNITY = "https://t.me";
const DEFAULT_IMAGE = "https://imgur.com";
const DEFAULT_COLOR = "ffffff";
const URL_PREFIX = "https://";
const CANVAS_DISPLAY_RATIO = 0.8;
const CANVAS_WIDTH = 100;
const CANVAS_HEIGHT = 50;
const SQUARE_MIN_SIZE = 12;

const TWITTER_REGEX = /^[a-zA-Z0-9_]{1,15}$/;
const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

const getDefaultSocials = (): Socials => {
  return {
    payer: DEFAULLT_PAYER,
    token: DEFAULT_TOKEN,
    website: DEFAULT_WEBSITE,
    twitter: DEFAULT_TWITTER,
    community: DEFAULT_COMMUNITY,
    image: DEFAULT_IMAGE,
  };
};

const getDefaultPixel = (socials: Socials): MetadataItem => {
  return {
    color: DEFAULT_COLOR,
    socials,
  };
};

const getDefaultCanvas = (): CanvasLayout => {
  const default_socials = getDefaultSocials();
  const default_pixel = getDefaultPixel(default_socials);
  return Array.from({ length: CANVAS_HEIGHT }, () =>
    Array(CANVAS_WIDTH).fill(default_pixel)
  );
};

const parseImage = (image: string) => {
  if (IMAGE_REGEX.test(image)) return image;
  console.warn(`Invalid image ${image}`);
  return "";
};

const parseUrl = (urlString: string, name: string) => {
  urlString = URL_PREFIX + urlString;
  try {
    const isValidUrl = urlRegex({ strict: false, exact: true }).test(urlString);
    if (!isValidUrl) {
      console.warn(`Invalid url ${urlString} for ${name}`);
      return "";
    }
    return urlString;
  } catch (error) {
    console.warn(`Invalid url ${urlString} for ${name}: ${error}`);
    return "";
  }
};

const parseTwitter = (twitter: string) => {
  if (TWITTER_REGEX.test(twitter)) return "https://x.com/" + twitter;
  console.warn(`Invalid twitter ${twitter}`);
  return "";
};

const parseSocials = (socials: Socials) => {
  let { payer, token, website, twitter, community, image } = socials;
  if (!payer)
    throw new Error(`Invalid payer for website ${website} and token ${token}`);
  if (!token) throw new Error(`Invalid token for payer ${payer}`);
  if (token === DEFAULT_TOKEN) token = "";
  if (website) website = parseUrl(website, "website");
  if (twitter) twitter = parseTwitter(twitter);
  if (community) community = parseUrl(community, "community");
  if (image) image = parseUrl(image, "image");
  if (image) image = parseImage(image);
  return { payer, token, website, twitter, community, image };
};

export default function Canvas() {
  const setEventHandler = useContext(EventListenerContext);
  const isInitialRender = useRef(true);
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>(getDefaultCanvas());

  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    typeof window !== "undefined"
      ? Math.floor((window.innerWidth * CANVAS_DISPLAY_RATIO) / CANVAS_WIDTH)
      : SQUARE_MIN_SIZE
  );

  const dodoo = (event: MetadataAccountParsed) => {
    console.log(event);
    // Add your event handling logic here
    // Example: Update canvasLayout based on event
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setEventHandler(dodoo);
    }
  }, [setEventHandler]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${CANVAS_HEIGHT}, ${squareSize}px)`,
        gridTemplateColumns: `repeat(${CANVAS_WIDTH}, ${squareSize}px)`,
        gap: '1px', // Add a gap if needed to separate the squares
      }}
    >
      {canvasLayout.flat().map((pixel, index) => {
        const x = index % CANVAS_WIDTH;
        const y = Math.floor(index / CANVAS_WIDTH);
        return (
          <div
            key={`${x}-${y}`}
            style={{
              backgroundColor: pixel.color,
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              // You can add more styles or classes here if needed
            }}
            onMouseEnter={() => console.log(`Hovered on col ${x}, row ${y}`)}
            // You can add more event handlers here
          />
        );
      })}
    </div>
  );
}
