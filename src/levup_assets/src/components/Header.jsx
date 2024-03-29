import React, { useEffect, useState } from "react";
import Minter from "./Minter";
import Gallery from "./Gallery";
import Profile from "./Profile"; 
import ConfirmNft from "./ConfirmNft"; 
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/levup";

import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

function Header(props) {
  const [userOwnedGallery, setOwnedGallery] = useState();



  async function getNFTs() {
    if(props.principal){
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const authenticatedCanister = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
      const userNFTIds = await authenticatedCanister.getOwnedNFTs();
      setOwnedGallery(
        <Gallery title="My Certifications" ids={userNFTIds} principal={props.principal} role="collection" />
      );
    }

  }

  async function handleLogout() {
    await authClient.logout();
    window.location.reload();
  }

  useEffect(() => {
    getNFTs();
  }, []);

  
  function renderNavLinks() {
  if (props.type === "user") {
    return (
      <>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/minter">Upload new Certification</Link>
        </button>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/profile">Profile</Link>
        </button>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/collection">My Certifications</Link>
        </button>
      </>
    );
  } else if (props.type === "cert") {
    return (
      <>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/confirm-nft">Confirm Certification</Link>
        </button>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/profile">Profile</Link>
        </button>
      </>
    );
  } else {
    // Tipo utente null o undefined
    return (
      <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
        <Link to="/profile">Profile</Link>
      </button>
    );
  }
}


  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">Levup</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            {renderNavLinks()}
            <button
              id="logout"
              className="ButtonBase-root Button-root Button-text header-navButtons-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>
      </div>
      
      <Switch>
        <Route exact path="/">
         <div>LEVUP</div> 
        </Route>
        <Route path="/minter">
          <Minter type={props.type} principal={props.principal}/>
        </Route>
   	    <Route path="/profile">
          <Profile type={props.type} principal={props.principal} />
        </Route>
        <Route path="/collection">{userOwnedGallery}</Route>
        <Route path="/confirm-nft" type={props.type} principal={props.principal}>
          <ConfirmNft type={props.type} principal={props.principal} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
