"use client";

import { useState } from "react";
import Link from "next/link";

export function ActivationForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  return <form onSubmit={async (event) => {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/invitations/accept", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: new URLSearchParams(window.location.search).get("token"), password: form.get("password") }) });
      const result = await response.json();
      setMessage(response.ok ? result.message : result.error ?? "Unable to activate the invitation.");
      if (response.ok) { setComplete(true); window.history.replaceState(null, "", window.location.pathname); }
    } catch { setMessage("Unable to connect. Please try again."); }
    finally { setPending(false); }
  }}>
    {!complete && <><label htmlFor="password">New password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={256} required className="cms:my-3 cms:block cms:w-full cms:rounded-md cms:border cms:border-solid cms:p-3" />
      <button type="submit" disabled={pending} className="cms:rounded-md cms:border-0 cms:bg-green-800 cms:px-5 cms:py-3 cms:font-semibold cms:text-white cms:disabled:opacity-50">{pending ? "Activating…" : "Activate account"}</button></>}
    <p role="status">{message}</p>
    {complete && <Link href="/admin/login">Sign in</Link>}
  </form>;
}
