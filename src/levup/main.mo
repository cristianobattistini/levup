import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor levup{
  public query (message) func greet() : async Text {
    return "Hello, " # Principal.toText(message.caller) # "!";
  };

  public type Note = {

    title: Text;
    content: Text
  };

  stable var notes: List.List<Note> = List.nil<Note>();

  public func createNote(titleText: Text, contentText: Text){

    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    notes := List.push(newNote, notes);
    Debug.print(debug_show(notes));
  };

  public query func getNotes(): async [Note] {
    return List.toArray(notes);
  };


  public func removeNote(index: Nat){
    //to esclude from list
    let listFront = List.take(notes, index);
    let listBack = List.drop(notes, index + 1);
    notes := List.append(listFront, listBack);  
  };

  stable var balanceEntries: [(Principal, Nat)] = [];


  var owner : Principal = Principal.fromText("rnn4p-xv3hp-ivazl-hg2mb-iwkct-3emfl-upkcr-tz7dm-uxxqk-c7hux-nae");
  var totalSupply: Nat = 1000000000;
  var symbol: Text = "DCNE";
  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);


  public query func balanceOf(who: Principal) : async Nat {

    let balance: Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
    return balance;
  };

  public shared(msg) func payOut() : async Text {
    Debug.print(debug_show(msg.caller));
    if(balances.get(msg.caller) == null){
      let amount = 10000;
      let result = await transfer(msg.caller, amount);
      return result;
    }else{
      return "Already claimed tokens";
    }
  };

  public shared(msg) func transfer(to: Principal, amount: Nat): async Text {
    let fromBalance = await balanceOf(msg.caller);
    if(fromBalance >= amount){
      let newFromBalance : Nat= fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance = await balanceOf(to);
      let newBalance = toBalance + amount;
      balances.put(to, newBalance);

      return "Success";
    }else{
      return "Non ci sono soldi"
    }
  };

  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if(balances .size() < 1){
      balances.put(owner, totalSupply);
    }
  };


};
