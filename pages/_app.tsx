import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/GitHubLink";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faTwitterSquare, faFacebook, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  library.add(fab, faTwitterSquare, faFacebook, faLinkedin, faGithub);

  return (
    <div style={{
      backgroundImage: "url(" + "https://i.ibb.co/gVnGhfQ/GoatBG.png" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    }}>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Head>
          <title>Unreal Goats</title>


        </Head>
        <Component {...pageProps} />

      </ThirdwebProvider>
    </div>
  );
}

export default MyApp;
