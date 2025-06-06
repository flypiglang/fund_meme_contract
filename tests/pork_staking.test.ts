import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fundmeme } from "../target/types/fundmeme";
import { assert } from "chai";

import secret from "../deploy_wallet/deploy.json";

import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  transfer,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  setAuthority,
  AuthorityType,
  getMint,
} from "@solana/spl-token";

import { PublicKey, Keypair, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

describe("pork_staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Fundmeme as Program<Fundmeme>;

  const authKp = Keypair.fromSecretKey(new Uint8Array(secret));

  // const secondKp = Keypair.fromSecretKey(new Uint8Array(secondSecret));

  const firstKp = new Keypair();

  const secondKp = new Keypair();

  let porkMint: any;
  let porkStake: any;
  let stakeAta: any;

  let treasuryAta: any;
  let authAta: any;
  let treasuryUser: any;

  let firstAta: any;
  let firstUser: any;

  let secondAta: any;
  let secondUser: any;

  let bump: any;
  let userBump: any;

  let initialAmount = BigInt("1000000000000000000");

  let firstAmount = BigInt("500000000000000000");

  let secondAmount = BigInt("500000000000000000");

  let minimumDeposit = new anchor.BN("1000000000000");

  let firstDeposit = new anchor.BN("20000000000000000");

  let secondDeposit = new anchor.BN("20000000000000000");

  before(async () => {});

  afterEach(function () {});

  // it("Set Up!", async () => {
  //   const signature1 = await program.provider.connection.requestAirdrop(
  //     firstKp.publicKey,
  //     3_000_000_000
  //   );

  //   const {
  //     blockhash: blockhash1,
  //     lastValidBlockHeight: lastValidBlockHeight1,
  //   } = await program.provider.connection.getLatestBlockhash();

  //   await program.provider.connection.confirmTransaction(
  //     {
  //       blockhash: blockhash1,
  //       lastValidBlockHeight: lastValidBlockHeight1,
  //       signature: signature1,
  //     },
  //     "finalized"
  //   );

  //   const signature2 = await program.provider.connection.requestAirdrop(
  //     secondKp.publicKey,
  //     3_000_000_000
  //   );

  //   const {
  //     blockhash: blockhash2,
  //     lastValidBlockHeight: lastValidBlockHeight2,
  //   } = await program.provider.connection.getLatestBlockhash();

  //   await program.provider.connection.confirmTransaction(
  //     {
  //       blockhash: blockhash2,
  //       lastValidBlockHeight: lastValidBlockHeight2,
  //       signature: signature2,
  //     },
  //     "finalized"
  //   );

  //   porkMint = await createMint(
  //     program.provider.connection,
  //     authKp,
  //     authKp.publicKey,
  //     null,
  //     9
  //   );

  //   authAta = await createAssociatedTokenAccount(
  //     program.provider.connection,
  //     authKp,
  //     porkMint,
  //     authKp.publicKey
  //   );

  //   await mintTo(
  //     program.provider.connection,
  //     authKp,
  //     porkMint,
  //     authAta,
  //     authKp.publicKey,
  //     initialAmount
  //   );

  //   firstAta = await createAssociatedTokenAccount(
  //     program.provider.connection,
  //     firstKp,
  //     porkMint,
  //     firstKp.publicKey
  //   );

  //   await transfer(
  //     program.provider.connection,
  //     authKp,
  //     authAta,
  //     firstAta,
  //     authKp.publicKey,
  //     firstAmount
  //   );

  //   secondAta = await createAssociatedTokenAccount(
  //     program.provider.connection,
  //     secondKp,
  //     porkMint,
  //     secondKp.publicKey
  //   );

  //   await transfer(
  //     program.provider.connection,
  //     authKp,
  //     authAta,
  //     secondAta,
  //     authKp.publicKey,
  //     secondAmount
  //   );

  //   const firstTokenAccount =
  //     await program.provider.connection.getTokenAccountBalance(firstAta);

  //   console.log(firstTokenAccount.value.amount);

  //   const secondTokenAccount =
  //     await program.provider.connection.getTokenAccountBalance(secondAta);

  //   console.log(secondTokenAccount.value.amount);

  //   const mintData = await getMint(program.provider.connection, porkMint);
  //   console.log("before burning,,,,,,,,,,,,,,,", mintData.supply);

  //   [porkStake, bump] = PublicKey.findProgramAddressSync(
  //     [Buffer.from(anchor.utils.bytes.utf8.encode("pork"))],
  //     program.programId
  //   );

  //   stakeAta = getAssociatedTokenAddressSync(porkMint, porkStake, true);

  //   [treasuryUser] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(anchor.utils.bytes.utf8.encode("porkuser")),
  //       authKp.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );

  //   [firstUser] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(anchor.utils.bytes.utf8.encode("porkuser")),
  //       firstKp.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );

  //   [secondUser] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from(anchor.utils.bytes.utf8.encode("porkuser")),
  //       secondKp.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  // });

  it("Initialized!", async () => {
    const porkMint = new PublicKey(
      "A6My2f1rwcjevEgHGsr9jv3wtp5oiDyehhMKdzwqdbjm"
    );

    const programId = new PublicKey("BbyJ7ARrBFaU4xYs8yZvBeBuXCTYDXfrG4jFAsPfveFg");

    const [porkStake, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(anchor.utils.bytes.utf8.encode("pork"))],
      // program.programId
      programId
    );

    const stakeAta = getAssociatedTokenAddressSync(porkMint, porkStake, true);

    console.log(programId.toBase58());
    console.log(porkStake.toBase58());
    console.log(stakeAta.toBase58());

    // const txHash = await program.methods
    //   .initialize()
    //   .accounts({
    //     porkMint: porkMint,
    //     from: authKp.publicKey,
    //     // porkStake: porkStake,
    //     // stakeAta: stakeAta,
    //     // tokenProgram: TOKEN_PROGRAM_ID,
    //     // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     // systemProgram: anchor.web3.SystemProgram.programId,
    //   })
    //   .signers([authKp])
    //   .rpc({ skipPreflight: true });

    // console.log(`https://solscan.io/tx/${txHash}?cluster=devnet`);

    // await program.provider.connection.confirmTransaction(txHash, "finalized");
    // const stakeTokenAccount =
    //   await program.provider.connection.getTokenAccountBalance(stakeAta);

    // assert.strictEqual(
    //   parseInt(stakeTokenAccount.value.amount),
    //   0,
    //   "The 'stake' token account should have the transferred tokens"
    // );

    // const porkStakeData = await program.account.porkStake.fetch(porkStake);
    // console.log(porkStakeData);

    // await setAuthority(
    //   program.provider.connection,
    //   authKp,
    //   porkMint,
    //   authKp.publicKey,
    //   AuthorityType.MintTokens,
    //   porkStake
    // );

    // const mintData = await getMint(program.provider.connection, porkMint);
    // console.log(mintData.mintAuthority.toBase58());
    // console.log(authKp.publicKey.toBase58());
    // console.log(porkStake.toBase58());
  });

  // it("Minimum Deposit Error!", async () => {
  //   const txHash = await program.methods
  //     .deposit(minimumDeposit)
  //     .accounts({
  //       porkMint: porkMint,
  //       from: firstKp.publicKey,
  //       fromAta: firstAta,
  //       // porkStake: porkStake,
  //       stakeAta: stakeAta,
  //       // porkUser: firstUser,
  //       referral: secondKp.publicKey,
  //       // referralUser: null,
  //       treasuryAta: treasuryAta,
  //       // tokenProgram: TOKEN_PROGRAM_ID,
  //       // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       // systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([firstKp])
  //     .rpc({ skipPreflight: true });

  //   console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

  //   await program.provider.connection.confirmTransaction(txHash, "finalized");
  // });

  // it("First Deposited!", async () => {
  //   const amount = 10000;
  //   const decimals = new anchor.BN(1000_000_000);

  //   const deposit = new anchor.BN(amount).mul(decimals);

  //   try {
  //     let _secondUser = await program.account.porkUser.fetch(secondUser);

  //     console.log(
  //       "Second User Bigger Holder Timestamp: " +
  //         _secondUser.biggerHolderTimestamp.toString()
  //     );
  //     console.log(
  //       "Second User Bigger Holder Times: " +
  //         _secondUser.timesOfBiggerHolder.toString()
  //     );
  //     console.log(
  //       "Second User Deposited Amount: " + _secondUser.depostedAmount.toString()
  //     );
  //     console.log(
  //       "Second User Claimable Amount: " +
  //         _secondUser.claimableAmount.toString()
  //     );
  //     console.log(
  //       "Second User Last Deposited Timestamp: " +
  //         _secondUser.lastDepositTimestamp.toString()
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   try {
  //     const txHash = await program.methods
  //       .deposit(deposit)
  //       .accountsStrict({
  //         porkMint: porkMint,
  //         from: firstKp.publicKey,
  //         fromAta: firstAta,
  //         porkStake: porkStake,
  //         stakeAta: stakeAta,
  //         porkUser: firstUser,
  //         referral: secondKp.publicKey,
  //         referralUser: secondUser,
  //         // treasuryAta: treasuryAta,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([firstKp])
  //       .rpc({ skipPreflight: true });

  //     console.log(`https://solscan.io/tx/${txHash}?cluster=devnet`);

  //     await program.provider.connection.confirmTransaction(txHash, "finalized");

  //     const porkStakeData = await program.account.porkStake.fetch(porkStake);
  //     console.log(porkStakeData);

  //     const mintData = await getMint(program.provider.connection, porkMint);
  //     console.log("after burning,,,,,,,,,,,,,,,", mintData.supply);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   // try {
  //   //   let _secondUser = await program.account.porkUser.fetch(secondUser);

  //   //   console.log(
  //   //     "Second User Bigger Holder Timestamp: " +
  //   //       _secondUser.biggerHolderTimestamp.toString()
  //   //   );
  //   //   console.log(
  //   //     "Second User Bigger Holder Times: " +
  //   //       _secondUser.timesOfBiggerHolder.toString()
  //   //   );
  //   //   console.log(
  //   //     "Second User Deposited Amount: " + _secondUser.depostedAmount.toString()
  //   //   );
  //   //   console.log(
  //   //     "Second User Claimable Amount: " +
  //   //       _secondUser.claimableAmount.toString()
  //   //   );
  //   //   console.log(
  //   //     "Second User Last Deposited Timestamp: " +
  //   //       _secondUser.lastDepositTimestamp.toString()
  //   //   );
  //   // } catch (err) {
  //   //   console.error(err);
  //   // }

  //   // const stakeTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(stakeAta);

  //   // console.log("Smart Contract: " + stakeTokenAccount.value.amount);

  //   // const treasuryTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(treasuryAta);

  //   // console.log("Treasury Wallet: " + treasuryTokenAccount.value.amount);

  //   // const firstTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(firstAta);

  //   // console.log("First Wallet: " + firstTokenAccount.value.amount);

  //   // const secondTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(secondAta);

  //   // console.log("Second Wallet: " + secondTokenAccount.value.amount);

  //   // let _porkStake = await program.account.porkStake.fetch(porkStake);

  //   // console.log(
  //   //   "Smart Contract Deposited Amount: " + _porkStake.totalAmount.toString()
  //   // );

  //   // let _porkUser = await program.account.porkUser.fetch(firstUser);

  //   // console.log(
  //   //   "First User Bigger Holder Timestamp: " +
  //   //     _porkUser.biggerHolderTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "First User Bigger Holder Times: " +
  //   //     _porkUser.timesOfBiggerHolder.toString()
  //   // );
  //   // console.log(
  //   //   "First User Deposited Amount: " + _porkUser.depostedAmount.toString()
  //   // );
  //   // console.log(
  //   //   "First User Claimable Amount: " + _porkUser.claimableAmount.toString()
  //   // );
  //   // console.log(
  //   //   "First User Last Deposited Timestamp: " +
  //   //     _porkUser.lastDepositTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "First User Claimed Timestamp: " + _porkUser.claimedAmount.toString()
  //   // );
  // });

  // it("Second Deposited!", async () => {
  //   const txHash = await program.methods
  //     .deposit(secondDeposit)
  //     .accountsStrict({
  //       porkMint: porkMint,
  //       from: secondKp.publicKey,
  //       fromAta: secondAta,
  //       porkStake: porkStake,
  //       stakeAta: stakeAta,
  //       porkUser: secondUser,
  //       referral: firstKp.publicKey,
  //       referralUser: firstUser,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([secondKp])
  //     .rpc({ skipPreflight: true });

  //   console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

  //   await program.provider.connection.confirmTransaction(txHash, "finalized");

  //   const stakeTokenAccount =
  //     await program.provider.connection.getTokenAccountBalance(stakeAta);

  //   console.log("Smart Contract: " + stakeTokenAccount.value.amount);

  //   const firstTokenAccount =
  //     await program.provider.connection.getTokenAccountBalance(firstAta);

  //   console.log("First Wallet: " + firstTokenAccount.value.amount);

  //   const secondTokenAccount =
  //     await program.provider.connection.getTokenAccountBalance(secondAta);

  //   console.log("Second Wallet: " + secondTokenAccount.value.amount);

  //   let _porkStake = await program.account.porkStake.fetch(porkStake);

  //   console.log(
  //     "Smart Contract Deposited Amount: " + _porkStake.totalAmount.toString()
  //   );

  //   let _firstUser = await program.account.porkUser.fetch(firstUser);

  //   console.log(
  //     "First User Bigger Holder Timestamp: " +
  //       _firstUser.biggerHolderTimestamp.toString()
  //   );
  //   console.log(
  //     "First User Bigger Holder Times: " +
  //       _firstUser.timesOfBiggerHolder.toString()
  //   );
  //   console.log(
  //     "First User Deposited Amount: " + _firstUser.depostedAmount.toString()
  //   );
  //   console.log(
  //     "First User Claimable Amount: " + _firstUser.claimableAmount.toString()
  //   );
  //   console.log(
  //     "First User Last Deposited Timestamp: " +
  //       _firstUser.lastDepositTimestamp.toString()
  //   );

  //   let _secondUser = await program.account.porkUser.fetch(secondUser);

  //   console.log(
  //     "Second User Bigger Holder Timestamp: " +
  //       _secondUser.biggerHolderTimestamp.toString()
  //   );
  //   console.log(
  //     "Second User Bigger Holder Times: " +
  //       _secondUser.timesOfBiggerHolder.toString()
  //   );
  //   console.log(
  //     "Second User Deposited Amount: " + _secondUser.depostedAmount.toString()
  //   );
  //   console.log(
  //     "Second User Claimable Amount: " + _secondUser.claimableAmount.toString()
  //   );
  //   console.log(
  //     "Second User Last Deposited Timestamp: " +
  //       _secondUser.lastDepositTimestamp.toString()
  //   );
  // });

  // it("Second Deposited!", async () => {
  //   const txHash = await program.methods.deposit(secondDeposit)
  //     .accounts({
  //       porkMint: porkMint,
  //       from: secondKp.publicKey,
  //       fromAta: secondAta,
  //       porkStake: porkStake,
  //       stakeAta: stakeAta,
  //       porkUser: secondUser,
  //       referral: firstKp.publicKey,
  //       referralUser: firstUser,
  //       treasuryAta: treasuryAta,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       systemProgram: anchor.web3.SystemProgram.programId
  //     })
  //     .signers([secondKp])
  //     .rpc({ skipPreflight: true })

  //   console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

  //   await program.provider.connection.confirmTransaction(txHash, "finalized");

  //   const stakeTokenAccount = await program.provider.connection.getTokenAccountBalance(stakeAta);

  //   console.log("Smart Contract: " + stakeTokenAccount.value.amount);

  //   const treasuryTokenAccount = await program.provider.connection.getTokenAccountBalance(treasuryAta);

  //   console.log("Treasury Wallet: " + treasuryTokenAccount.value.amount);

  //   const firstTokenAccount = await program.provider.connection.getTokenAccountBalance(firstAta);

  //   console.log("First Wallet: " + firstTokenAccount.value.amount);

  //   const secondTokenAccount = await program.provider.connection.getTokenAccountBalance(secondAta);

  //   console.log("Second Wallet: " + secondTokenAccount.value.amount);

  //   let _porkStake = await program.account.porkStake.fetch(porkStake);

  //   console.log("Smart Contract Deposited Amount: " + _porkStake.totalAmount.toString());

  //   let _firstUser = await program.account.porkUser.fetch(firstUser);

  //   console.log("First User Bigger Holder Timestamp: " + _firstUser.biggerHolderTimestamp.toString());
  //   console.log("First User Bigger Holder Times: " + _firstUser.timesOfBiggerHolder.toString());
  //   console.log("First User Deposited Amount: " + _firstUser.depostedAmount.toString());
  //   console.log("First User Claimable Amount: " + _firstUser.claimableAmount.toString());
  //   console.log("First User Last Deposited Timestamp: " + _firstUser.lastDepositTimestamp.toString());

  //   let _secondUser = await program.account.porkUser.fetch(secondUser);

  //   console.log("Second User Bigger Holder Timestamp: " + _secondUser.biggerHolderTimestamp.toString());
  //   console.log("Second User Bigger Holder Times: " + _secondUser.timesOfBiggerHolder.toString());
  //   console.log("Second User Deposited Amount: " + _secondUser.depostedAmount.toString());
  //   console.log("Second User Claimable Amount: " + _secondUser.claimableAmount.toString());
  //   console.log("Second User Last Deposited Timestamp: " + _secondUser.lastDepositTimestamp.toString());

  // });

  // it("Compound!", async () => {
  //   await delay(10000);

  //   const txHash = await program.methods.compound()
  //     .accounts({
  //       signer: secondKp.publicKey,
  //       porkStake: porkStake,
  //       porkUser: secondUser,
  //       systemProgram: anchor.web3.SystemProgram.programId
  //     })
  //     .signers([secondKp])
  //     .rpc({ skipPreflight: true })

  //   console.log(`https://solscan.iotx/${txHash}?cluster=devnet`);

  //   await program.provider.connection.confirmTransaction(txHash, "finalized");

  //   const stakeTokenAccount = await program.provider.connection.getTokenAccountBalance(stakeAta);

  //   console.log("Smart Contract: " + stakeTokenAccount.value.amount);

  //   const treasuryTokenAccount = await program.provider.connection.getTokenAccountBalance(treasuryAta1);

  //   console.log("Treasury Wallet: " + treasuryTokenAccount.value.amount);

  //   const firstTokenAccount = await program.provider.connection.getTokenAccountBalance(firstAta);

  //   console.log("First Wallet: " + firstTokenAccount.value.amount);

  //   const secondTokenAccount = await program.provider.connection.getTokenAccountBalance(secondAta);

  //   console.log("Second Wallet: " + secondTokenAccount.value.amount);

  //   let _porkStake = await program.account.porkStake.fetch(porkStake);

  //   console.log("Smart Contract Deposited Amount: " + _porkStake.totalAmount.toString());

  //   let _firstUser = await program.account.porkUser.fetch(firstUser);

  //   console.log("First User Bigger Holder Timestamp: " + _firstUser.biggerHolderTimestamp.toString());
  //   console.log("First User Bigger Holder Times: " + _firstUser.timesOfBiggerHolder.toString());
  //   console.log("First User Deposited Amount: " + _firstUser.depostedAmount.toString());
  //   console.log("First User Claimable Amount: " + _firstUser.claimableAmount.toString());
  //   console.log("First User Last Deposited Timestamp: " + _firstUser.lastDepositTimestamp.toString());

  //   let _secondUser = await program.account.porkUser.fetch(secondUser);

  //   console.log("Second User Bigger Holder Timestamp: " + _secondUser.biggerHolderTimestamp.toString());
  //   console.log("Second User Bigger Holder Times: " + _secondUser.timesOfBiggerHolder.toString());
  //   console.log("Second User Deposited Amount: " + _secondUser.depostedAmount.toString());
  //   console.log("Second User Claimable Amount: " + _secondUser.claimableAmount.toString());
  //   console.log("Second User Last Deposited Timestamp: " + _secondUser.lastDepositTimestamp.toString());

  // });

  // it("Cashed out!", async () => {
  //   await delay(10_000);

  //   const mintData = await getMint(program.provider.connection, porkMint);
  //   console.log("cash out before burning,,,,,,,,,,,,,,,", mintData.supply);
  //   try {
  //     const txHash = await program.methods
  //       .cashout()
  //       .accountsStrict({
  //         porkMint: porkMint,
  //         to: secondKp.publicKey,
  //         toAta: secondAta,
  //         porkStake: porkStake,
  //         stakeAta: stakeAta,
  //         porkUser: secondUser,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([secondKp])
  //       .rpc({ skipPreflight: true });

  //     console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

  //     await program.provider.connection.confirmTransaction(txHash, "finalized");
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   const mintData2 = await getMint(program.provider.connection, porkMint);
  //   console.log("cash out before burning,,,,,,,,,,,,,,,", mintData2.supply);

  //   // const stakeTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(stakeAta);

  //   // console.log("Smart Contract: " + stakeTokenAccount.value.amount);

  //   // const firstTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(firstAta);

  //   // console.log("First Wallet: " + firstTokenAccount.value.amount);

  //   // const secondTokenAccount =
  //   //   await program.provider.connection.getTokenAccountBalance(secondAta);

  //   // console.log("Second Wallet: " + secondTokenAccount.value.amount);

  //   // let _porkStake = await program.account.porkStake.fetch(porkStake);

  //   // console.log(
  //   //   "Smart Contract Deposited Amount: " + _porkStake.totalAmount.toString()
  //   // );

  //   // let _firstUser = await program.account.porkUser.fetch(firstUser);

  //   // console.log(
  //   //   "First User Bigger Holder Timestamp: " +
  //   //     _firstUser.biggerHolderTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "First User Bigger Holder Times: " +
  //   //     _firstUser.timesOfBiggerHolder.toString()
  //   // );
  //   // console.log(
  //   //   "First User Deposited Amount: " + _firstUser.depostedAmount.toString()
  //   // );
  //   // console.log(
  //   //   "First User Claimable Amount: " + _firstUser.claimableAmount.toString()
  //   // );
  //   // console.log(
  //   //   "First User Last Deposited Timestamp: " +
  //   //     _firstUser.lastDepositTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "First User Claimed Timestamp: " + _firstUser.claimedAmount.toString()
  //   // );

  //   // let _secondUser = await program.account.porkUser.fetch(secondUser);

  //   // console.log(
  //   //   "Second User Bigger Holder Timestamp: " +
  //   //     _secondUser.biggerHolderTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "Second User Bigger Holder Times: " +
  //   //     _secondUser.timesOfBiggerHolder.toString()
  //   // );
  //   // console.log(
  //   //   "Second User Deposited Amount: " + _secondUser.depostedAmount.toString()
  //   // );
  //   // console.log(
  //   //   "Second User Claimable Amount: " + _secondUser.claimableAmount.toString()
  //   // );
  //   // console.log(
  //   //   "Second User Last Deposited Timestamp: " +
  //   //     _secondUser.lastDepositTimestamp.toString()
  //   // );
  //   // console.log(
  //   //   "Second User Claimed Timestamp: " + _secondUser.claimedAmount.toString()
  //   // );
  // });
});
