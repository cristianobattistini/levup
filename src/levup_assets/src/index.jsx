import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }
};

async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal;
  if(userPrincipal){
    console.log(userPrincipal.toText());
  }
  ReactDOM.render(
    <App loggedInPrincipal={userPrincipal} />,
    document.getElementById("root")
  );
}

init();