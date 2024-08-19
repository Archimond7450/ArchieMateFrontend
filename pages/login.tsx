import React from "react";
import Button from "@mui/material/Button";
import Head from "next/head";

const LoginPage = (): JSX.Element => {
  return (
    <React.Fragment>
      <Head>
        <title>ArchieMate</title>
      </Head>
      <h1>Login</h1>
      <Button href={`/oauth/twitch`} variant="contained">
        Twitch login
      </Button>
    </React.Fragment>
  );
};

export default LoginPage;
