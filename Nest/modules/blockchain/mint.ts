import { Connection } from '@metaplex/js';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  Collection,
  CreateMasterEditionV3,
  CreateMetadataV2,
  Creator,
  DataV2,
  UpdateMetadataV2,
  Uses,
} from '@metaplex-foundation/mpl-token-metadata';
import * as anchor from '@project-serum/anchor';
import { HttpException } from '@nestjs/common';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  getMasterEdition,
  getMetadata,
  getTokenWallet,
} from '../nft/helpers/account';
import { sendTransactionWithRetryWithKeypair } from '../nft/helpers/transactions';
import fetch from 'node-fetch';

export type MintResult = {
  metadataAccount: PublicKey;
  mint: PublicKey;
};

function validateMetadata({
  metadata,
  uri,
  verifyCreators = true,
  collection,
  uses,
}): DataV2 | undefined {
  metadata.seller_fee_basis_points = 250;
  if (
    !metadata.name ||
    !metadata.image ||
    isNaN(metadata.seller_fee_basis_points) ||
    !metadata.properties ||
    !Array.isArray(metadata.properties.creators)
  ) {
    throw new HttpException('Invalid metadata file', 400);
  }
  const metaCreators = metadata.properties.creators;
  if (
    metaCreators.some((creator) => !creator.address) ||
    metaCreators.reduce((sum, creator) => creator.share + sum, 0) !== 100
  ) {
    throw new HttpException('Invalid array of creators', 400);
  }
  const creators = metaCreators.map(
    (creator) =>
      new Creator({
        address: creator.address,
        share: creator.share,
        verified: verifyCreators,
      }),
  );
  return new DataV2({
    symbol: metadata.symbol,
    name: metadata.name,
    uri,
    sellerFeeBasisPoints: metadata.seller_fee_basis_points,
    creators: creators,
    collection: collection
      ? new Collection({ key: collection.toBase58(), verified: false })
      : null,
    uses,
  });
}

async function createMetadata(
  metadataLink: string,
  verifyCreators: boolean,
  collection?: PublicKey,
  uses?: Uses,
): Promise<DataV2 | undefined> {
  let metadata;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    metadata = await (
      await fetch(metadataLink, { method: 'GET', signal: controller.signal })
    ).json();
    clearTimeout(timeoutId);
  } catch (e) {
    console.log(e);
    return;
  }
  return validateMetadata({
    metadata,
    uri: metadataLink,
    verifyCreators,
    collection,
    uses,
  });
}

export async function mintToken(
  connection: Connection,
  walletKeypair: Keypair,
  metadataLink: string,
  mutableMetadata = true,
  collection: PublicKey = null,
  maxSupply = 0,
  verifyCreators: boolean,
  use: Uses = null,
  receivingWallet: PublicKey = null,
): Promise<MintResult> {
  const data = await createMetadata(
    metadataLink,
    verifyCreators,
    collection,
    use,
  );
  if (!data) return;

  // Create wallet from keypair
  const wallet = new anchor.Wallet(walletKeypair);
  if (!wallet?.publicKey)
    throw new HttpException('The wallet must have a public key', 400);

  // Allocate memory for the account
  const mintRent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span,
  );
  // Generate a mint
  const mint = anchor.web3.Keypair.generate();
  const instructions: TransactionInstruction[] = [];
  const signers: anchor.web3.Keypair[] = [mint, walletKeypair];

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  );
  instructions.push(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey,
    ),
  );
  const userTokenAccoutAddress = await getTokenWallet(
    wallet.publicKey,
    mint.publicKey,
  );
  instructions.push(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccoutAddress,
      wallet.publicKey,
      wallet.publicKey,
    ),
  );

  // Create metadata
  const metadataAccount = await getMetadata(mint.publicKey);
  instructions.push(
    ...new CreateMetadataV2(
      { feePayer: wallet.publicKey },
      {
        metadata: metadataAccount,
        metadataData: data,
        updateAuthority: wallet.publicKey,
        mint: mint.publicKey,
        mintAuthority: wallet.publicKey,
      },
    ).instructions,
  );

  instructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccoutAddress,
      wallet.publicKey,
      [],
      1,
    ),
  );

  // Create master edition
  const editionAccount = await getMasterEdition(mint.publicKey);
  instructions.push(
    ...new CreateMasterEditionV3(
      {
        feePayer: wallet.publicKey,
      },
      {
        edition: editionAccount,
        metadata: metadataAccount,
        mint: mint.publicKey,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
        maxSupply: new anchor.BN(maxSupply),
      },
    ).instructions,
  );

  if (!mutableMetadata) {
    instructions.push(
      ...new UpdateMetadataV2(
        {},
        {
          metadata: metadataAccount,
          metadataData: data,
          updateAuthority: walletKeypair.publicKey,
          primarySaleHappened: null,
          isMutable: false,
        },
      ).instructions,
    );
  }
  if (receivingWallet) {
    const derivedAccount = await getTokenWallet(
      receivingWallet,
      mint.publicKey,
    );
    const createdAccountIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      derivedAccount,
      receivingWallet,
      wallet.publicKey,
    );
    const transferIx = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      userTokenAccoutAddress,
      derivedAccount,
      wallet.publicKey,
      signers,
      1,
    );
    const closeAccountIx = Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      userTokenAccoutAddress,
      wallet.publicKey,
      wallet.publicKey,
      signers,
    );
    instructions.push(createdAccountIx, transferIx, closeAccountIx);
  }
  const res = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeypair,
    instructions,
    signers,
  );

  try {
    await connection.confirmTransaction(res.txid, 'max');
  } catch {
    // ignore
  }

  // Force wait for max confirmations
  await connection.getParsedTransaction(res.txid, 'confirmed');

  console.log('NFT created', res.txid);
  console.log('\nNFT: Mint Address is ', mint.publicKey.toBase58());
  console.log('NFT: Metadata address is ', metadataAccount.toBase58());
  return { metadataAccount, mint: mint.publicKey };
}
