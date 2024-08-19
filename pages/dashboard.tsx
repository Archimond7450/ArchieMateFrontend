import React from "react";
import Head from "next/head";
import { useGlobalState } from "../context/GlobalStateContext";
import { SwitchTextTrack } from "../components/SwitchTextTrack";

const DashboardPage = (): JSX.Element => {
  const { state } = useGlobalState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (state.loggedUser !== undefined) {
      setLoading(false);
    }
  }, [state.loggedUser]);

  if (loading) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      <Head>
        <title>ArchieMate</title>
      </Head>
      <h1>Dashboard</h1>
      <p>Welcome, {state.loggedUser?.displayName}!</p>
      <SwitchTextTrack />
    </React.Fragment>
  );
};

export default DashboardPage;
