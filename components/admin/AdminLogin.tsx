"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { buttonStyles } from "@/components/ui/Button";

export function AdminLogin({ adminKey }: { adminKey: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not sign in.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-ivory px-5">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="font-serif text-4xl">Store admin</h1>
        <p className="mt-3 text-grey">Enter your admin password to manage products.</p>
        <label htmlFor="admin-password" className="mt-8 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="mt-2 h-12 w-full border border-beige bg-white px-4 text-base"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} className={buttonStyles("primary", "mt-6 w-full")}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
