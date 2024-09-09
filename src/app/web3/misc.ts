import { Connection, PublicKey } from "@solana/web3.js";

export const isHealthyEndpoint = async (endpoint: string) => {
  try {
    const connection = new Connection(endpoint);
    const result = await connection.getEpochInfo();
    if (result?.epoch) return true;
    return false;
  } catch (error) {
    console.error(`Error checking endpoint ${endpoint}: ${error}`);
    return false;
  }
};

export const isValidAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};
