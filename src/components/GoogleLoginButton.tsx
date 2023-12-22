"use client";

import { signIn } from "next-auth/react";

import { Button } from "./ui/button";

export const GoogleLoginButton = () => {
  return (
    <Button
      onClick={() => {
        try {
          signIn("google");
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Sign in with Google
    </Button>
  );
};
