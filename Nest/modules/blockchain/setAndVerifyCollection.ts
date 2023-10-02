import { Keypair, PublicKey } from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import { getMasterEdition, getMetadata } from '../nft/helpers/account';
import * as anchor from '@project-serum/anchor';
import { SetAndVerifyCollectionCollection } from '@metaplex-foundation/mpl-token-metadata';
import { sendTransactionWithRetryWithKeypair } from '../nft/helpers/transactions';

export async function setAndVerifyCollection(
  mintKey: PublicKey,
  connection: Connection,
  walletKeypair: Keypair,
  collectionMint: PublicKey,
) {
  const metadataAccount = await getMetadata(mintKey);
  const collectionMetadataAccount = await getMetadata(collectionMint);
  const collectionMasterEdition = await getMasterEdition(collectionMint);
  const signers: anchor.web3.Keypair[] = [walletKeypair];
  const tx = new SetAndVerifyCollectionCollection(
    { feePayer: walletKeypair.publicKey },
    {
      metadata: metadataAccount,
      collectionAuthority: walletKeypair.publicKey,
      collectionMint: collectionMint,
      updateAuthority: walletKeypair.publicKey,
      collectionMetadata: collectionMetadataAccount,
      collectionMasterEdition: collectionMasterEdition,
    },
  );
  try {
    return await sendTransactionWithRetryWithKeypair(
      connection,
      walletKeypair,
      tx.instructions,
      signers,
    );
  } catch (e) {
    return e.message;
  }
}
