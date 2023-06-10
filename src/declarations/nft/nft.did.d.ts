import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getApplicant' : () => Promise<Principal>,
  'getAsset' : () => Promise<Array<number>>,
  'getCanisterId' : () => Promise<Principal>,
  'getCertificationAuthority' : () => Promise<Principal>,
  'getName' : () => Promise<string>,
  'getOwner' : () => Promise<Principal>,
  'transferOwnership' : (arg_0: Principal) => Promise<string>,
}
export interface _SERVICE extends NFT {}
