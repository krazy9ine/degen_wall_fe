import { DATA_DELIMITER, MAX_DATA_SIZE, PX_HEIGHT, PX_SIZE, PX_WIDTH, SERVER_URL, WSOL_ADDRESS } from "@/app/constants";
import {
  CanvasLayout,
  MetadataAccountParsed,
  MetadataItem,
  Socials,
} from "@/app/types";
import { isHealthyEndpoint } from "@/app/web3/misc";
import AnchorInterface from "@/app/web3/program";
import { Connection } from "@solana/web3.js";
import urlRegex from "url-regex";

const DEFAULLT_PAYER = "DEGenPMwjmLCw9LmdvfCUK5M4XKrbep2rts4DDqG3J5x";
const DEFAULT_TOKEN = WSOL_ADDRESS;
const DEFAULT_WEBSITE = "https://cacat.com";
const DEFAULT_TWITTER = "https://x.com";
const DEFAULT_COMMUNITY = "https://t.me";
const DEFAULT_IMAGE = "https://imgur.com";
const DEFAULT_NAME = "cacat";
const DEFAULT_TICKER = "CACAT";
const DEFAULT_DESCRIPTION = "BLABLABLA";
const DEFAULT_COLOR = "1b1d28";
const URL_PREFIX = "https://";

const TWITTER_REGEX = /^[a-zA-Z0-9_]{1,15}$/;
const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

let canvas: CanvasLayout = [];

export const getDefaultCanvas = (): CanvasLayout => {
  const default_socials = getDefaultSocials();
  const default_pixel = getDefaultPixel(default_socials);
  return Array(PX_WIDTH * PX_HEIGHT).fill(default_pixel);
};

const getDefaultSocials = (): Socials => {
  return {
    payer: DEFAULLT_PAYER,
    token: DEFAULT_TOKEN,
    website: DEFAULT_WEBSITE,
    twitter: DEFAULT_TWITTER,
    community: DEFAULT_COMMUNITY,
    image: DEFAULT_IMAGE,
    name: DEFAULT_NAME,
    ticker: DEFAULT_TICKER,
    description: DEFAULT_DESCRIPTION,
  };
};

const getDefaultPixel = (socials: Socials): MetadataItem => {
  return {
    color: DEFAULT_COLOR,
    socials,
  };
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
  let {
    payer,
    token,
    website,
    twitter,
    community,
    image,
    name,
    ticker,
    description,
  } = socials;
  if (!payer)
    throw new Error(`Invalid payer for website ${website} and token ${token}`);
  if (!token) throw new Error(`Invalid token for payer ${payer}`);
  if (token === DEFAULT_TOKEN) token = "";
  if (website) website = parseUrl(website, "website");
  if (twitter) twitter = parseTwitter(twitter);
  if (community) community = parseUrl(community, "community");
  if (image) image = parseUrl(image, "image");
  if (image) image = parseImage(image);
  return {
    payer,
    token,
    website,
    twitter,
    community,
    image,
    name,
    ticker,
    description,
  };
};

