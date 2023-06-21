import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

/*
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
};*/

const init = async () => {
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    showLoginButton()
  }
};

async function handleLogin(){
  const authClient = await AuthClient.create();

  await authClient.login({
    identityProvider: process.env.II_URL,
    onSuccess: () => {
      handleAuthenticated(authClient);
    },
  });
};

function showLoginButton() {
  const hasToLogin = true;
  ReactDOM.render(
    <App hasToLogin={hasToLogin} handleLogin={handleLogin}/>,
    document.getElementById("root")
  );
}

async function handleAuthenticated(authClient) {
  const hasToLogin = false;
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal;
  if(userPrincipal){
    console.log(userPrincipal.toText());
  }
  ReactDOM.render(
    <App loggedInPrincipal={userPrincipal} hasToLogin={hasToLogin}/>,
    document.getElementById("root")
  );
}

init();