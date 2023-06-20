import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { canisterId, createActor } from "../../../declarations/levup";
import { AuthClient } from "@dfinity/auth-client";


function App(props) {
  // const NFTID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loaderHidden, setLoaderHidden] = useState(true);



  async function fetchUserData(){
    setLoaderHidden(false)
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const user = await authenticatedCanister.getPersonalData();
    console.log(user);
    setName(user.name);
    setType(user.userType);
    setLoaderHidden(true)

  }

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="App">
      <Header principal={props.loggedInPrincipal} type = {type} name = {name}/>
      <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
       <Footer />
    </div>
  );
}

export default App;
