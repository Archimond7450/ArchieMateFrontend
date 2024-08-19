import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { GlobalStateProvider } from "../context/GlobalStateContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalStateProvider>
  );
}

export default MyApp;
