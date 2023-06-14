import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { levup } from "../../../declarations/levup";

function Profile(props) {
  const [type, setType] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [principal, setPrincipal] = useState(true);
  const [name, setName] = useState(true);

  useEffect(() => {
    setType(props.type);
  }, [props.type]);

  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    // Simulazione chiamata API per inviare le modifiche
    const fullname = data.name;
    const type = data.type;
    console.log(data);
    const newUser = await levup.registerUser(props.principal, fullname, type);
    console.log(newUser);
    setLoaderHidden(false);
    setName(newUser.name);
    setType(newUser.userType);
    setPrincipal(newUser.principal.toText())
  };

  console.log(type)
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
