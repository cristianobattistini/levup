import type { Principal } from '@dfinity/principal';
export interface User {
  'userType' : string,
  'principal' : Principal,
  'name' : string,
}
export interface _SERVICE {
  'burn' : (arg_0: Principal, arg_1: Principal) => Promise<string>,
  'getLevupCanisterID' : () => Promise<Principal>,
  'getOwnedNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getPersonalData' : (arg_0: Principal) => Promise<User>,
  'isPrincipalAlreadyRegistered' : (arg_0: Principal) => Promise<boolean>,
  'mint' : (
      arg_0: Principal,
      arg_1: Array<number>,
      arg_2: string,
      arg_3: Principal,
    ) => Promise<Principal>,
  'registerUser' : (arg_0: Principal, arg_1: string, arg_2: string) => Promise<
      User
    >,
  'transfer' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
}
