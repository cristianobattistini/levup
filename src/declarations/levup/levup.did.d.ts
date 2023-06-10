import type { Principal } from '@dfinity/principal';
export interface Note { 'title' : string, 'content' : string }
export interface _SERVICE {
  'balanceOf' : (arg_0: Principal) => Promise<bigint>,
  'createNote' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'getNotes' : () => Promise<Array<Note>>,
  'greet' : () => Promise<string>,
  'payOut' : () => Promise<string>,
  'removeNote' : (arg_0: bigint) => Promise<undefined>,
  'transfer' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
}