export const getUpdatedCanvas = (
  account: MetadataAccountParsed,
  pixelsLeft?: number
): [CanvasLayout, number] => {
  const {
    payer,
    token,
    data,
    website,
    twitter,
    community,
    image,
    name,
    ticker,
    description,
  } = account;
  const socialsRAW = {
    payer,
    token,
    website,
    twitter,
    community,
    image,
    name,
    ticker,
    description,
  };
  if (data.length !== MAX_DATA_SIZE)
    throw Error(`Invalid data size for ${socialsRAW}`);
  const socials = parseSocials(socialsRAW);
  for (let i = 0; i < MAX_DATA_SIZE; i += PX_SIZE) {
    const x = data[i];
    const y = data[i + 1];
    const R = data[i + 2];
    const G = data[i + 3];
    const B = data[i + 4];
    if (x === DATA_DELIMITER) break;
    if (x >= PX_WIDTH || x < 0) throw new Error(`Invalid x ${x} at index ${i}`);
    if (y >= PX_HEIGHT || y < 0) {
      throw new Error(`Invalid y ${y} at index ${i}`);
    }
    if (R < 0 || R > 255) throw new Error(`Invalid R ${R} at index ${i}`);
    if (G < 0 || G > 255) throw new Error(`Invalid G ${G} at index ${i}`);
    if (B < 0 || B > 255) throw new Error(`Invalid B ${B} at index ${i}`);
    const index = x + y * PX_WIDTH;
    if (pixelsLeft && canvas[index].socials.token === DEFAULT_TOKEN)
      pixelsLeft--;
    canvas[index] = {
      color: R.toString(16) + G.toString(16) + B.toString(16),
      socials,
    };
    if (pixelsLeft && pixelsLeft <= 0) break;
  }
  return pixelsLeft ? [canvas, pixelsLeft] : [canvas, 0];
};

const fetchLatestCanvas = async () => {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const canvas = (await response.json()) as CanvasLayout;
    return canvas;
  } catch (error) {
    console.error("Error fetching canvas data:", error);
    return getDefaultCanvas(); // Handle error as appropriate
  }
};

const updateCanvas = (
  canvas: CanvasLayout,
  account: MetadataAccountParsed,
  pixelsLeft?: number
) => {
  const { payer, token, data, website, twitter, community, image } = account;
  const socialsRAW = {
    payer,
    token,
    website,
    twitter,
    community,
    image,
  };
  if (data.length !== MAX_DATA_SIZE)
    throw Error(`Invalid data size for ${socialsRAW}`);
  const socials = parseSocials(socialsRAW);
  for (let i = 0; i < MAX_DATA_SIZE; i += PX_SIZE) {
    const x = data[i];
    const y = data[i + 1];
    const R = data[i + 2];
    const G = data[i + 3];
    const B = data[i + 4];
    if (x === DATA_DELIMITER) break;
    if (x >= PX_WIDTH || x < 0) throw new Error(`Invalid x ${x} at index ${i}`);
    if (y >= PX_HEIGHT || y < 0) {
      throw new Error(`Invalid y ${y} at index ${i}`);
    }
    if (R < 0 || R > 255) throw new Error(`Invalid R ${R} at index ${i}`);
    if (G < 0 || G > 255) throw new Error(`Invalid G ${G} at index ${i}`);
    if (B < 0 || B > 255) throw new Error(`Invalid B ${B} at index ${i}`);
    const index = x + y * PX_WIDTH;
    if (pixelsLeft && canvas[index].socials.token === DEFAULT_TOKEN)
      pixelsLeft--;
    canvas[index] = {
      color: R.toString(16) + G.toString(16) + B.toString(16),
      socials,
    };
    if (pixelsLeft && pixelsLeft <= 0) break;
  }
  return pixelsLeft ? pixelsLeft : 0;
};

const getLatestCanvas = async (endpoint: string) => {
  const canvas = getDefaultCanvas();
  const anchorInterface = new AnchorInterface(new Connection(endpoint));
  const accounts = await anchorInterface.getAllAccounts(endpoint);
  let pixelsLeft = PX_WIDTH * PX_WIDTH;
  if (accounts) {
    for (const account of accounts) {
      try {
        pixelsLeft = updateCanvas(canvas, account, pixelsLeft);
        if (pixelsLeft <= 0) break;
      } catch (error) {
        console.error(`Error for account ${JSON.stringify(account)}: ${error}`);
      }
    }
  }
  return canvas;
};

export const initAndGetCanvas = async (endpoint?: string) => {
  try {
    if (endpoint && (await isHealthyEndpoint(endpoint))) {
      return await getLatestCanvas(endpoint);
    }
    canvas = await fetchLatestCanvas();
    return canvas;
  } catch (error) {
    console.error(`Error retrieving canvas: ${error}`);
    return getDefaultCanvas();
  }
};
