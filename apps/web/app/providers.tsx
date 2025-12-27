// import type { Chain } from "@crossmint/wallets-sdk"; : not available in testnet
"use client";

import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";

if (!process.env.NEXT_PUBLIC_CROSSMINT_API_KEY) {
  throw new Error("NEXT_PUBLIC_CROSSMINT_API_KEY is not set");
}

// const chain = (process.env.NEXT_PUBLIC_CHAIN ?? "") as unknown as Chain; not available in testnet
const chain = (process.env.NEXT_PUBLIC_CHAIN ?? "") as any;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CrossmintProvider apiKey={process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || ""}>
      <CrossmintAuthProvider loginMethods={["email"]}>
        <CrossmintWalletProvider
          createOnLogin={{
            chain,
            signer: { type: "email" },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}