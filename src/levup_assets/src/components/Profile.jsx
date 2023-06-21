import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/levup";

function Profile(props) {
  const [type, setType] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [principal, setPrincipal] = useState(true);
  const [name, setName] = useState(true);

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
    if(user){
      setName(user.name);
      setType(user.userType);
      setPrincipal(user.principal.toText());
    }
    setLoaderHidden(true)

  }

  useEffect(() => {
    fetchUserData()
  }, [props.type]);

  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    // Simulazione chiamata API per inviare le modifiche
    const fullname = data.name;
    const type = data.type;
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const newUser = await authenticatedCanister.registerUser(fullname, type);
    setLoaderHidden(false);
    setName(newUser.name);
    setType(newUser.userType);
    setPrincipal(newUser.principal.toText())
  };

  if (!type) {
    return (
        <div className="minter-container">
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="m-10 disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
          Enter your personal information and your role within the Levup ecosystem
        </p>
      <form className="makeStyles-form-109" noValidate="" autoComplete="off">
      <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="Insert your name"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div >
            <div >
            <label>
              User Type:
              <select                 
                {...register("type")}>
                <option value="user">User</option>
                <option value="cert">Certification Authority</option>
              </select>
            </label>

              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>

       
        <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">
              Submit
            </span>
          </div>
      </form>
    </div>
    );
  } else {
    return (
      <>
        <h2>Name: {name}</h2>
        <h4>User Type: {type}</h4>
        <h4>User Principal: {principal}</h4>
      </>
    );
  }
}
export default Profile;
