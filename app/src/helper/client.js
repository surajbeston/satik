import { CarReader } from "@ipld/car";
import * as DID from "@ipld/dag-ucan/did";
import * as Delegation from "@ucanto/core/delegation";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import jseu from "js-encoding-utils";

export async function createClient(files) {
  const principal = Signer.parse(import.meta.env.VITE_PRIVATE_KEY);

  const store = new StoreMemory();

  const client = await Client.create({ principal, store });

  // Add proof that this agent has been delegated capabilities on the space
  const base64Data = import.meta.env.VITE_PROOF;

  const proof = await parseProof(base64Data);

  const space = await client.addSpace(proof);

  await client.setCurrentSpace(space.did());

  // const directoryCid = await client.uploadDirectory(files);
  const fileCid = await client.uploadFile(files);
  const url = `https://${fileCid.toString()}.ipfs.w3s.link`;
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  link.click();
  console.log("done");
}

async function parseProof(data) {
  const blocks = [];
  const reader = await CarReader.fromBytes(jseu.encoder.decodeBase64(data));
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return Delegation.importDAG(blocks);
}
