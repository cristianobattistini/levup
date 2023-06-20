import type { Principal } from '@dfinity/principal';
export interface User {
  'userType' : string,
  'principal' : Principal,
  'name' : string,
}
export interface _SERVICE {
  'burn' : (arg_0: Principal) => Promise<string>,
  'getLevupCanisterID' : () => Promise<Principal>,
  'getOwnedNFTs' : () => Promise<Array<Principal>>,
  'getPersonalData' : () => Promise<User>,
  'isPrincipalAlreadyRegistered' : () => Promise<boolean>,
  'mint' : (arg_0: Array<number>, arg_1: string, arg_2: Principal) => Promise<
      Principal
    >,
  'registerUser' : (arg_0: string, arg_1: string) => Promise<User>,
  'transfer' : (arg_0: Principal, arg_1: Principal) => Promise<string>,
}
