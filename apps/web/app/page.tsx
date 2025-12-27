"use client";

import { EmbeddedAuthForm, useAuth, useWallet } from "@crossmint/client-sdk-react-ui";

export default function Home() {
  const { status: authStatus } = useAuth();
  const { wallet, status: walletStatus } = useWallet();

  if (authStatus !== "logged-in") {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <EmbeddedAuthForm />
      </main>
    );
  }

  if (walletStatus === "in-progress") {
    return <main className="p-8">Creating wallet...</main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Wallet ready</h1>
      <p className="mt-2">Address:</p>
      <code className="block mt-1 break-all">{wallet?.address}</code>
    </main>
  );
}