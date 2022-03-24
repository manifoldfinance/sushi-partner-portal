import "../styles/globals.css";
import "tui-image-editor/dist/tui-image-editor.min.css";
import "app/components/ImageEditor/style.css";

import Portals from "app/components/Portals";
import store from "app/state";
import Layout from "components/Layout";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import PWAPrompt from 'react-ios-pwa-prompt'
import { useRouter } from 'next/router'
import React, { Component, Fragment, useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

  function MyApp({ Component, pageProps, fallback, err }) {
    const router = useRouter()
    const { locale, events } = router

  function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo(0, 0)
      /** `
    
       if (isProd) {
        Fathom.trackPageview();

      } */
    }, [pathname])

    return null
  }
  const Index = () => {
    useEffect(() => {}, [])
  return (
  <>
           <PWAPrompt
          timesToShow={2}
          permanentlyHideOnDismiss={false}
          copyTitle="Sushi now on iOS"
          copyBody="Sushi works best when added to the homescreen. Tap the share button to add Sushi to your home screen."
          copyClosePrompt="Close"
        />
    <ReduxProvider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Portals />
    </ReduxProvider>
    </>
    )
  }
}

export default MyApp
