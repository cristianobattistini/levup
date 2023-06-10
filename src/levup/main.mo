import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import T "types";
import NFTActorClass "../nft/nft";
import Cycles "mo:base/ExperimentalCycles";
import Option "mo:base/Option";

actor Levup{

  public type User = {
    firstName: Text;
    lastName: Text;
    email: Text;
    principal: Principal;
  };

  public type CertificationAuth = {
    name: Text;
    principal: Principal;
  };

  private stable var blackHole: Principal = Principal.fromText("aaaaa-aa");

  var nftMap = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var ownerMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var userMap = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);
  var certificationAuthorityMap = HashMap.HashMap<Principal, CertificationAuth>(1, Principal.equal, Principal.hash);


  stable var stable_nftMap: [(Principal, NFTActorClass.NFT)] = [];
  private stable var stable_ownedNftByUser: [(Principal, List.List<Principal>)] = [];
  stable var stable_userMap: [(Principal, User)] = [];
  private stable var stable_certificationAuthorityMap: [(Principal, CertificationAuth)] = [];


  private let adminsList = List.push<Principal>(Principal.fromText("rnn4p-xv3hp-ivazl-hg2mb-iwkct-3emfl-upkcr-tz7dm-uxxqk-c7hux-nae"), null);
  private let admin = Principal.fromText("rnn4p-xv3hp-ivazl-hg2mb-iwkct-3emfl-upkcr-tz7dm-uxxqk-c7hux-nae");
  // The work required before a canister upgrade begins.
  system func preupgrade() {
    // saving all nft stored in dapp
    stable_nftMap := Iter.toArray(nftMap.entries());
    // saving all nft stored by the user
    stable_ownedNftByUser := Iter.toArray(ownerMap.entries());
    stable_userMap := Iter.toArray(userMap.entries());
    stable_certificationAuthorityMap := Iter.toArray(certificationAuthorityMap.entries());
  };

  // The work required after a canister upgrade ends.
  system func postupgrade() {
    // reload inside hashMap all nft stored in dapp
    nftMap := HashMap.fromIter<Principal, NFTActorClass.NFT>(stable_nftMap.vals(), 1, Principal.equal, Principal.hash);
    // reload inside hashMap all nft stored by the user
    ownerMap := HashMap.fromIter<Principal, List.List<Principal>>(
            stable_ownedNftByUser.vals(), stable_ownedNftByUser.size(), Principal.equal, Principal.hash);
    userMap := HashMap.fromIter<Principal, User>(
            stable_userMap.vals(), stable_userMap.size(), Principal.equal, Principal.hash);
    certificationAuthorityMap := HashMap.fromIter<Principal, CertificationAuth>(
            stable_certificationAuthorityMap.vals(), stable_certificationAuthorityMap.size(), Principal.equal, Principal.hash);
  };

  public shared(msg) func registerUser(id: Principal, firstName: Text, lastName: Text, email: Text) : async Text {
    assert not Principal.isAnonymous(msg.caller);
    let newUser: User = {
            firstName = firstName; 
            lastName = lastName;
            email = email;
            principal = msg.caller;
    };
    //check if user is not already registered
    var isUserPresent : Bool = switch (userMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    // a user can not be also registered as a certification authority
    var isCertificationAuthorityPresent : Bool = switch (certificationAuthorityMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    assert not isUserPresent;
    assert not isCertificationAuthorityPresent;
    userMap.put(msg.caller, newUser);
    return "Success";
  };

  public shared(msg) func registerCertificationAuthority(id: Principal, name: Text) : async Text {
    assert not Principal.isAnonymous(msg.caller);
    let newCertificationAuthority: CertificationAuth = {
        name = name; 
        principal = msg.caller;
    };
    //controllare che l'utente non sia già registrato
    var isCertificationAuthorityPresent : Bool = switch (certificationAuthorityMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    // a certification authority can not be also registered as a user
    var isUserPresent : Bool = switch (userMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    assert not isUserPresent;
    assert not isCertificationAuthorityPresent;    
    certificationAuthorityMap.put(msg.caller, newCertificationAuthority);
    return "Success";
  };

  public shared(msg) func isPrincipalAlreadyRegister() : async Bool {
    var isCertificationAuthorityPresent : Bool = switch (certificationAuthorityMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    // a certification authority can not be also registered as a user
    var isUserPresent : Bool = switch (userMap.get(msg.caller)) {
      case null false;
      case (?result) true;
    };
    return isCertificationAuthorityPresent or isUserPresent;
  };


  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
      var ownedNFTs : List.List<Principal> = switch (ownerMap.get(owner)) {
        case null List.nil<Principal>();
        case (?result) result;
      };

      ownedNFTs := List.push(nftId, ownedNFTs);
      ownerMap.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userNFTs : List.List<Principal> = switch (ownerMap.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(userNFTs);
  };

  public query func getLevupCanisterID() : async Principal {
      return Principal.fromActor(Levup);
  };


  // transfer can only be made by the certification authority, 
  // so the principal will be checked if it is the same as that of the authority ptincipal inserted by the applicant
  public shared(msg) func transfer(id: Principal, newOwnerId: Principal) : async Text {
    assert not Principal.isAnonymous(msg.caller);
    var transferedNFT : NFTActorClass.NFT = switch (nftMap.get(id)) {
      case null return "NFT does not exist";
      case (?result) result
    };
    //only the certification authority can confirm and move the transfer process forward
    let certificationAuthorityNftPrincipal = await transferedNFT.getCertificationAuthority();
    assert (certificationAuthorityNftPrincipal == msg.caller or admin == msg.caller);

    let transferResult = await transferedNFT.transferOwnership(newOwnerId);
    if (transferResult == "Success") {
      let backendId = await getLevupCanisterID();
      var ownedNFTs : List.List<Principal> = switch (ownerMap.get(backendId)) {
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
        return listItemId != id;
      });

      addToOwnershipMap(newOwnerId, id);
      return "Success";
    } else {
      Debug.print("hello");
      return transferResult;
      
    }
  };

  public shared(msg) func getPersonalData(isUser: Bool) : async Text {
    var data = "";
    if(isUser){
      for ((key, value) in userMap.entries()) {
        if(msg.caller == key){
          data := value.firstName # value.lastName
        }
      };
    }else{
      for ((key, value) in certificationAuthorityMap.entries()) {
        if(msg.caller == key){
          data := value.name
        }
      };
    };
    return data;
  };

  public shared(msg) func burn(id: Principal) : async Text {
    assert not Principal.isAnonymous(msg.caller);
    var transferedNFT : NFTActorClass.NFT = switch (nftMap.get(id)) {
      case null return "NFT does not exist";
      case (?result) result
    };
    //only the certification authority can confirm and move the transfer process forward
    let certificationAuthorityNftPrincipal = await transferedNFT.getCertificationAuthority();
    let owner = await transferedNFT.getOwner();

    assert (certificationAuthorityNftPrincipal == msg.caller or admin == msg.caller or owner == msg.caller);

     let transferResult = await transferedNFT.transferOwnership(blackHole);
    if (transferResult == "Success") {
      let backendId = await getLevupCanisterID();
      var ownedNFTs : List.List<Principal> = switch (ownerMap.get(msg.caller)) {
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
        return listItemId != id;
      });

      addToOwnershipMap(blackHole, id);
      return "Success";
    } else {
      Debug.print("hello");
      return transferResult;
      
    }
    
  };




  public shared(msg) func mint(data: [Nat8], name: Text, certificationAuthority: Principal) : async Principal {
    assert not Principal.isAnonymous(msg.caller);
    // applicant of the request for certificate
    let futureOwner : Principal = msg.caller;

    Debug.print(debug_show(Cycles.balance()));
    //Cycles.add(100_500_000_000);
    // actor class NFT (name: Text, owner: Principal, content: [Nat8], nftApplicant: Principal, nftCertificationAuthority: Principal) = this {
    let backendId = await getLevupCanisterID();
    let newNFT = await NFTActorClass.NFT(name, backendId, data, futureOwner, certificationAuthority);
    Debug.print(debug_show(Cycles.balance()));

    let newNFTPrincipal = await newNFT.getCanisterId();

    nftMap.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(backendId, newNFTPrincipal);

    return newNFTPrincipal;

  };


};
