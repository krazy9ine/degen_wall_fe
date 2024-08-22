import { Program, Provider } from "@coral-xyz/anchor";
import {
  AccountStruct,
  AnchorArray,
  BorshDeserializeParams,
  ConstantType,
  FieldType,
  MetadataAccount,
  MetadataAccountCreatedEvent,
  MetadataAccountParsed,
  StringType,
  validateString,
} from "../types";
import * as borsh from "@coral-xyz/borsh";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
import { DegenWall } from "./degen_wall";
import IDL from "./idl.json";

export default class AnchorInterface {
  public program: Program<DegenWall>;
  public readonly MAX_DATA_SIZE: number;
  public readonly PX_SIZE: number;
  public readonly PX_WIDTH: number;
  public readonly PX_HEIGHT: number;
  public readonly DATA_DELIMITER: number;

  constructor(wallet: Provider) {
    this.program = new Program<DegenWall>(IDL as DegenWall, wallet);
    this.MAX_DATA_SIZE = this.getNumberValue("maxDataSize");
    this.PX_SIZE = this.getNumberValue("pxSize");
    this.PX_WIDTH = this.getNumberValue("pxWidth");
    this.PX_HEIGHT = this.getNumberValue("pxHeight");
    this.DATA_DELIMITER = this.getNumberValue("dataDelimiter");
  }

  updateProgram(wallet: Provider) {
    this.program = new Program<DegenWall>(IDL as DegenWall, wallet);
  }

  getParsedEvent(event: MetadataAccountCreatedEvent) {
    return this.getParsedAccount(event);
  }

