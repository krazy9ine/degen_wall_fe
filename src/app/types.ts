import { web3, BN } from "@coral-xyz/anchor";

export type Socials = {
  payer: string;
  token?: string;
  website?: string;
  twitter?: string;
  community?: string;
  image?: string;
};

export type MetadataItem = {
  color: string;
  socials: Socials;
};

export type Canvas = MetadataItem[][];

export type MetadataAccountCreatedEvent = {
  mint: web3.PublicKey;
  timestamp: BN;
  payer: web3.PublicKey;
  token: web3.PublicKey;
  data: number[];
  website: string;
  twitter: string;
  community: string;
  image: string;
};

export type MetadataAccountParsed = {
  mint: string;
  timestamp: number;
  payer: string;
  token: string;
  data: number[];
  website: string;
  twitter: string;
  community: string;
  image: string;
};

export type MetadataAccount = MetadataAccountCreatedEvent;

export type AnchorPrimitive =
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "i128"
  | "string"
  | "bool"
  | "pubkey";

export type AnchorArray = [AnchorPrimitive, number];

export type AnchorType = AnchorPrimitive | AnchorArray;

const validStrings = ["website", "twitter", "community", "image"];
export type StringType = "website" | "twitter" | "community" | "image";
export const validateString = (str: string) => {
  if (!validStrings.includes(str))
    throw new Error(`Invalid string argument ${str}`);
  return str as StringType;
};

export type ConstantType =
  | "urlLength"
  | "twitterLength"
  | "maxDataSize"
  | "version"
  | "pxSize"
  | "pxWidth"
  | "pxHeight"
  | "dataDelimiter";

export type FieldType = {
  name: string;
  type:
    | AnchorPrimitive
    | {
        array: AnchorArray;
      };
};

export type AccountStruct =
  | "createMetadataAccountParams"
  | "metadataAccount"
  | "metadataAccountCreated"
  | "poolAccount"
  | "solTreasuryAccount";

export type BorshDeserializeParams = {
  from?: string;
  to?: string;
  account: AccountStruct;
};

export type TokenAddress =
  | "So11111111111111111111111111111111111111112"
  | "A4SvyMLMGXrHR8ahP7qotUrKvGD8KgbdAcLNs3nbVftE";
export type BalanceCache = {
  timestamp: number;
  balance: number;
};
