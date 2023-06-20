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
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input {...register("name")} />
        </label>
        <label>
          User Type:
          <select {...register("type")}>
            <option value="user">User</option>
            <option value="cert">Certification Authority</option>
          </select>
        </label>
        <button type="submit">Submit</button>
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