  async getAllAccounts() {
    const accountsDeserialized = await this.getAccountsDeserialized();
    if (!accountsDeserialized?.length) {
      console.log("There are no existing accounts!");
      return null;
    }
    return accountsDeserialized
      .map((account) => this.getParsedAccount(account))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private getNumberValue(key: ConstantType): number {
    const value = Number(this.getConstantValue(key));
    if (isNaN(value)) {
      throw new Error(`Invalid data type for ${key}`);
    }
    return value;
  }

  private getStringSize(name: StringType) {
    const stringOffset = 4;
    let stringLength: number;
    switch (name) {
      case "website":
      case "community":
      case "image":
        stringLength = Number(this.getConstantValue("urlLength"));
        break;
      case "twitter":
        stringLength = Number(this.getConstantValue("twitterLength"));
        break;
      default:
        throw new Error(`Invalid StringType for ${name}`);
    }
    if (isNaN(stringLength))
      throw new Error(`Constant ${name} is not a number`);
    return stringOffset + stringLength;
  }

  private getConstantValue(constantName: ConstantType) {
    const constant = this.program.idl.constants.find(
      (constant) => constant.name === constantName
    );
    if (!constant)
      throw new Error(`Couldn't parse string size for ${constantName}`);
    return constant.value;
  }

  private getTypeSize(field: FieldType) {
    const { type, name } = field;
    switch (type) {
      case "u8":
      case "i8":
      case "bool":
        return 1;
      case "u16":
      case "i16":
        return 2;
      case "u32":
      case "i32":
        return 4;
      case "u64":
      case "i64":
        return 8;
      case "u128":
      case "i128":
        return 16;
      case "pubkey":
        return 32;
      case "string": // Let's avoid strings since usually they're variable in length
        const validatedName = validateString(name);
        return this.getStringSize(validatedName);
      default: //@ts-ignore
        return this.getArraySize(type.array);
    }
  }

  private getArraySize(array: AnchorArray): number {
    const anchorPrimitive = array[0];
    const arrayLength = array[1];
    const primitiveSize = this.getTypeSize({
      type: anchorPrimitive,
      name: "DefinitelyNotAString",
    });
    return primitiveSize * arrayLength;
  }

  private getAccountStruct(name: string) {
    const accountStruct = this.program.idl.types.find(
      (acc) => acc.name === name
    )?.type;
    if (!accountStruct) throw new Error(`Account ${name} doesn't exist`);
    return accountStruct;
  }

  private getOffset(name: string, accountName: AccountStruct) {
    const accountStruct = this.getAccountStruct(accountName);
    let offset = 8; // discriminator offset
    let { fields } = accountStruct;
    let fieldPosition = 0;
    for (const field of fields) {
      if (field.name === name) break;
      // @ts-ignore
      offset += this.getTypeSize(field);
      fieldPosition++;
    }
    if (fieldPosition === fields.length)
      throw new Error(
        `Fieldname ${name} doesnt exist for account ${accountName} return getOffset`
      );
    return offset;
  }

  private getEncodedValue(input: number | string) {
    if (typeof input === "number") return bs58.encode([input]);
    if (typeof input === "string") return bs58.encode(Buffer.from(input));
    throw new Error(`Invalid input ${input} for encoding`);
  }

  private getStructField(field: FieldType) {
    const { name, type } = field;
    if (type === "pubkey") return borsh.publicKey(name);
    if (type === "string") return borsh.str(name);
    if (typeof type === "string")
      //@ts-ignore
      return borsh[type](name);
    const { array } = type;
    if (array) {
      const [subType, length] = array;
      //@ts-ignore
      return borsh.array(borsh[subType]("undefined"), length, name);
    }
  }

  private deserialize(
    data: Buffer,
    params: BorshDeserializeParams
  ): MetadataAccount {
    const { from, to, account } = params;
    const accountStruct = this.getAccountStruct(account);
    const { fields } = accountStruct;
    const fromIndex = from
      ? fields.findIndex((field) => field.name === from)
      : 0;
    const toIndex = to
      ? fields.findIndex((field) => field.name === to)
      : fields.length;
    if (fromIndex < 0) throw new Error(`Invalid from arg ${from}`);
    if (toIndex < 0) throw new Error(`Invalid to arg  ${to}`);
    if (fromIndex >= toIndex)
      throw new Error(
        `from ${from} cannot be at an index equal or greater than to ${to}`
      );
    const structArray = [];
    for (let i = fromIndex; i < toIndex; i++) {
      //@ts-ignore
      structArray.push(this.getStructField(fields[i]));
    }
    return borsh.struct(structArray).decode(data);
  }

  private async getAccountsDeserialized(): Promise<MetadataAccount[]> {
    const { ANCHOR_PROVIDER_URL } = process.env;
    if (!ANCHOR_PROVIDER_URL)
      throw new Error(`ANCHOR_PROVIDER_URL not defined`);
    const connection = new Connection(ANCHOR_PROVIDER_URL);
    const accountStruct: AccountStruct = "metadataAccount";
    const startField = "mint";
    const fieldToMatch = "version";
    const METADATA_ACCOUNT_SIZE =
      8 + // anchor discriminator
      1 + // bump
      32 + // id
      1 + // version
      8 + // epoch
      32 + // mint
      8 + // timestamp
      32 + // payer
      // user input
      32 + // token
      Number(this.getConstantValue("maxDataSize")) + // data -> max 100 pixels
      4 * 4 + // 4 strings * offset
      Number(this.getConstantValue("urlLength")) * 3 + // website + community + image
      Number(this.getConstantValue("twitterLength")); // twitter
    const accountsSerialized = await connection.getProgramAccounts(
      this.program.programId,
      {
        filters: [
          {
            memcmp: {
              bytes: this.getEncodedValue(
                Number(this.getConstantValue(fieldToMatch))
              ),
              offset: this.getOffset(fieldToMatch, accountStruct),
            },
          },
        ],
        dataSlice: {
          offset: this.getOffset(startField, accountStruct),
          length:
            METADATA_ACCOUNT_SIZE - this.getOffset(startField, accountStruct),
        },
      }
    );
    return accountsSerialized.map((account) =>
      this.deserialize(account.account.data, {
        account: accountStruct,
        from: startField,
      })
    );
  }

  private getParsedAccount(account: MetadataAccount): MetadataAccountParsed {
    const { mint, timestamp, payer, token, data } = account;
    return {
      ...account,
      mint: mint.toString(),
      timestamp: Number(timestamp),
      payer: payer.toString(),
      token: token.toString(),
      data: data,
    };
  }
}
