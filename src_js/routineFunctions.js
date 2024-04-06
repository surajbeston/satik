import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, SystemProgram } from "@solana/web3.js";
import {
  FunctionRoutineAccount,
  SwitchboardWallet,
  TransactionObject,
  types,
} from "@switchboard-xyz/solana.js";
import {
  BN,
  parseCronSchedule,
  parseRawMrEnclave,
} from "@switchboard-xyz/common";

async function createInstruction(program, payer, params, wallet, options) {
  // TODO: Calculate the max size of data we can support up front then split into multiple txns
  const authorityPubkey = params.authority ?? payer;
  const routineKeypair = params.keypair ?? Keypair.generate();
  await program.verifyNewKeypair(routineKeypair);
  const functionState = await params.functionAccount.loadData();
  const cronSchedule = params.schedule
    ? Buffer.from(parseCronSchedule(params.schedule), "utf-8")
    : Buffer.from(Array(64).fill(0));

  console.log(cronSchedule);

  let escrowWallet;
  let escrowWalletAuthority;

  escrowWallet = SwitchboardWallet.fromSeed(
    program,
    functionState.attestationQueue,
    authorityPubkey,
    params.functionAccount.publicKey.toBytes()
  );
  escrowWalletAuthority = authorityPubkey;

  // const instruction = types.functionRoutineInit(
  //   program,
  //   {
  //     params: {
  //       // Metadata Config
  //       name: new Uint8Array(Buffer.from(params.name ?? "", "utf8")),
  //       metadata: new Uint8Array(Buffer.from(params.metadata ?? "", "utf8")),
  //       // Fees
  //       bounty: params?.bounty
  //         ? typeof params.bounty === "number"
  //           ? new BN(params.bounty)
  //           : params.bounty
  //         : null,
  //       // Execution Config
  //       schedule: cronSchedule,
  //       maxContainerParamsLen: null,
  //       containerParams: new Uint8Array(
  //         params.containerParams ?? Buffer.from("")
  //       ),
  //     },
  //   },
  //   {
  //     routine: routineKeypair.publicKey,
  //     authority: authorityPubkey,
  //     function: params.functionAccount.publicKey,
  //     functionAuthority: functionState.authority,
  //     escrowWallet: escrowWallet.publicKey,
  //     escrowWalletAuthority: escrowWalletAuthority,
  //     escrowTokenWallet: anchor.utils.token.associatedAddress({
  //       mint: program.mint.address,
  //       owner: escrowWallet.publicKey,
  //     }),
  //     mint: program.mint.address,
  //     attestationQueue: functionState.attestationQueue,
  //     payer,
  //     systemProgram: SystemProgram.programId,
  //     tokenProgram: TOKEN_PROGRAM_ID,
  //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //   }
  // );
  // return [
  //   new FunctionRoutineAccount(program, routineKeypair.publicKey),
  //   new TransactionObject(payer, [instruction], [routineKeypair], options),
  // ];
}

export async function create(program, params, wallet, options) {
  const [account, txnObject] = await createInstruction(
    program,
    program.walletPubkey,
    params,
    wallet,
    options
  );
  // const txSignature = await program.signAndSend(txnObject, options);
  // return [account, txSignature];
}
