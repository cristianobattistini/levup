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
    name: Text;
    principal: Principal;
    userType : Text;
  };

  private stable var blackHole: Principal = Principal.fromText("aaaaa-aa");

  var nftMap = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var ownerMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var userMap = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);


  stable var stable_nftMap: [(Principal, NFTActorClass.NFT)] = [];
  private stable var stable_ownedNftByUser: [(Principal, List.List<Principal>)] = [];
  stable var stable_userMap: [(Principal, User)] = [];


  private let adminsList = List.push<Principal>(Principal.fromText("rnn4p-xv3hp-ivazl-hg2mb-iwkct-3emfl-upkcr-tz7dm-uxxqk-c7hux-nae"), null);
  private let admin = Principal.fromText("rnn4p-xv3hp-ivazl-hg2mb-iwkct-3emfl-upkcr-tz7dm-uxxqk-c7hux-nae");
  // The work required before a canister upgrade begins.
  system func preupgrade() {
    // saving all nft stored in dapp
    stable_nftMap := Iter.toArray(nftMap.entries());
    // saving all nft stored by the user
    stable_ownedNftByUser := Iter.toArray(ownerMap.entries());
    stable_userMap := Iter.toArray(userMap.entries());
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
  };

  public shared(msg) func registerUser(callerId: Principal, name: Text, userType: Text) : async User {
    assert not Principal.isAnonymous(callerId);
    //check if user is not already registered
    var isUserPresent : Bool = switch (userMap.get(callerId)) {
      case null false;
      case (?result) true;
    };
    // a user can not be also registered as a certification authority
    assert not isUserPresent;
    var newUserRegistered : User = {
      name = "";
      principal = blackHole;
      userType = "";
    }; 
   if(userType == "user"){
      let newUser: User = {
                  name = name;
                  principal = callerId;
                  userType = userType;
      };
      newUserRegistered := newUser;
    };
    if(userType == "cert"){
      let newCertificationAuthority: User = {
        name = name; 
        principal = callerId;
        userType = "cert"
    };
      newUserRegistered := newCertificationAuthority;
    };
    userMap.put(callerId, newUserRegistered);

    return newUserRegistered
  };

  public shared(msg) func isPrincipalAlreadyRegistered(callerId: Principal) : async Bool {
    // todo: fix with msg.caller
    // a certification authority can not be also registered as a user
    var isUserPresent : Bool = switch (userMap.get(callerId)) {
      case null false;
      case (?result) true;
    };
    return isUserPresent;
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
  public shared(msg) func transfer(callerId: Principal, id: Principal, newOwnerId: Principal) : async Text {
    assert not Principal.isAnonymous(callerId);
    var transferedNFT : NFTActorClass.NFT = switch (nftMap.get(id)) {
      case null return "NFT does not exist";
      case (?result) result
    };
    //only the certification authority can confirm and move the transfer process forward
    let certificationAuthorityNftPrincipal = await transferedNFT.getCertificationAuthority();
    assert (certificationAuthorityNftPrincipal == callerId or admin == callerId);

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

  public shared(msg) func getPersonalData(callerId: Principal) : async User {
    var data : User = {
      name = "";
      principal = blackHole;
      userType = "";
    };
                Debug.print(debug_show(userMap.size()));
    for ((key, value) in userMap.entries()) {
                    Debug.print("hello");

            Debug.print(debug_show(key));
                          Debug.print("hello");

            Debug.print(debug_show(callerId));

      if(callerId == key){
              Debug.print("hello");

        data := value;
      }
    };
    return data;
  };

  public shared(msg) func burn(callerId: Principal, id: Principal) : async Text {
    assert not Principal.isAnonymous(callerId);
    var transferedNFT : NFTActorClass.NFT = switch (nftMap.get(id)) {
      case null return "NFT does not exist";
      case (?result) result
    };
    //only the certification authority can confirm and move the transfer process forward
    let certificationAuthorityNftPrincipal = await transferedNFT.getCertificationAuthority();
    let owner = await transferedNFT.getOwner();

    assert (certificationAuthorityNftPrincipal == callerId or admin == callerId or owner == callerId);

     let transferResult = await transferedNFT.transferOwnership(blackHole);
    if (transferResult == "Success") {
      let backendId = await getLevupCanisterID();
      var ownedNFTs : List.List<Principal> = switch (ownerMap.get(callerId)) {
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




  public shared(msg) func mint(callerId: Principal, data: [Nat8], name: Text, certificationAuthority: Principal) : async Principal {
    assert not Principal.isAnonymous(callerId);
    // applicant of the request for certificate
    let futureOwner : Principal = callerId;

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
