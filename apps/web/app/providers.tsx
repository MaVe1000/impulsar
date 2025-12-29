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

// CRITICAL: Crossmint SÍ soporta "stellar-testnet" para MVP
// El tipo TypeScript puede estar desactualizado, por eso usamos 'as any'
const chain = "stellar-testnet" as any;

// Debug: Verificar que la chain esté configurada correctamente
if (typeof window !== "undefined") {
  console.log("🔧 Crossmint Chain Configuration:");
  console.log("  chain value:", chain);
  console.log("  Expected: stellar-testnet (para MVP)");
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CrossmintProvider apiKey={process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || ""}>
      <CrossmintAuthProvider loginMethods={["email"]}>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: "stellar-testnet" as any, // ← FORZADO para testnet (MVP)
            signer: { type: "email" },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}