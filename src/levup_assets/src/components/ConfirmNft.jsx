import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/levup";


function ConfirmNft(props) {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const [loaderHidden, setLoaderHidden] = useState(true);

  async function onSubmit(data) {
    setLoaderHidden(false);
    const nftPrincipal = data.nftPrincipal;
    const newOwnerPrincipal = data.newOwnerPrincipal;
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const result = await authenticatedCanister.transfer(Principal.fromText(nftPrincipal), Principal.fromText(newOwnerPrincipal));
    setResult(result);
    setLoaderHidden(true);
  }

  if (result == "") {
    return (
      <div className="minter-container">
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Confirm NFT Certifcation
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Principal NFT
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Principal new Owner
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("nftPrincipal", { required: true })}
                placeholder="Insert Principal of the NFT"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("newOwnerPrincipal", { required: true })}
                placeholder="Insert principal of the new owner"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">
              Confirm Certification
            </span>
          </div>
        </form>
      </div>
    );
  } else if(result == "Success") {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Confirmed!
        </h3>
      </div>
    );
  } else {
    return (
    <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Not confirmed!
        </h3>
      </div>
    );
  }
}

export default ConfirmNft;