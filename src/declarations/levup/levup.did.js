export const idlFactory = ({ IDL }) => {
  const Note = IDL.Record({ 'title' : IDL.Text, 'content' : IDL.Text });
  return IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'createNote' : IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
    'getNotes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'greet' : IDL.Func([], [IDL.Text], ['query']),
    'payOut' : IDL.Func([], [IDL.Text], []),
    'removeNote' : IDL.Func([IDL.Nat], [], ['oneway']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
