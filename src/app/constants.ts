import { Connection } from "@solana/web3.js";
import AnchorInterface from "./web3/program";

export const WSOL_ADDRESS = "So11111111111111111111111111111111111111112";
export const TOKEN_ADDRESS = "A4SvyMLMGXrHR8ahP7qotUrKvGD8KgbdAcLNs3nbVftE";
export const TOKEN_ARRAY = [WSOL_ADDRESS, TOKEN_ADDRESS];
export const FETCH_BALANCE_INTERVAL_MS = 20000;
export const SERVER_URL = "http://localhost:3001";
export const RPC_URL_KEY = "RPC_URL";
export const ERASE_PIXELS_CODE = -1;
export const SQUARE_BORDER_COLOR = "616e96";
// we're using a class because for some reason we need to instantiate a wallet with connection
// if we want to have access to the IDL constants
const anchorInterface = new AnchorInterface(null as unknown as Connection);
export const {
  MAX_DATA_SIZE,
  PX_SIZE,
  PX_HEIGHT,
  PX_WIDTH,
  DATA_DELIMITER,
  MAX_SOCIALS_SIZE,
  STRING_DELIMITER,
} = anchorInterface;
