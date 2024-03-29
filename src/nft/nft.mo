import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8], nftApplicant: Principal, nftCertificationAuthority: Principal) = this {
  
  private let itemName = name;
  private var nftOwner = owner;
  private let asset = content;
  private let certificationAuthority = nftCertificationAuthority;
  private let applicant = nftApplicant;
    private stable var blackHole: Principal = Principal.fromText("aaaaa-aa");

  public query func getName() : async Text{
    return itemName;
  };

  public query func getOwner() : async Principal {
    return nftOwner;
  };

  public query func getAsset() : async [Nat8] {
    return asset;
  };

  public query func getApplicant() : async Principal {
    return applicant;
  };

  public query func getCertificationAuthority() : async Principal {
    return certificationAuthority;
  };

  public query func getCanisterId() : async Principal {
    return Principal.fromActor(this);
  };

  public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
    //TODO burn non funziona correttamente, da rivedere
    if (msg.caller == nftOwner) {
      nftOwner := newOwner;
      return "Success";
    } else {
      return "Error: Not initated by NFT Owner."
    }
  }

};