import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { canisterId, createActor } from "../../../declarations/levup";
import { AuthClient } from "@dfinity/auth-client";


function App(props) {
  console.log(props)
  // const NFTID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [hasToLogin, setHasToLogin] = useState(true);
  const [principal, setPrincipal] = useState("");


  async function handleLogin(){
    const authClient = await AuthClient.create();
  
    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: async () => {
        await handleAuthenticated(authClient);
      },
    });
  };

  async function handleAuthenticated(authClient) {
    const identity = await authClient.getIdentity();
    const userPrincipal = identity._principal;
    if(userPrincipal){
      console.log(userPrincipal.toText());
      setPrincipal(userPrincipal.toText());
    }
    setHasToLogin(false);
    await fetchUserData()
    console.log(hasToLogin)
  }



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
    if(props.hasToLogin){
      setHasToLogin(props.hasToLogin);
    }
    setPrincipal(props.loggedInPrincipal)
  }, []);
  return (
    <div className="App">
      <Header principal={props.loggedInPrincipal} type = {type} name = {name}/>
      <div hidden={principal} className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleLogin} className="form-Chip-label">
              Login
            </span>
          </div>
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
