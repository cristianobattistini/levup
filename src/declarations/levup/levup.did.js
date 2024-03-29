export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'userType' : IDL.Text,
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'burn' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'getLevupCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getOwnedNFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getPersonalData' : IDL.Func([], [User], []),
    'isPrincipalAlreadyRegistered' : IDL.Func([], [IDL.Bool], []),
    'mint' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Text, IDL.Principal],
        [IDL.Principal],
        [],
      ),
    'registerUser' : IDL.Func([IDL.Text, IDL.Text], [User], []),
    'transfer' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
