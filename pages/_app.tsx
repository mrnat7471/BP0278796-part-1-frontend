import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {HeroUIProvider} from "@heroui/react";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <HeroUIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HeroUIProvider>
  );
}
