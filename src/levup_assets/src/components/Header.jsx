import React, { useEffect, useState } from "react";
import Minter from "./Minter";
import Gallery from "./Gallery";
import Profile from "./Profile"; 
import ConfirmNft from "./ConfirmNft"; 


import { levup } from "../../../declarations/levup";

import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

function Header(props) {
  const [userOwnedGallery, setOwnedGallery] = useState();

  async function getNFTs() {
    if(props.principal){
      const userNFTIds = await levup.getOwnedNFTs(props.principal);
      console.log(userNFTIds);
      setOwnedGallery(
        <Gallery title="My NFTs" ids={userNFTIds} principal={props.principal} role="collection" />
      );
    }

  }

  useEffect(() => {
    getNFTs();
  }, []);

  
  function renderNavLinks() {
    console.log(props)
  if (props.type === "user") {
    return (
      <>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/minter">Crea nuovo NFT</Link>
        </button>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/profile">Profile</Link>
        </button>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/collection">NFT Collection</Link>
        </button>
      </>
    );
  } else if (props.type === "cert") {
    return (
      <>
        <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/confirm-nft">Confirm NFT</Link>
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
          <ConfirmNft />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
