import { CarReader } from '@ipld/car'
import * as DID from '@ipld/dag-ucan/did'
import * as Delegation from '@ucanto/core/delegation'
import * as Signer from '@ucanto/principal/ed25519'
import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
 
import fs from 'fs';


const proofString = fs.readFileSync('/home/badu/workspace/satik/app/proof.car');

async function backend(did) {
  // Load client with specific private key
  const principal = Signer.parse("MgCYpoODCmRTU7BKWfaZF2m3z9EJnkobriygPxx+qbi+01+0BSVhyI5RpPylk68tkKaX3WgL1O305qzl6+fRemuqT8+0=")
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
 
  // Add proof that this agent has been delegated capabilities on the space
    const proof = await parseProof(proofString)
    console.log("Proof: ", proof);
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())

  // console.log(File)


  // const files = [
  //   new File(['some-file-content'], 'upload/readme.md'),
  // ]
 

}

async function parseProof(data) {
  console.log(typeof(data))
  const blocks = []
  const reader = await CarReader.fromBytes(data)
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return Delegation.importDAG(blocks)
}

backend("did:key:z6MkjPa2f5qh8GuxYFZ9yNyUcygoxCpxnEEehxfRv7aC1Wsv")