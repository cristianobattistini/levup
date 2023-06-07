import React, { useState } from 'react';
import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

const LoginButton = () => {
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const authClient = await AuthClient.create();

      if(await authClient.isAuthenticated()){
        console.log("you are logged")
      }

      await new Promise((resolve) => {
        authClient.login({
          identityProvider: process.env.II_URL,
          onSuccess: resolve,
        });
      });

      // At this point we're authenticated, and we can get the identity from the auth client:
      const identity = authClient.getIdentity();
      console.log(identity)
      // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
      const agent = new HttpAgent({ identity });
      // Using the interface description of our webapp, we create an actor that we use to call the service methods. We override the global actor, such that the other button handler will automatically use the new actor with the Internet Identity provided delegation.
    

      // Continue with any additional logic after successful login

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button id="login" onClick={handleLogin}>
      Login
    </button>
  );
};

export default LoginButton;
