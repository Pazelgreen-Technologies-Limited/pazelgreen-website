"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InitialPasswordForm({ id, email }: { id: number; email: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const inputClass = "cms:my-3 cms:block cms:w-full cms:rounded-md cms:border cms:border-solid cms:p-3";
  return <form onSubmit={async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmation")) { setMessage("Passwords must match."); return; }
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      if (!response.ok) { setMessage("Unable to save. Use an available email and a different password of 12–256 characters."); return; }
      await fetch("/api/users/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch { setMessage("Unable to connect. Please try again."); }
    finally { setPending(false); }
  }}>
    <label htmlFor="email">Email</label>
    <input id="email" name="email" type="email" autoComplete="email" defaultValue={email} required className={inputClass} />
    <label htmlFor="password">New password</label>
    <input id="password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={256} required className={inputClass} />
    <label htmlFor="confirmation">Confirm new password</label>
    <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={256} required className={inputClass} />
    <button type="submit" disabled={pending} className="cms:rounded-md cms:border-0 cms:bg-green-800 cms:px-5 cms:py-3 cms:font-semibold cms:text-white cms:disabled:opacity-50">{pending ? "Saving…" : "Save and sign in again"}</button>
    <p role="status">{message}</p>
  </form>;
}
