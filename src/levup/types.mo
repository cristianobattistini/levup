import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import NFTActorClass "../nft/nft";

module {
  type ID = Nat;
  public type Timestamp = Int;
  public type CertificationMap = HashMap.HashMap<Principal, NftMap>;
  public type NftMap = HashMap.HashMap<Principal, NFTActorClass.NFT>;
  public type OwnerMap = HashMap.HashMap<Principal, NftMap>;


  public type certificationStatus = {
    #pending;
    #confirmed;
    #uncorfimed;
  };

  public type Error = {
    #Internal;
    #Unauthorized;
    #NotFound;
    #NotInitialized;
    #NotAllowed;
    #InvalidRequest;
    #InsufficientBalance;
    #InsufficientAllowance;
    #TokenNotExist;
    #InvalidOperator;
    #TransferError;
  };
};
