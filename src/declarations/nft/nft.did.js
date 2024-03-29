export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getApplicant' : IDL.Func([], [IDL.Principal], ['query']),
    'getAsset' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'getCertificationAuthority' : IDL.Func([], [IDL.Principal], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'transferOwnership' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [
    IDL.Text,
    IDL.Principal,
    IDL.Vec(IDL.Nat8),
    IDL.Principal,
    IDL.Principal,
  ];
};
