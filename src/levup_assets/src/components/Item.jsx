import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/levup";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [nftId, setNftId] = useState();
  const [applicant, setApplicant] = useState();
  const [authPrincipal, setCertificationAuthority] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id;

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });

  //TODO: When deploy live, remove the following line.
  agent.fetchRootKey();
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const authPrincipal = await NFTActor.getCertificationAuthority();
    const applicant = await NFTActor.getApplicant();
    const nftId = await NFTActor.getCanisterId()

    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);
    setCertificationAuthority(authPrincipal.toText()); 
    setApplicant(applicant.toText()); 
    setNftId(nftId.toText()); 
    setLoaderHidden(true);
    setDisplay(true);
  }

  useEffect(() => {
    loadNFT();
  }, []);


  return (
    <div
      style={{ display: shouldDisplay ? "inline" : "none" }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            <strong>Certification Title:</strong> {name}
          </p>
          <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
          <strong>Certification ID:</strong> {nftId}
          </p>
          <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
          <strong>Owner:</strong> {owner}
          </p>
          <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
          <strong>Applicant:</strong> {applicant}
          </p>
          <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            <strong>Certification Authority:</strong> {authPrincipal}
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default Item;
