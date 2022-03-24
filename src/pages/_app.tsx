import "../styles/globals.css";
import "tui-image-editor/dist/tui-image-editor.min.css";
import "app/components/ImageEditor/style.css";

import Portals from "app/components/Portals";
import store from "app/state";
import Layout from "components/Layout";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import dynamic from 'next/dynamic';

const PWAPrompt: any = dynamic(() => import('react-ios-pwa-prompt'), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <> 
    <ReduxProvider store={store}>
      <Layout>
      <PWAPrompt
          timesToShow={2}
          permanentlyHideOnDismiss={false}
          copyTitle="Sushi now on iOS"
          copyBody="Sushi works best when added to the homescreen. Tap the share button to add Sushi to your home screen."
          copyClosePrompt="Close"
        />
        <Component {...pageProps} />
      </Layout>
      <Portals />
    </ReduxProvider>
    </>
  );
}

export default MyApp;
